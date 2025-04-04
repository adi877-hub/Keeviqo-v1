
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
