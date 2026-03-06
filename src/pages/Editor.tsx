import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Project } from '../types';
import { 
  Save, 
  Download, 
  Eye, 
  Code, 
  Layout as LayoutIcon, 
  ChevronLeft, 
  Wand2, 
  Image as ImageIcon, 
  Type as TypeIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import JSZip from 'jszip';
import { generateContent } from '../services/api';

export default function Editor() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'content'>('preview');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    const docRef = doc(db, 'projects', projectId!);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProject({ id: docSnap.id, ...docSnap.data() } as Project);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSave = async () => {
    if (!project) return;
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const docRef = doc(db, 'projects', project.id);
      await updateDoc(docRef, {
        ...project,
        updatedAt: Date.now(),
      });
      setSuccess('Project saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save project.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!project) return;
    const zip = new JSZip();
    zip.file('index.html', project.code.html);
    zip.file('style.css', project.code.css);
    zip.file('script.js', project.code.js);
    
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.zip`;
    a.click();
  };

  const handleGenerateContent = async (type: 'text' | 'image-keywords' | 'marketing') => {
    if (!project) return;
    setIsGenerating(true);
    setError('');
    try {
      const result = await generateContent(project.prompt, type);
      const updatedProject = { ...project };
      if (type === 'marketing') {
        updatedProject.content.headlines = [...updatedProject.content.headlines, ...result.filter((r: string) => r.length < 50)];
        updatedProject.content.taglines = [...updatedProject.content.taglines, ...result.filter((r: string) => r.length >= 50 && r.length < 100)];
        updatedProject.content.descriptions = [...updatedProject.content.descriptions, ...result.filter((r: string) => r.length >= 100)];
      } else if (type === 'image-keywords') {
        updatedProject.content.imageKeywords = [...updatedProject.content.imageKeywords, ...result];
      }
      setProject(updatedProject);
      setSuccess('Content generated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Content generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const updatePreview = () => {
    if (iframeRef.current && project) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>${project.code.css}</style>
            </head>
            <body>
              ${project.code.html}
              <script>${project.code.js}</script>
            </body>
          </html>
        `);
        doc.close();
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'preview') {
      updatePreview();
    }
  }, [activeTab, project]);

  if (!project) return null;

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-neutral-50">
      <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="h-6 w-px bg-neutral-200" />
          <h1 className="text-lg font-bold text-neutral-900">{project.name}</h1>
        </div>

        <div className="flex items-center gap-2">
          {success && (
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              {success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-1 text-sm font-medium text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-16 flex-col items-center border-r border-neutral-200 bg-white py-4">
          <button 
            onClick={() => setActiveTab('preview')}
            className={`rounded-xl p-3 transition-all ${activeTab === 'preview' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-900'}`}
          >
            <Eye className="h-6 w-6" />
          </button>
          <button 
            onClick={() => setActiveTab('code')}
            className={`mt-4 rounded-xl p-3 transition-all ${activeTab === 'code' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-900'}`}
          >
            <Code className="h-6 w-6" />
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`mt-4 rounded-xl p-3 transition-all ${activeTab === 'content' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-900'}`}
          >
            <LayoutIcon className="h-6 w-6" />
          </button>
        </aside>

        <main className="flex-1 overflow-hidden bg-neutral-100 p-6">
          {activeTab === 'preview' && (
            <div className="h-full w-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-neutral-200">
              <iframe 
                ref={iframeRef}
                className="h-full w-full border-none"
                title="Preview"
              />
            </div>
          )}

          {activeTab === 'code' && (
            <div className="grid h-full grid-cols-2 gap-4 overflow-hidden">
              <div className="flex flex-col overflow-hidden rounded-2xl bg-neutral-900 shadow-xl">
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">HTML</span>
                </div>
                <textarea 
                  value={project.code.html}
                  onChange={(e) => setProject({ ...project, code: { ...project.code, html: e.target.value } })}
                  className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-neutral-300 focus:outline-none"
                />
              </div>
              <div className="flex flex-col overflow-hidden rounded-2xl bg-neutral-900 shadow-xl">
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">CSS</span>
                </div>
                <textarea 
                  value={project.code.css}
                  onChange={(e) => setProject({ ...project, code: { ...project.code, css: e.target.value } })}
                  className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-neutral-300 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="grid h-full grid-cols-3 gap-6 overflow-y-auto pr-2">
              <div className="space-y-6">
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-bold text-neutral-900">
                      <TypeIcon className="h-5 w-5 text-indigo-600" />
                      Marketing Copy
                    </h3>
                    <button 
                      onClick={() => handleGenerateContent('marketing')}
                      disabled={isGenerating}
                      className="rounded-lg bg-indigo-50 p-2 text-indigo-600 hover:bg-indigo-100"
                    >
                      <Wand2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Headlines</p>
                      {project.content.headlines.map((h, i) => (
                        <p key={i} className="mt-2 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">{h}</p>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Descriptions</p>
                      {project.content.descriptions.map((d, i) => (
                        <p key={i} className="mt-2 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">{d}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-bold text-neutral-900">
                      <ImageIcon className="h-5 w-5 text-indigo-600" />
                      Image Keywords
                    </h3>
                    <button 
                      onClick={() => handleGenerateContent('image-keywords')}
                      disabled={isGenerating}
                      className="rounded-lg bg-indigo-50 p-2 text-indigo-600 hover:bg-indigo-100"
                    >
                      <Wand2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.content.imageKeywords.map((k, i) => (
                      <span key={i} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
                  <h3 className="mb-4 font-bold text-neutral-900">SEO Meta</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Title</label>
                      <input 
                        type="text" 
                        value={project.meta.title}
                        onChange={(e) => setProject({ ...project, meta: { ...project.meta, title: e.target.value } })}
                        className="mt-1 block w-full rounded-lg border border-neutral-200 p-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Description</label>
                      <textarea 
                        value={project.meta.description}
                        onChange={(e) => setProject({ ...project, meta: { ...project.meta, description: e.target.value } })}
                        className="mt-1 block w-full rounded-lg border border-neutral-200 p-2 text-sm focus:border-indigo-500 focus:outline-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
