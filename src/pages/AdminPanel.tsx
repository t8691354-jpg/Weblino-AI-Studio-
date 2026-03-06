import React, { useState, useEffect } from 'react';
import { getAdminConfig, updateAdminConfig } from '../services/api';
import { SystemConfig } from '../types';
import { 
  Settings, 
  Key, 
  CreditCard, 
  Cpu, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Database
} from 'lucide-react';

export default function AdminPanel() {
  const [config, setConfig] = useState<Partial<SystemConfig>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await getAdminConfig();
      setConfig(data);
    } catch (err) {
      setMessage({ text: 'Failed to load configuration.', type: 'error' });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAdminConfig(config);
      setMessage({ text: 'Configuration updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: 'Failed to update configuration.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">System Configuration</h1>
          <p className="mt-2 text-neutral-600">Manage API keys, payment gateways, and AI providers dynamically.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-500 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message.text && (
        <div className={`mb-8 flex items-center gap-3 rounded-2xl p-4 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'bg-red-50 text-red-700 ring-1 ring-red-100'}`}>
          {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* AI Providers */}
        <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
            <Cpu className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-neutral-900">AI Engine Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-neutral-700">Enable AI Generation</label>
              <button 
                onClick={() => setConfig({ ...config, isAiEnabled: !config.isAiEnabled })}
                className="text-indigo-600"
              >
                {config.isAiEnabled ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8 text-neutral-300" />}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Active Provider</label>
              <select 
                value={config.activeAiProvider}
                onChange={(e) => setConfig({ ...config, activeAiProvider: e.target.value as any })}
                className="mt-2 block w-full rounded-xl border border-neutral-200 p-3 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI (Coming Soon)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Gemini API Key</label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Key className="h-4 w-4 text-neutral-400" />
                </div>
                <input 
                  type="password"
                  value={config.geminiKey || ''}
                  onChange={(e) => setConfig({ ...config, geminiKey: e.target.value })}
                  className="block w-full rounded-xl border border-neutral-200 py-3 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="Enter Gemini API Key"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Gateway */}
        <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
            <CreditCard className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-neutral-900">Payment Gateway</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-neutral-700">Enable Payments</label>
              <button 
                onClick={() => setConfig({ ...config, isPaymentEnabled: !config.isPaymentEnabled })}
                className="text-indigo-600"
              >
                {config.isPaymentEnabled ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8 text-neutral-300" />}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Stripe Secret Key</label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Key className="h-4 w-4 text-neutral-400" />
                </div>
                <input 
                  type="password"
                  value={config.stripeSecretKey || ''}
                  onChange={(e) => setConfig({ ...config, stripeSecretKey: e.target.value })}
                  className="block w-full rounded-xl border border-neutral-200 py-3 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="sk_test_..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Stripe Publishable Key</label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Key className="h-4 w-4 text-neutral-400" />
                </div>
                <input 
                  type="text"
                  value={config.stripePublishableKey || ''}
                  onChange={(e) => setConfig({ ...config, stripePublishableKey: e.target.value })}
                  className="block w-full rounded-xl border border-neutral-200 py-3 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="pk_test_..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Plan Management */}
        <div className="col-span-full space-y-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
            <Database className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-neutral-900">Subscription Plans</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {['free', 'pro', 'enterprise'].map((plan) => (
              <div key={plan} className="rounded-2xl border border-neutral-100 p-6">
                <h3 className="mb-4 font-bold capitalize text-neutral-900">{plan} Plan</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-400">Price (USD)</label>
                    <input 
                      type="number"
                      value={config.plans?.[plan as keyof SystemConfig['plans']]?.price || 0}
                      onChange={(e) => setConfig({
                        ...config,
                        plans: {
                          ...config.plans,
                          [plan]: { ...config.plans?.[plan as keyof SystemConfig['plans']], price: parseInt(e.target.value) }
                        } as any
                      })}
                      className="mt-1 block w-full rounded-lg border border-neutral-200 p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-400">Project Limit (-1 for unlimited)</label>
                    <input 
                      type="number"
                      value={config.plans?.[plan as keyof SystemConfig['plans']]?.projectLimit || 0}
                      onChange={(e) => setConfig({
                        ...config,
                        plans: {
                          ...config.plans,
                          [plan]: { ...config.plans?.[plan as keyof SystemConfig['plans']], projectLimit: parseInt(e.target.value) }
                        } as any
                      })}
                      className="mt-1 block w-full rounded-lg border border-neutral-200 p-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
