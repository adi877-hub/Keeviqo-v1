
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
  id: string;
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
  emergencyUser?: EmergencyUser;
}
