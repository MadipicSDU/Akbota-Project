import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Bell, MessageSquare, User, LogOut, Briefcase, Home, Shield, Wallet, Award } from 'lucide-react';
import logo from 'figma:asset/dbb038ad5d852716143789b73f4befd818daf8b1.png';

export default function Header() {
  const { user, logout, unreadNotificationsCount } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Nomad Freelancer Network" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-gray-900">Nomad Freelancer Network</span>
            </Link>

            <nav className="hidden md:flex gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/projects"
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
              >
                <Briefcase className="w-4 h-4" />
                Projects
              </Link>
              <Link
                to="/completed-projects"
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
              >
                <Award className="w-4 h-4" />
                Completed
              </Link>
              <Link
                to="/payments"
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
              >
                <Wallet className="w-4 h-4" />
                Payments
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/messages"
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition"
            >
              <MessageSquare className="w-5 h-5" />
            </Link>

            <Link
              to="/notifications"
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </Link>

            <div className="flex items-center gap-3 pl-3 border-l border-gray-300">
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="hidden sm:block text-gray-900">{user?.name}</span>
              </Link>

              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
