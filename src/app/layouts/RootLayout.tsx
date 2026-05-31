import { Outlet, useNavigate, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Toaster } from '../components/ui/sonner';

export default function RootLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && location.pathname !== '/auth/login' && location.pathname !== '/auth/register') {
      navigate('/auth/login');
    }
  }, [user, navigate, location]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
