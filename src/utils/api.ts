
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

export async function uploadDocument(file: File, featureId: number, metadata?: Record<string, any>): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('featureId', featureId.toString());
  
  if (metadata) {
    formData.append('metadata', JSON.stringify(metadata));
  }
  
  return fetchFromAPI('/uploads', {
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

export async function createReminder(reminder: Reminder): Promise<any> {
  return fetchFromAPI('/reminders', {
    method: 'POST',
    body: JSON.stringify(reminder),
  });
}

export async function updateReminder(id: number, reminder: Partial<Reminder>): Promise<any> {
  return fetchFromAPI(`/reminders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reminder),
  });
}

export async function submitFormData(data: Record<string, any>, featureId: number): Promise<any> {
  return fetchFromAPI('/forms', {
    method: 'POST',
    body: JSON.stringify({ data, featureId }),
  });
}

export async function fetchFormData(featureId: number): Promise<any[]> {
  return fetchFromAPI<any[]>(`/forms/feature/${featureId}`);
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactForm(data: ContactFormData): Promise<any> {
  return fetchFromAPI('/contact', {
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

export async function processPayment(data: PaymentData): Promise<any> {
  return fetchFromAPI('/payments/process', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function generateQRCode(data: string): Promise<any> {
  return fetchFromAPI('/qr/generate', {
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

export async function setUserTheme(theme: 'light' | 'dark'): Promise<any> {
  return fetchFromAPI('/user/theme', {
    method: 'POST',
    body: JSON.stringify({ theme }),
  });
}

export async function setUserLanguage(language: 'he' | 'en'): Promise<any> {
  return fetchFromAPI('/user/language', {
    method: 'POST',
    body: JSON.stringify({ language }),
  });
}

export async function generateInvoice(paymentId: number): Promise<any> {
  return fetchFromAPI(`/payments/${paymentId}/invoice`, {
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

export async function saveEmergencyContacts(contacts: EmergencyContact[]): Promise<any> {
  return fetchFromAPI('/user/emergency-contacts', {
    method: 'POST',
    body: JSON.stringify({ contacts }),
  });
}

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  return fetchFromAPI<EmergencyContact[]>('/user/emergency-contacts');
}
