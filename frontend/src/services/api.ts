import axios from 'axios';
import type {
  ChatResponse,
  DiscoverySuggestion,
  GraphData,
  Stats,
  UploadResult,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`,
  timeout: 120000,
});

export async function uploadPdf(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<UploadResult>('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function extractText(text: string): Promise<UploadResult> {
  const { data } = await api.post<UploadResult>('/extract', { text });
  return data;
}

export async function getGraph(): Promise<GraphData> {
  const { data } = await api.get<GraphData>('/graph');
  return data;
}

export async function chat(question: string): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>('/chat', { question });
  return data;
}

export async function discover(): Promise<{ suggestions: DiscoverySuggestion[] }> {
  const { data } = await api.get<{ suggestions: DiscoverySuggestion[] }>('/discover');
  return data;
}

export async function getStats(): Promise<Stats> {
  const { data } = await api.get<Stats>('/stats');
  return data;
}

export async function getDocuments(): Promise<{ filename: string; uploadedAt: string }[]> {
  const { data } = await api.get('/documents');
  return data;
}

export async function deleteDocument(filename: string): Promise<void> {
  await api.post('/documents/delete', { filename });
}

export async function login(credentials: any): Promise<any> {
  const { data } = await api.post('/auth/login', credentials);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
}

export async function register(userData: any): Promise<any> {
  const { data } = await api.post('/auth/register', userData);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

