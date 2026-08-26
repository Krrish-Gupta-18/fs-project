import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/mockApi';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('alex.morgan@chatflow.io');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Validation States
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate fields dynamically
  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') {
      if (!value.trim()) {
        error = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email address (e.g., user@domain.com).';
      }
    } else if (name === 'password') {
      if (!value.trim()) {
        error = 'Password is required.';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters long.';
      }
    }
    return error;
  };

  const validateForm = () => {
    const errors = {
      email: validateField('email', email),
      password: validateField('password', password),
    };

    // Filter empty strings
    const activeErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, err]) => err)
    );

    setFieldErrors(activeErrors);
    return Object.keys(activeErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, field === 'email' ? email : password);
    setFieldErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    setGeneralError('');

    if (touched[field]) {
      const error = validateField(field, value);
      setFieldErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    // Touch all fields on submit attempt
    setTouched({ email: true, password: true });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulated asynchronous login API call
      await loginUser(email, password);
      // Navigate to Chat Dashboard on success
      navigate('/chat');
    } catch (err) {
      setGeneralError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">ChatFlow</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {generalError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-md font-medium">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="you@example.com"
              className={`w-full px-3 py-2 border rounded-md text-gray-800 text-sm focus:outline-none focus:ring-2 ${
                touched.email && fieldErrors.email
                  ? 'border-red-500 focus:ring-red-400 bg-red-50/30'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
            {touched.email && fieldErrors.email && (
              <span className="text-xs text-red-600 mt-1 block font-medium">
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="••••••••"
              className={`w-full px-3 py-2 border rounded-md text-gray-800 text-sm focus:outline-none focus:ring-2 ${
                touched.password && fieldErrors.password
                  ? 'border-red-500 focus:ring-red-400 bg-red-50/30'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
            {touched.password && fieldErrors.password && (
              <span className="text-xs text-red-600 mt-1 block font-medium">
                {fieldErrors.password}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isLoading}
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
