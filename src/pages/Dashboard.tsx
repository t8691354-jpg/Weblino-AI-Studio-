import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Project } from '../types';
import { Plus, Trash2, ExternalLink, Clock, Layout as LayoutIcon, Wand2, Sparkles, CreditCard } from 'lucide-react';
import { generateSite, getPublicConfig, createCheckoutSession } from '../services/api';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [config, setConfig] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchConfig();
    }
  }, [user]);

  const fetchConfig = async () => {
    try {
      const data = await getPublicConfig();
      setConfig(data);
    } catch (err) {
      console.error("Failed to load config");
    }
  };

  const fetchProjects = async () => {
    const q = query(collection(db, 'projects'), where('userId', '==', user?.uid));
    const querySnapshot = await getDocs(q);
    const fetchedProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    setProjects(fetchedProjects.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // Check limits
    const limit = config?.plans?.[profile?.plan || 'free']?.projectLimit;
    if (limit !== -1 && projects.length >= limit) {
      setError(`You've reached your project limit for the ${profile?.plan} plan. Please upgrade.`);
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      const generated = await generateSite(prompt);
      
      const projectData = {
        userId: user?.uid,
        name: prompt.slice(0, 30) + (prompt.length > 30 ? '...' : ''),
        prompt,
        code: {
          html: generated.html,
          css: generated.css,
          js: generated.js,
        },
        meta: generated.meta,
        content: generated.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const docRef = await addDoc(collection(db, 'projects'), projectData);
      navigate(`/editor/${docRef.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteDoc(doc(db, 'projects', id));
      fetchProjects();
    }
  };

  const handleUpgrade = async (planId: string) => {
    try {
      const { url } = await createCheckoutSession(planId, user!.uid);
      window.location.href = url;
    } catch (err) {
      setError('Failed to initiate checkout.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Your Projects</h1>
          <p className="mt-2 text-neutral-600">Manage your AI-powered web presence.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 rounded-2xl bg-indigo-50 p-4 ring-1 ring-indigo-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Current Plan</p>
              <p className="text-sm font-bold text-indigo-900 capitalize">{profile?.plan} Plan</p>
            </div>
          </div>

          {profile?.plan === 'free' && config?.isPaymentEnabled && (
            <button 
              onClick={() => handleUpgrade('pro')}
              className="flex items-center gap-2 rounded-2xl bg-neutral-900 px-6 py-4 text-sm font-bold text-white shadow-xl hover:bg-neutral-800"
            >
              <CreditCard className="h-4 w-4" />
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      <div className="mb-12 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">Generate New Site</h2>
          {config?.plans?.[profile?.plan || 'free']?.projectLimit !== -1 && (
            <span className="text-sm font-medium text-neutral-500">
              Usage: {projects.length} / {config?.plans?.[profile?.plan || 'free']?.projectLimit} projects
            </span>
          )}
        </div>
        
        <form onSubmit={handleCreateProject} className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Wand2 className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Describe your website (e.g., A luxury real estate landing page with dark theme)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="block w-full rounded-2xl border border-neutral-200 py-4 pl-12 pr-4 text-neutral-900 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim() || !config?.isAiEnabled}
            className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-500 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Create Site
              </>
            )}
          </button>
        </form>
        {error && (
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        {!config?.isAiEnabled && (
          <p className="mt-4 text-sm text-amber-600">AI generation is currently disabled by the administrator.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="group relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200 transition-all hover:shadow-md">
            <div className="aspect-video bg-neutral-50 p-6">
              <div className="flex h-full w-full items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white">
                <LayoutIcon className="h-12 w-12 text-neutral-100" />
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">{project.name}</h3>
                  <div className="mt-2 flex items-center gap-2 text-xs font-medium text-neutral-400">
                    <Clock className="h-3 w-3" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteProject(project.id)}
                  className="rounded-full p-2 text-neutral-300 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-8 flex gap-3">
                <Link 
                  to={`/editor/${project.id}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-bold text-white hover:bg-neutral-800"
                >
                  Edit Site
                </Link>
                <button className="rounded-2xl border border-neutral-200 p-3 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900">
                  <ExternalLink className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
