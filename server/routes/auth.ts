import express from 'express';
import { db } from '../utils/db';
import * as schema from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { 
  hashPassword, 
  generateSalt, 
  verifyPassword, 
  createOTP, 
  verifyOTP,
  createAuditLog,
  generateRSAKeyPair,
  encryptPrivateKey
} from '../utils/security';
import { generateToken, authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

/**
 * Register a new user
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });
    
    if (existingUser) {
      return res.status(400)on({ error: 'User already exists' });
    }
    
    const passwordSalt = await generateSalt();
    const hashedPassword = await hashPassword(password, passwordSalt);
    
    const { publicKey, privateKey } = await generateRSAKeyPair();
    const salt = await generateSalt();
    const { encryptedKey, iv } = await encryptPrivateKey(privateKey, password, salt);
    
    const [encryptionKey] = await db.insert(schema.encryptionKeys).values({
      publicKey,
      encryptedPrivateKey: encryptedKey,
      salt,
      iv,
      algorithm: 'AES-256-GCM',
      active: true
    }).returning();
    
    const [user] = await db.insert(schema.users).values({
      name,
      email,
      password: hashedPassword,
      passwordSalt,
      phoneNumber,
      role: 'user',
      preferredLanguage: 'he',
      country: 'Israel',
      dataEncryptionKeyId: encryptionKey.id
    }).returning();
    
    const _otp = await createOTP(user.id, 'email', 'verification');
    
    
    createAuditLog(
      user.id,
      'register',
      'user',
      user.id.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { email: user.email },
      'info'
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(201)on({
      message: 'User registered successfully',
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500)on({ error: 'Registration failed' });
  }
});

/**
 * Login user
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });
    
    if (!user) {
      return res.status(401)on({ error: 'Invalid credentials' });
    }
    
    if (user.lockedUntil && new Date(user.lockedUntil.toString()) > new Date()) {
      return res.status(401)on({ 
        error: 'Account is locked. Please try again later or reset your password.' 
      });
    }
    
    const isPasswordValid = await verifyPassword(password, user.passwordSalt || '', user.password || '');
    
    if (!isPasswordValid) {
      const loginAttempts = (user.loginAttempts || 0) + 1;
      
      let lockedUntil = null;
      if (loginAttempts >= 5) {
        const lockTime = new Date();
        lockTime.setMinutes(lockTime.getMinutes() + 30); // Lock for 30 minutes
        lockedUntil = lockTime as unknown as null;
      }
      
      await db
        .update(schema.users)
        .set({ 
          loginAttempts, 
          lockedUntil 
        })
        .where(eq(schema.users.id, user.id));
      
      return res.status(401)on({ error: 'Invalid credentials' });
    }
    
    await db
      .update(schema.users)
      .set({ 
        loginAttempts: 0, 
        lockedUntil: null,
        lastLogin: new Date()
      })
      .where(eq(schema.users.id, user.id));
    
    if (user.twoFactorEnabled) {
      const _otp = await createOTP(user.id, 'app', 'login');
      
      
      return res.status(200)on({
        message: 'OTP sent for verification',
        userId: user.id,
        requiresOTP: true
      });
    }
    
    const token = generateToken(user.id, user.uuid || '', user.role || 'user');
    
    createAuditLog(
      user.id,
      'login',
      'user',
      user.id.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { email: user.email },
      'info'
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(200)on({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500)on({ error: 'Login failed' });
  }
});

/**
 * Verify OTP
 * POST /api/auth/verify-otp
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp, purpose } = req.body;
    
    if (!userId || !otp || !purpose) {
      return res.status(400)on({ error: 'Missing required fields' });
    }
    
    const isValid = await verifyOTP(userId, otp, purpose);
    
    if (!isValid) {
      return res.status(401)on({ error: 'Invalid or expired OTP' });
    }
    
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId)
    });
    
    if (!user) {
      return res.status(404)on({ error: 'User not found' });
    }
    
    if (purpose === 'verification') {
      await db
        .update(schema.users)
        .set({ emailVerified: true })
        .where(eq(schema.users.id, userId));
      
      return res.status(200)on({ message: 'Email verified successfully' });
    } else if (purpose === 'login') {
      const token = generateToken(user.id, user.uuid || '', user.role || 'user');
      
      createAuditLog(
        user.id,
        'login_with_otp',
        'user',
        user.id.toString(),
        req.ip || '0.0.0.0',
        req.headers['user-agent'] || 'unknown',
        { email: user.email },
        'info'
      ).catch(err => console.error('Failed to create audit log:', err));
      
      return res.status(200)on({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else if (purpose === 'password_reset') {
      return res.status(200)on({ 
        message: 'OTP verified. You can now reset your password',
        resetToken: otp
      });
    }
    
    res.status(400)on({ error: 'Invalid OTP purpose' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500)on({ error: 'OTP verification failed' });
  }
});

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });
    
    if (!user) {
      return res.status(200)on({ message: 'If your email is registered, you will receive a password reset link' });
    }
    
    const _otp = await createOTP(user.id, 'email', 'password_reset', 60); // 60 minutes expiry
    
    
    createAuditLog(
      user.id,
      'password_reset_request',
      'user',
      user.id.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { email: user.email },
      'info'
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(200)on({ message: 'If your email is registered, you will receive a password reset link' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500)on({ error: 'Password reset request failed' });
  }
});

/**
 * Reset password
 * POST /api/auth/reset-password
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { userId, resetToken, newPassword } = req.body;
    
    const isValid = await verifyOTP(userId, resetToken, 'password_reset');
    
    if (!isValid) {
      return res.status(401)on({ error: 'Invalid or expired reset token' });
    }
    
    const passwordSalt = await generateSalt();
    const hashedPassword = await hashPassword(newPassword, passwordSalt);
    
    await db
      .update(schema.users)
      .set({ 
        password: hashedPassword,
        passwordSalt,
        loginAttempts: 0,
        lockedUntil: null
      })
      .where(eq(schema.users.id, userId));
    
    createAuditLog(
      userId,
      'password_reset',
      'user',
      userId.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      {},
      'warning'
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(200)on({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500)on({ error: 'Password reset failed' });
  }
});

/**
 * Get current user
 * GET /api/auth/me
 */
router.get('/me', authenticate, (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401)on({ error: 'Authentication required' });
    }
    
    res.status(200)on({ user: req.user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500)on({ error: 'Failed to get user information' });
  }
});

/**
 * Logout user
 * POST /api/auth/logout
 */
router.post('/logout', authenticate, (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401)on({ error: 'Authentication required' });
    }
    
    createAuditLog(
      req.user.id,
      'logout',
      'user',
      req.user.id.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      {},
      'info'
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(200)on({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500)on({ error: 'Logout failed' });
  }
});

export default router;
