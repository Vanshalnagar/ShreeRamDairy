import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { loginUser, googleLoginUser, clearError } from '../store/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { user, loading, error } = useSelector((state) => state.auth);

  // Redirect if already logged in
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, redirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const handleGoogleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      dispatch(googleLoginUser(credentialResponse.credential));
    }
  };

  const handleGoogleError = () => {
    alert('Google Login Failed. Please try standard sign-in.');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-srd-cream py-12 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl border-2 border-srd-gold/30 shadow-xl p-8 relative overflow-hidden">
        {/* Decorative corner patterns */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-srd-gold/30 rounded-tl-2xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-srd-gold/30 rounded-tr-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-srd-gold/30 rounded-bl-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-srd-gold/30 rounded-br-2xl pointer-events-none"></div>
        
        {/* Heading */}
        <div className="text-center mb-8">
          <span className="font-title italic text-srd-orange text-lg block mb-1">Aavshe Padharo!</span>
          <h2 className="font-title font-bold text-3xl text-srd-maroon">Login to Shree Ram Dairy</h2>
          <div className="w-16 h-0.5 bg-srd-gold mx-auto mt-3"></div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3.5 rounded-lg border border-red-200 mb-6 flex items-start gap-2 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="email">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Mail size={18} />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-srd-gold focus:ring-1 focus:ring-srd-gold"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-bold text-gray-700" htmlFor="password">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-srd-orange hover:text-srd-maroon">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Lock size={18} />
              </span>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-srd-gold focus:ring-1 focus:ring-srd-gold"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white py-3.5 rounded-lg font-bold text-sm tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Please wait...' : (
              <>
                Login <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="absolute bg-white px-3 text-xs text-gray-400 uppercase font-semibold">Or Sign In With</span>
        </div>

        {/* Google OAuth Login */}
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            shape="rectangular"
            theme="filled_blue"
            text="signin_with"
          />
        </div>

        {/* Redirection link */}
        <p className="text-center text-sm text-gray-600 font-medium">
          New to Shree Ram Dairy?{' '}
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-srd-orange hover:text-srd-maroon font-bold underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
