import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, { password });
      setSuccess(response.data.message || 'Your password has been successfully updated.');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired password reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-srd-cream py-12 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl border-2 border-srd-gold/30 shadow-xl p-8 relative overflow-hidden">
        {/* Decorative corner patterns */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-srd-gold/30 rounded-tl-2xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-srd-gold/30 rounded-tr-2xl pointer-events-none"></div>

        {/* Heading */}
        <div className="text-center mb-8">
          <span className="font-title italic text-srd-orange text-lg block mb-1 font-semibold">Change Credentials</span>
          <h2 className="font-title font-bold text-2xl text-srd-maroon">Reset Password</h2>
          <div className="w-16 h-0.5 bg-srd-gold mx-auto mt-3"></div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3.5 rounded-lg border border-red-200 mb-6 flex items-start gap-2 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 mx-auto flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="font-title font-bold text-lg text-srd-maroon">Password Reset Complete</h4>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
              {success}
            </p>
            <div className="pt-4">
              <Link to="/login" className="inline-block bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md">
                Sign In Now
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-sm text-gray-500 text-center leading-relaxed">
              Enter and confirm your new account security password.
            </p>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="password">New Password</label>
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
                  placeholder="•••••••• (Min 6 chars)"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <Lock size={18} />
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-srd-gold focus:ring-1 focus:ring-srd-gold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white py-3.5 rounded-lg font-bold text-sm tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
