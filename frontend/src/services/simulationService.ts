import axios from 'axios';
import { SimulationResult, SimulationType } from '../types';

const api = axios.create({
  baseURL: '/api/simulation',
});

export async function getSimulationTypes(): Promise<SimulationType[]> {
  try {
    const resp = await api.get('/types');
    return resp.data;
  } catch (err) {
    console.error('Failed to fetch simulation types:', err);
    return [];
  }
}

export async function runSimulation(params: {
  type: string;
  source: string;
  target: string;
  options?: any;
}): Promise<SimulationResult> {
  const resp = await api.post('/run', params);
  return resp.data;
}

export async function predictFuture(query: string): Promise<SimulationResult> {
  const resp = await api.post('/predict-future', { query });
  return resp.data;
}

export async function downloadReport(data: SimulationResult): Promise<void> {
  const resp = await api.post('/report', data);
  const blob = new Blob([JSON.stringify(resp.data, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `simulation-report-${Date.now()}.json`;
  a.click();
}
