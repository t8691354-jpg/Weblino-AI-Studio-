import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../services/firebase';
import { Layout, LogOut, User as UserIcon, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900">
            <Layout className="h-6 w-6 text-indigo-600" />
            <span>SiteBuilder Pro</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {profile?.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-indigo-600">
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <Link to="/dashboard" className="text-sm font-medium text-neutral-600 hover:text-indigo-600">
                Dashboard
              </Link>
              <div className="flex items-center gap-3 border-l border-neutral-200 pl-4">
                <span className="hidden text-sm text-neutral-500 sm:inline-block">
                  {user.email}
                </span>
                <button 
                  onClick={handleLogout}
                  className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <Link 
              to="/login" 
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
