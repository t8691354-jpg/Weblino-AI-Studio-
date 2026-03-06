import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const getPublicConfig = () => api.get('/config/public').then(res => res.data);
export const getAdminConfig = () => api.get('/admin/config').then(res => res.data);
export const updateAdminConfig = (config: any) => api.post('/admin/config', config).then(res => res.data);

export const generateSite = (prompt: string) => api.post('/ai/generate', { prompt, type: 'website' }).then(res => res.data);
export const generateContent = (prompt: string, type: string) => api.post('/ai/generate', { prompt, type }).then(res => res.data);

export const createCheckoutSession = (planId: string, userId: string) => 
  api.post('/payments/create-checkout', { planId, userId }).then(res => res.data);

export default api;
