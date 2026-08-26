import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/mockApi';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form Validation State
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field dynamically
  const validateField = (fieldName, value, currentPassword = password) => {
    let error = '';
    if (fieldName === 'name') {
      if (!value.trim()) {
        error = 'Full name is required.';
      } else if (value.trim().length < 2) {
        error = 'Name must be at least 2 characters long.';
      }
    } else if (fieldName === 'email') {
      if (!value.trim()) {
        error = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email address (e.g., user@domain.com).';
      }
    } else if (fieldName === 'password') {
      if (!value.trim()) {
        error = 'Password is required.';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters long.';
      }
    } else if (fieldName === 'confirmPassword') {
      if (!value.trim()) {
        error = 'Please confirm your password.';
      } else if (value !== currentPassword) {
        error = 'Passwords do not match.';
      }
    }
    return error;
  };

  const validateForm = () => {
    const errors = {
      name: validateField('name', name),
      email: validateField('email', email),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword, password),
    };

    const activeErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, err]) => err)
    );

    setFieldErrors(activeErrors);
    return Object.keys(activeErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let val = '';
    if (field === 'name') val = name;
    if (field === 'email') val = email;
    if (field === 'password') val = password;
    if (field === 'confirmPassword') val = confirmPassword;

    const error = validateField(field, val, password);
    setFieldErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    setGeneralError('');
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') {
      setPassword(value);
      // Re-validate confirmPassword if confirmPassword is touched
      if (touched.confirmPassword && confirmPassword) {
        const confirmErr = validateField('confirmPassword', confirmPassword, value);
        setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
      }
    }
    if (field === 'confirmPassword') setConfirmPassword(value);

    if (touched[field]) {
      const error = validateField(field, value, field === 'password' ? value : password);
      setFieldErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    // Touch all fields on submit attempt
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate registration delayed promise API request
      await registerUser({ name, email, password, confirmPassword });
      // Navigate to login after successful registration
      navigate('/login');
    } catch (err) {
      setGeneralError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">ChatFlow</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new account</p>
        </div>

        {generalError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-md font-medium">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="John Doe"
              className={`w-full px-3 py-2 border rounded-md text-gray-800 text-sm focus:outline-none focus:ring-2 ${
                touched.name && fieldErrors.name
                  ? 'border-red-500 focus:ring-red-400 bg-red-50/30'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={isSubmitting}
            />
            {touched.name && fieldErrors.name && (
              <span className="text-xs text-red-600 mt-1 block font-medium">
                {fieldErrors.name}
              </span>
            )}
          </div>

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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            {touched.password && fieldErrors.password && (
              <span className="text-xs text-red-600 mt-1 block font-medium">
                {fieldErrors.password}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="••••••••"
              className={`w-full px-3 py-2 border rounded-md text-gray-800 text-sm focus:outline-none focus:ring-2 ${
                touched.confirmPassword && fieldErrors.confirmPassword
                  ? 'border-red-500 focus:ring-red-400 bg-red-50/30'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={isSubmitting}
            />
            {touched.confirmPassword && fieldErrors.confirmPassword && (
              <span className="text-xs text-red-600 mt-1 block font-medium">
                {fieldErrors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
