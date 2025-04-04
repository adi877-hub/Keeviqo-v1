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
  paymentId: number;
  invoiceNumber: string;
  downloadUrl: string;
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
  message: string;
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

export interface EmergencyData {
  user: {
    name: string;
    id: string;
    dateOfBirth: string;
    address: string;
    phone: string;
  };
  medicalInfo: MedicalInfo;
  documents: {
    id: number;
    name: string;
    type: string;
    url: string;
  }[];
}

export async function getUserEmergencyData(): Promise<EmergencyData> {
  return fetchFromAPI<EmergencyData>('/user/emergency-data');
}

export async function updateEmergencyData(data: Partial<EmergencyData>): Promise<EmergencyData> {
  return fetchFromAPI<EmergencyData>('/user/emergency-data', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export interface AnalyticsData {
  userActivity: {
    date: string;
    logins: number;
    documentUploads: number;
    formSubmissions: number;
    reminderCreations: number;
  }[];
  featureUsage: {
    name: string;
    value: number;
  }[];
  categoryUsage: {
    name: string;
    value: number;
  }[];
  userGrowth: {
    date: string;
    totalUsers: number;
    activeUsers: number;
  }[];
  usersByRole: {
    name: string;
    value: number;
  }[];
  usersByCountry: {
    name: string;
    value: number;
  }[];
}

export async function fetchAnalyticsData(timeRange: 'day' | 'week' | 'month' | 'year'): Promise<AnalyticsData> {
  return fetchFromAPI<AnalyticsData>(`/analytics?timeRange=${timeRange}`);
}

export interface SearchResult {
  id: number;
  type: 'category' | 'subcategory' | 'document' | 'reminder' | 'form';
  title: string;
  description?: string;
  path: string;
  relevance: number;
  category?: string;
  lastUpdated?: string;
}

export interface SearchOptions {
  typoTolerance?: boolean;
  categories?: number[];
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: 'relevance' | 'date' | 'title';
  limit?: number;
}

export async function searchContent(
  query: string, 
  options: SearchOptions = { typoTolerance: true }
): Promise<SearchResult[]> {
  return fetchFromAPI<SearchResult[]>('/search', {
    method: 'POST',
    body: JSON.stringify({ query, options }),
  });
}


export interface ContextAwareReminder {
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'once' | 'context_based';
  date: string;
  priority: 'low' | 'medium' | 'high';
  contextTriggers?: string[];
  category?: string;
  relatedDocuments?: number[];
}

export interface ReminderWithId extends ContextAwareReminder {
  id: number;
  completed: boolean;
}

export interface UserContext {
  recentCategories: string[];
  upcomingEvents: {
    title: string;
    date: string;
    category: string;
  }[];
  documentUpdates: {
    documentId: number;
    name: string;
    category: string;
    lastUpdated: string;
  }[];
  seasonalEvents: string[];
  locationBasedSuggestions: string[];
}

export async function createContextAwareReminder(reminder: ContextAwareReminder): Promise<ReminderWithId> {
  return fetchFromAPI<ReminderWithId>('/reminders/context-aware', {
    method: 'POST',
    body: JSON.stringify(reminder),
  });
}

export async function getUserReminders(): Promise<ReminderWithId[]> {
  return fetchFromAPI<ReminderWithId[]>('/reminders/user');
}

export async function deleteReminder(id: number): Promise<{ success: boolean }> {
  return fetchFromAPI<{ success: boolean }>(`/reminders/${id}`, {
    method: 'DELETE',
  });
}

export async function analyzeUserContext(): Promise<UserContext> {
  return fetchFromAPI<UserContext>('/user/context');
}

export interface Document {
  id: number;
  name: string;
  path: string;
  mimeType: string;
  size: number;
  category: string;
  lastAccessed: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export async function getUserDocuments(): Promise<Document[]> {
  return fetchFromAPI<Document[]>('/documents/user');
}

export async function archiveDocument(documentId: number): Promise<{ success: boolean }> {
  return fetchFromAPI<{ success: boolean }>(`/documents/${documentId}/archive`, {
    method: 'POST',
  });
}

export async function deleteDocument(documentId: number): Promise<{ success: boolean }> {
  return fetchFromAPI<{ success: boolean }>(`/documents/${documentId}`, {
    method: 'DELETE',
  });
}

export async function restoreDocument(documentId: number): Promise<{ success: boolean }> {
  return fetchFromAPI<{ success: boolean }>(`/documents/${documentId}/restore`, {
    method: 'POST',
  });
}

export interface ConversationLog {
  id: number;
  title: string;
  content: string;
  summary?: string;
  recordingUrl?: string;
  date: string;
  category?: string;
  tags?: string[];
  createdAt: string;
}

export async function saveConversationLog(log: Omit<ConversationLog, 'id' | 'createdAt'>): Promise<ConversationLog> {
  return fetchFromAPI<ConversationLog>('/conversation-logs', {
    method: 'POST',
    body: JSON.stringify(log),
  });
}

export async function generateConversationSummary(logId: number): Promise<{ summary: string }> {
  return fetchFromAPI<{ summary: string }>(`/conversation-logs/${logId}/summary`, {
    method: 'POST',
  });
}

export interface ShareLink {
  id: number;
  url: string;
  expiresAt: string;
  accessCount: number;
  maxAccess?: number;
  categories?: number[];
  documents?: number[];
  createdAt: string;
}

export async function createShareLink(
  data: { 
    categories?: number[]; 
    documents?: number[]; 
    expiresIn?: number; 
    maxAccess?: number;
  }
): Promise<ShareLink> {
  return fetchFromAPI<ShareLink>('/share', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function revokeShareLink(linkId: number): Promise<{ success: boolean }> {
  return fetchFromAPI<{ success: boolean }>(`/share/${linkId}/revoke`, {
    method: 'POST',
  });
}
