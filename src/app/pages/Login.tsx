import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import logo from 'figma:asset/dbb038ad5d852716143789b73f4befd818daf8b1.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'freelancer' | 'customer' | 'admin'>('freelancer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="Nomad Freelancer Network" className="w-24 h-24 object-contain mb-3" />
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-indigo-600 font-semibold mt-1">Nomad Freelancer Network</p>
        <p className="text-gray-600 text-sm">Sign in to your account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@university.edu"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="freelancer"
                checked={role === 'freelancer'}
                onChange={(e) => setRole(e.target.value as 'freelancer')}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-gray-700">Freelancer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="customer"
                checked={role === 'customer'}
                onChange={(e) => setRole(e.target.value as 'customer')}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-gray-700">Customer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="admin"
                checked={role === 'admin'}
                onChange={(e) => setRole(e.target.value as 'admin')}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-gray-700">Admin</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Sign up
        </Link>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <p className="font-medium text-blue-900 mb-2">Demo Accounts:</p>
        <p className="text-blue-800">Freelancer: john@university.edu</p>
        <p className="text-blue-800">Customer: sarah@university.edu</p>
        <p className="text-blue-800">Admin: admin@platform.com</p>
        <p className="text-blue-700 mt-2 text-xs">Password: any (this is a demo)</p>
      </div>
    </div>
  );
}
