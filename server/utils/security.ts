import crypto from 'crypto';
import { promisify } from 'util';
import { db } from './db';
import * as schema from '../../shared/schema';
import { eq } from 'drizzle-orm';

const randomBytes = promisify(crypto.randomBytes);
const pbkdf2 = promisify(crypto.pbkdf2);
const generateKeyPair = promisify(crypto.generateKeyPair);

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const HASH_ALGORITHM = 'sha512';
const SALT_BYTES = 32;
const IV_BYTES = 16;
const KEY_LENGTH = 32; // 256 bits
const ITERATIONS = 100000;
const TAG_LENGTH = 16;

/**
 * Generate a random salt for password hashing
 */
export async function generateSalt(): Promise<string> {
  const salt = await randomBytes(SALT_BYTES);
  return salt.toString('hex');
}

/**
 * Hash a password with a salt using PBKDF2
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const derivedKey = await pbkdf2(
    password,
    Buffer.from(salt, 'hex'),
    ITERATIONS,
    KEY_LENGTH,
    HASH_ALGORITHM
  );
  return derivedKey.toString('hex');
}

/**
 * Verify a password against a stored hash
 */
export async function verifyPassword(password: string, salt: string, storedHash: string): Promise<boolean> {
  const hash = await hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

/**
 * Generate a random initialization vector for encryption
 */
export async function generateIV(): Promise<string> {
  const iv = await randomBytes(IV_BYTES);
  return iv.toString('hex');
}

/**
 * Encrypt data using AES-256-GCM
 */
export async function encryptData(data: string, key: Buffer, iv: Buffer): Promise<{ encryptedData: string, tag: string }> {
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  
  return { encryptedData: encrypted, tag };
}

/**
 * Decrypt data using AES-256-GCM
 */
export async function decryptData(encryptedData: string, key: Buffer, iv: Buffer, tag: string): Promise<string> {
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Generate RSA key pair for asymmetric encryption
 */
export async function generateRSAKeyPair(): Promise<{ publicKey: string, privateKey: string }> {
  const { publicKey, privateKey } = await generateKeyPair('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: process.env.PRIVATE_KEY_PASSPHRASE || 'keeviqo-secure-passphrase'
    }
  });
  
  return { publicKey, privateKey };
}

/**
 * Encrypt a private key with a user's password
 */
export async function encryptPrivateKey(privateKey: string, password: string, salt: string): Promise<{ encryptedKey: string, iv: string }> {
  const key = await pbkdf2(password, Buffer.from(salt, 'hex'), ITERATIONS, KEY_LENGTH, HASH_ALGORITHM);
  const ivBuffer = await randomBytes(IV_BYTES);
  const iv = ivBuffer.toString('hex');
  
  const { encryptedData, tag } = await encryptData(privateKey, key, ivBuffer);
  const encryptedKey = `${encryptedData}:${tag}`;
  
  return { encryptedKey, iv };
}

/**
 * Decrypt a private key with a user's password
 */
export async function decryptPrivateKey(encryptedKey: string, password: string, salt: string, iv: string): Promise<string> {
  const key = await pbkdf2(password, Buffer.from(salt, 'hex'), ITERATIONS, KEY_LENGTH, HASH_ALGORITHM);
  const [encryptedData, tag] = encryptedKey.split(':');
  
  return decryptData(encryptedData, key, Buffer.from(iv, 'hex'), tag);
}

/**
 * Generate a secure OTP code
 */
export async function generateOTP(length = 6): Promise<string> {
  const buffer = await randomBytes(length);
  const otp = Array.from(buffer)
    .map(byte => byte % 10)
    .join('');
  
  return otp.padStart(length, '0');
}

/**
 * Create a new OTP code for a user
 */
export async function createOTP(userId: number, type: string, purpose: string, expiresInMinutes = 10): Promise<string> {
  const code = await generateOTP();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
  
  await db.insert(schema.otpCodes).values({
    userId,
    code,
    type,
    purpose,
    expiresAt,
  });
  
  return code;
}

/**
 * Verify an OTP code for a user
 */
export async function verifyOTP(userId: number, code: string, purpose: string): Promise<boolean> {
  const now = new Date();
  
  const otpRecord = await db.query.otpCodes.findFirst({
    where: (otpCodes) => {
      return eq(otpCodes.userId, userId) && 
             eq(otpCodes.code, code) && 
             eq(otpCodes.purpose, purpose);
    }
  });
  
  if (!otpRecord || otpRecord.usedAt || (otpRecord.expiresAt && new Date(otpRecord.expiresAt.toString()) < now)) {
    return false;
  }
  
  await db
    .update(schema.otpCodes)
    .set({ usedAt: now })
    .where(eq(schema.otpCodes.id, otpRecord.id));
  
  return true;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(
  userId: number,
  action: string,
  resourceType: string,
  resourceId: string,
  ipAddress: string,
  userAgent: string,
  details: Record<string, unknown> = {},
  severity = 'info'
): Promise<void> {
  await db.insert(schema.auditLogs).values({
    userId,
    action,
    resourceType,
    resourceId,
    ipAddress,
    userAgent,
    details,
    severity,
  });
}

/**
 * Generate a secure API key for government partners
 */
export async function generateAPIKey(): Promise<string> {
  const buffer = await randomBytes(32);
  return buffer.toString('hex');
}

/**
 * Generate a secure API secret for government partners
 */
export async function generateAPISecret(): Promise<string> {
  const buffer = await randomBytes(64);
  return buffer.toString('base64');
}

/**
 * Create HMAC signature for API requests
 */
export async function createHMAC(data: string, secret: string): Promise<string> {
  const hmac = crypto.createHmac(HASH_ALGORITHM, secret);
  hmac.update(data);
  return hmac.digest('hex');
}

/**
 * Verify HMAC signature for API requests
 */
export async function verifyHMAC(data: string, secret: string, signature: string): Promise<boolean> {
  const expectedSignature = await createHMAC(data, secret);
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(signature, 'hex')
  );
}
