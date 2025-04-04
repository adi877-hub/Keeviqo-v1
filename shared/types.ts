
import { Request } from 'express';

export interface GovernmentPartner {
  id: number;
  name: string | null;
  description: string | null;
  type: string | null;
  country: string | null;
  region: string | null;
  apiKey: string | null; // Making apiKey nullable to match database schema
  apiSecret: string | null;
  accessLevel: string | null;
  status: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  website: string | null;
  encryptionKeyId: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  active: boolean | null;
  createdBy: number | null;
}

export interface PartnerRequest extends Request {
  partner?: GovernmentPartner;
}

export interface EmergencyUser {
  name: string;
  id: string; // Using string to match the toString() conversion in middleware
  dateOfBirth: string;
  address: string;
  phone: string;
}

export interface MedicalInfo {
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  doctorName: string;
  doctorPhone: string;
  insuranceProvider: string;
  insuranceNumber: string;
}

export interface EmergencyDocument {
  id: number;
  name: string;
  type: string;
  url: string;
}

export interface EmergencyData {
  user: EmergencyUser;
  medicalInfo: MedicalInfo;
  documents: EmergencyDocument[];
}

export interface EmergencyRequest extends Request {
  emergencyUser?: {
    id: string;
    uuid: string;
  };

/**
 * Shared TypeScript interfaces for the Keeviqo platform
 * This file contains type definitions used across both client and server
 */

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
  smartFeatures: string;
  includes: string;
  parentId?: number;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  features?: Feature[];
}

export interface Feature {
  id: number;
  type: FeatureType;
  label: string;
  url?: string;
  subcategoryId: number;
}

export type FeatureType = 'upload' | 'reminder' | 'external_link' | 'form';

export interface Document {
  id: number;
  name: string;
  path: string;
  mimeType: string;
  size: number;
  userId?: number;
  featureId: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Reminder {
  id?: number;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'once';
  date: string;
  userId?: number;
  featureId: number;
  completed?: boolean;
  createdAt?: string;
}

export interface FormData {
  id: number;
  data: Record<string, unknown>;
  userId?: number;
  featureId: number;
  createdAt: string;
}

export interface EmergencyContact {
  id?: number;
  name: string;
  email: string;
  phone: string;
  relationship: string;
  accessLevel: 'basic' | 'medical' | 'full';
  userId?: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
    language: 'he' | 'en';
  };
}

export interface Payment {
  id: number;
  amount: number;
  currency: string;
  method: 'paypal' | 'stripe' | 'credit_card';
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  userId: number;
  createdAt: string;
}

export interface QRCode {
  id: number;
  url: string;
  data: string;
  userId?: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchResult<T> {
  results: T[];
  total: number;
  query: string;

}
