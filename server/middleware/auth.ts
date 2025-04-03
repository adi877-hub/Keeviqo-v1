import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db';
import * as schema from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { createAuditLog } from '../utils/security';
import { GovernmentPartner, PartnerRequest, EmergencyRequest, EmergencyUser } from '../../shared/types';

type IpAddress = string;

const JWT_SECRET = process.env.JWT_SECRET || 'keeviqo-jwt-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

interface JwtPayload {
  userId: number;
  uuid: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    uuid: string;
    role: string;
  };
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(userId: number, uuid: string, role: string): string {
  const payload = { userId, uuid, role };
  const secret = JWT_SECRET || 'keeviqo-jwt-secret-key';
  return jwt.sign(
    payload,
    secret,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET as jwt.Secret) as JwtPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Authentication middleware
 * Verifies the JWT token in the Authorization header
 */
export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = {
      id: payload.userId,
      uuid: payload.uuid,
      role: payload.role
    };

    createAuditLog(
      payload.userId,
      'authenticate',
      'auth',
      payload.userId.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { path: req.path, method: req.method }
    ).catch(err => console.error('Failed to create audit log:', err));

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

/**
 * Role-based authorization middleware
 * Checks if the authenticated user has the required role
 */
export function authorize(roles: string[]): (req: AuthRequest, res: Response, next: NextFunction) => void {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
}

/**
 * Government partner authentication middleware
 * Verifies the API key and signature for government partner API requests
 */
export async function authenticatePartner(req: PartnerRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    const signature = req.headers['x-signature'] as string;
    const timestamp = req.headers['x-timestamp'] as string;

    if (!apiKey || !signature || !timestamp) {
      res.status(401).json({ error: 'Partner authentication required' });
      return;
    }

    const partner = await db.query.governmentPartners.findFirst({
      where: eq(schema.governmentPartners.apiKey, apiKey)
    });

    if (!partner || !partner.active || partner.status !== 'active') {
      res.status(401).json({ error: 'Invalid API key or inactive partner' });
      return;
    }

    const data = `${req.method}${req.path}${timestamp}${JSON.stringify(req.body)}`;
    const crypto = await import('crypto');
    const apiSecret = partner.apiSecret || '';
    const hmac = crypto.createHmac('sha512', apiSecret);
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');

    const signatureBuffer = Buffer.from(signature || '');
    const expectedBuffer = Buffer.from(expectedSignature);
    
    if (signatureBuffer.length !== expectedBuffer.length || 
        !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    const timestampNum = parseInt(timestamp);
    if (isNaN(timestampNum)) {
      res.status(401).json({ error: 'Invalid timestamp format' });
      return;
    }
    
    const requestTime = new Date(timestampNum);
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000;

    if (Math.abs(now.getTime() - requestTime.getTime()) > fiveMinutes) {
      res.status(401).json({ error: 'Request timestamp expired' });
      return;
    }

    req.partner = partner;

    createAuditLog(
      0, // No user ID for partner authentication
      'partner_authenticate',
      'partner',
      partner.id.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { 
        path: req.path, 
        method: req.method, 
        partnerId: partner.id, 
        partnerName: partner.name || 'Unknown Partner' 
      }
    ).catch(err => console.error('Failed to create audit log:', err));

    next();
  } catch (error) {
    console.error('Partner authentication error:', error);
    res.status(500).json({ error: 'Partner authentication failed' });
  }
}

/**
 * Emergency access middleware
 * Allows access to emergency data without full authentication
 */
export async function emergencyAccess(req: EmergencyRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const emergencyToken = req.headers['x-emergency-token'] as string;
    const userId = parseInt(req.params.userId);

    if (!emergencyToken || isNaN(userId)) {
      res.status(401).json({ error: 'Emergency access token required' });
      return;
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId)
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isValidEmergencyToken = emergencyToken === `emergency-${user.uuid || ''}`;

    if (!isValidEmergencyToken) {
      res.status(401).json({ error: 'Invalid emergency token' });
      return;
    }

    req.emergencyUser = {
      id: user.id.toString(),
      uuid: user.uuid || ''
    };

    createAuditLog(
      user.id,
      'emergency_access',
      'emergency',
      user.id.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { 
        path: req.path, 
        method: req.method,
        userId: user.id,
        userName: user.name || 'Unknown User'
      }
    ).catch(err => console.error('Failed to create audit log:', err));

    next();
  } catch (error) {
    console.error('Emergency access error:', error);
    res.status(500).json({ error: 'Emergency access failed' });
  }
}
