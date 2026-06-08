import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle } from 'lucide-react';
import { registerUser, googleLoginUser, clearError } from '../store/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const { user, loading, error } = useSelector((state) => state.auth);

  // Redirect if already logged in
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, redirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name || !email || !phone || !password || !confirmPassword) {
      setValidationError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    dispatch(registerUser({ name, email, phone, password }));
  };

  const handleGoogleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      dispatch(googleLoginUser(credentialResponse.credential));
    }
  };

  const handleGoogleError = () => {
    alert('Google Login Failed. Please try standard sign-up.');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-srd-cream py-12 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl border-2 border-srd-gold/30 shadow-xl p-8 relative overflow-hidden">
        {/* Decorative corner patterns */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-srd-gold/30 rounded-tl-2xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-srd-gold/30 rounded-tr-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-srd-gold/30 rounded-bl-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-srd-gold/30 rounded-br-2xl pointer-events-none"></div>
        
        {/* Heading */}
        <div className="text-center mb-6">
          <span className="font-title italic text-srd-orange text-lg block mb-1">Create an Account</span>
          <h2 className="font-title font-bold text-3xl text-srd-maroon">Join Shree Ram Dairy</h2>
          <div className="w-16 h-0.5 bg-srd-gold mx-auto mt-3"></div>
        </div>

        {(validationError || error) && (
          <div className="bg-red-50 text-red-700 p-3.5 rounded-lg border border-red-200 mb-6 flex items-start gap-2 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{validationError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="name">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <User size={16} />
              </span>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-srd-gold focus:ring-1 focus:ring-srd-gold"
                placeholder="Vanshal Patel"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="email">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Mail size={16} />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-srd-gold focus:ring-1 focus:ring-srd-gold"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="phone">Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Phone size={16} />
              </span>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-srd-gold focus:ring-1 focus:ring-srd-gold"
                placeholder="9876543210"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="password">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Lock size={16} />
              </span>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-srd-gold focus:ring-1 focus:ring-srd-gold"
                placeholder="•••••••• (Min 6 chars)"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Lock size={16} />
              </span>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-srd-gold focus:ring-1 focus:ring-srd-gold"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white py-3 rounded-lg font-bold text-sm tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Creating account...' : (
              <>
                Register <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="absolute bg-white px-3 text-xs text-gray-400 uppercase font-semibold">Or Register With</span>
        </div>

        {/* Google OAuth Login */}
        <div className="flex justify-center mb-5">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            shape="rectangular"
            theme="filled_blue"
            text="signup_with"
          />
        </div>

        {/* Redirection link */}
        <p className="text-center text-sm text-gray-600 font-medium">
          Already have an account?{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-srd-orange hover:text-srd-maroon font-bold underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
