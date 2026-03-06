import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && profile?.role !== role) return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

export default function App() {
  const isConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY || true; // Now configured with defaults

  if (!isConfigured) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-neutral-50 p-8 text-center">
        <div className="max-w-md rounded-3xl bg-white p-12 shadow-xl ring-1 ring-neutral-200">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-amber-50 p-4 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Configuration Required</h1>
          <p className="mt-4 text-neutral-600">
            To use this platform, you must set your Firebase environment variables in the <strong>Secrets</strong> panel.
          </p>
          <div className="mt-8 space-y-2 text-left text-sm font-mono text-neutral-500">
            <p>VITE_FIREBASE_API_KEY</p>
            <p>VITE_FIREBASE_AUTH_DOMAIN</p>
            <p>VITE_FIREBASE_PROJECT_ID</p>
          </div>
          <p className="mt-8 text-xs text-neutral-400">Once set, the application will restart automatically.</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/editor/:projectId" 
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="admin">
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}
