
const API_BASE_URL = '/api';

async function fetchFromAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
  smartFeatures: string;
  includes: string;
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
  type: string;
  label: string;
  url?: string;
  subcategoryId: number;
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchFromAPI<Category[]>('/categories');
}

export async function fetchCategory(id: number): Promise<Category> {
  return fetchFromAPI<Category>(`/categories/${id}`);
}

export async function fetchSubcategory(id: number): Promise<Subcategory> {
  return fetchFromAPI<Subcategory>(`/subcategories/${id}`);
}

export async function fetchFeature(id: number): Promise<Feature> {
  return fetchFromAPI<Feature>(`/features/${id}`);
}

export interface UploadResponse {
  id: number;
  name: string;
  path: string;
  mimeType: string;
  size: number;
  featureId: number;
  userId?: number;
  createdAt: string;
}

export async function uploadDocument(file: File, featureId: number, metadata?: Record<string, unknown>): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('featureId', featureId.toString());
  
  if (metadata) {
    formData.append('metadata', JSON.stringify(metadata));
  }
  
  return fetchFromAPI<UploadResponse>('/uploads', {
    method: 'POST',
    headers: {}, // Let the browser set the content type for FormData
    body: formData,
  });
}

export interface Reminder {
  id?: number;
  title: string;
  description?: string;
  frequency: string;
  date: string;
  featureId: number;
  completed?: boolean;
}

export interface ReminderResponse extends Reminder {
  id: number;
  createdAt: string;
}

export async function createReminder(reminder: Reminder): Promise<ReminderResponse> {
  return fetchFromAPI<ReminderResponse>('/reminders', {
    method: 'POST',
    body: JSON.stringify(reminder),
  });
}

export async function updateReminder(id: number, reminder: Partial<Reminder>): Promise<ReminderResponse> {
  return fetchFromAPI<ReminderResponse>(`/reminders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reminder),
  });
}

export interface FormDataResponse {
  id: number;
  data: Record<string, unknown>;
  featureId: number;
  userId?: number;
  createdAt: string;
}

export async function submitFormData(data: Record<string, unknown>, featureId: number): Promise<FormDataResponse> {
  return fetchFromAPI<FormDataResponse>('/forms', {
    method: 'POST',
    body: JSON.stringify({ data, featureId }),
  });
}

export async function fetchFormData(featureId: number): Promise<FormDataResponse[]> {
  return fetchFromAPI<FormDataResponse[]>(`/forms/feature/${featureId}`);
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormResponse {
  id: number;
  status: string;
  message: string;
  createdAt: string;
}

export async function sendContactForm(data: ContactFormData): Promise<ContactFormResponse> {
  return fetchFromAPI<ContactFormResponse>('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface PaymentData {
  amount: number;
  currency: string;
  method: 'paypal' | 'stripe';
  description: string;
  customerInfo: {
    name: string;
    email: string;
  };
}

export interface PaymentResponse {
  id: number;
  status: string;
  transactionId: string;
  amount: number;
  currency: string;
  method: string;
  createdAt: string;
}

export async function processPayment(data: PaymentData): Promise<PaymentResponse> {
  return fetchFromAPI<PaymentResponse>('/payments/process', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface QRCodeResponse {
  id: number;
  url: string;
  data: string;
  createdAt: string;
}

export async function generateQRCode(data: string): Promise<QRCodeResponse> {
  return fetchFromAPI<QRCodeResponse>('/qr/generate', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
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

export async function getUserProfile(): Promise<UserProfile> {
  return fetchFromAPI<UserProfile>('/user/profile');
}

export async function updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  return fetchFromAPI<UserProfile>('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export interface ThemeResponse {
  success: boolean;
  theme: 'light' | 'dark';
  userId: number;
  updatedAt: string;
}

export async function setUserTheme(theme: 'light' | 'dark'): Promise<ThemeResponse> {
  return fetchFromAPI<ThemeResponse>('/user/theme', {
    method: 'POST',
    body: JSON.stringify({ theme }),
  });
}

export interface LanguageResponse {
  success: boolean;
  language: 'he' | 'en';
  userId: number;
  updatedAt: string;
}

export async function setUserLanguage(language: 'he' | 'en'): Promise<LanguageResponse> {
  return fetchFromAPI<LanguageResponse>('/user/language', {
    method: 'POST',
    body: JSON.stringify({ language }),
  });
}

export interface InvoiceResponse {
  id: number;
  invoiceNumber: string;
  paymentId: number;
  url: string;
  createdAt: string;
}

export async function generateInvoice(paymentId: number): Promise<InvoiceResponse> {
  return fetchFromAPI<InvoiceResponse>(`/payments/${paymentId}/invoice`, {
    method: 'POST',
  });
}

export async function getExternalSystemLinks(category: string): Promise<string[]> {
  return fetchFromAPI<string[]>(`/external-systems/${category}`);
}

export interface EmergencyContact {
  id?: number;
  name: string;
  email: string;
  phone: string;
  relationship: string;
  accessLevel: 'basic' | 'medical' | 'full';
}

export interface EmergencyContactResponse {
  success: boolean;
  contacts: EmergencyContact[];
  userId: number;
  updatedAt: string;
}

export async function saveEmergencyContacts(contacts: EmergencyContact[]): Promise<EmergencyContactResponse> {
  return fetchFromAPI<EmergencyContactResponse>('/user/emergency-contacts', {
    method: 'POST',
    body: JSON.stringify({ contacts }),
  });
}

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  return fetchFromAPI<EmergencyContact[]>('/user/emergency-contacts');
}
