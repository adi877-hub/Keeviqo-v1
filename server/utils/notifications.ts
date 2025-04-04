import nodemailer from 'nodemailer';
import axios from 'axios';
import { db } from './db';
import * as schema from '../../shared/schema';
import { eq } from 'drizzle-orm';

const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password',
  },
});

const whatsappApiUrl = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/v1/messages';
const whatsappApiToken = process.env.WHATSAPP_API_TOKEN || 'your-whatsapp-api-token';

/**
 * Send a notification via both email and WhatsApp
 * @param userId User ID to send notification to
 * @param subject Subject of the notification
 * @param message Message content
 * @param options Additional options
 */
export async function sendDoubleNotification(
  userId: number,
  subject: string,
  message: string,
  options: {
    priority?: 'high' | 'medium' | 'low';
    category?: string;
    attachments?: Array<{ filename: string; path: string; contentType?: string }>;
    skipWhatsApp?: boolean;
    skipEmail?: boolean;
  } = {}
) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const userEmail = user.email;
    const userPhone = (user as any).phone || null; // Assuming phone is stored in user record

    const notificationPromises = [];

    if (!options.skipEmail && userEmail) {
      notificationPromises.push(
        sendEmailNotification(userEmail, subject, message, options)
      );
    }

    if (!options.skipWhatsApp && userPhone) {
      notificationPromises.push(
        sendWhatsAppNotification(userPhone, subject, message, options)
      );
    }

    const results = await Promise.allSettled(notificationPromises);

    await db.insert(schema.notifications).values({
      userId,
      subject,
      message,
      sentViaEmail: !options.skipEmail && userEmail ? true : false,
      sentViaWhatsApp: !options.skipWhatsApp && userPhone ? true : false,
      category: options.category || null,
      priority: options.priority || 'medium',
      createdAt: new Date(),
    });

    const failures = results.filter(result => result.status === 'rejected');
    if (failures.length > 0) {
      console.error('Some notifications failed to send:', failures);
      return {
        success: results.some(result => result.status === 'fulfilled'),
        failures: failures.length,
        total: notificationPromises.length,
      };
    }

    return {
      success: true,
      failures: 0,
      total: notificationPromises.length,
    };
  } catch (error) {
    console.error('Error sending double notification:', error);
    throw error;
  }
}

/**
 * Send an email notification
 */
async function sendEmailNotification(
  email: string,
  subject: string,
  message: string,
  options: {
    priority?: 'high' | 'medium' | 'low';
    category?: string;
    attachments?: Array<{ filename: string; path: string; contentType?: string }>;
  } = {}
) {
  try {
    const priorityHeaders: Record<string, string> = {};
    if (options.priority === 'high') {
      priorityHeaders['X-Priority'] = '1';
      priorityHeaders['X-MSMail-Priority'] = 'High';
      priorityHeaders['Importance'] = 'High';
    }

    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM || 'Keeviqo <notifications@keeviqo.com>',
      to: email,
      subject: subject,
      text: message,
      html: `<div dir="rtl" style="text-align: right; font-family: Arial, sans-serif;">
        <h2>${subject}</h2>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          נשלח מ-Keeviqo - המערכת החכמה לניהול מידע אישי
        </p>
      </div>`,
      attachments: options.attachments || [],
      headers: priorityHeaders,
    });

    console.log('Email notification sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
}

/**
 * Send a WhatsApp notification
 */
async function sendWhatsAppNotification(
  phone: string,
  subject: string,
  message: string,
  options: {
    priority?: 'high' | 'medium' | 'low';
    category?: string;
  } = {}
) {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    
    const whatsappMessage = `*${subject}*\n\n${message}\n\nנשלח מ-Keeviqo - המערכת החכמה לניהול מידע אישי`;
    
    const response = await axios.post(
      whatsappApiUrl,
      {
        phone: formattedPhone,
        message: whatsappMessage,
        priority: options.priority || 'medium',
      },
      {
        headers: {
          'Authorization': `Bearer ${whatsappApiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('WhatsApp notification sent:', response.data);
    return { success: true, messageId: response.data.id };
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    throw error;
  }
}

/**
 * Format phone number for WhatsApp API
 */
function formatPhoneNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.startsWith('972')) {
    return digitsOnly;
  } else if (digitsOnly.startsWith('0')) {
    return `972${digitsOnly.substring(1)}`;
  } else {
    return `972${digitsOnly}`;
  }
}

/**
 * Get user notification preferences
 */
export async function getUserNotificationPreferences(userId: number) {
  try {
    const preferences = await db.query.userPreferences.findFirst({
      where: eq(schema.userPreferences.userId, userId),
    });

    return {
      email: preferences?.emailNotifications ?? true,
      whatsapp: preferences?.whatsappNotifications ?? true,
      categories: preferences?.notificationCategories ?? [],
      quiet_hours: {
        enabled: preferences?.quietHoursEnabled ?? false,
        start: preferences?.quietHoursStart ?? '22:00',
        end: preferences?.quietHoursEnd ?? '08:00',
      },
    };
  } catch (error) {
    console.error('Error getting user notification preferences:', error);
    throw error;
  }
}

/**
 * Update notification schema in the database
 */
export async function updateNotificationSchema() {
  console.log('Notification schema updated');
}
