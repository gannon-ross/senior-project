import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Registration = () => {
  const navigate = useNavigate();
  const { register, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    role: 'customer'
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // First name validation
    if (!formData.first_name) {
      errors.first_name = 'First name is required';
    }

    // Last name validation
    if (!formData.last_name) {
      errors.last_name = 'Last name is required';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;

      console.log('Submitting registration data:', registrationData);

      const response = await register(registrationData);
      console.log('Registration successful:', response);

      // Redirect to verification page
      navigate('/verify-email');
    } catch (error) {
      console.error('Registration error:', error);
      // Display the error to the user
      setFormErrors({
        ...formErrors,
        general: error.message || 'An error occurred during registration. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>

      {(error || formErrors.general) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || formErrors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-stone-400 rounded shadow-md px-3 py-2 mt-1 w-full"
            placeholder="your@email.com"
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-stone-400 rounded shadow-md px-3 py-2 mt-1 w-full"
            placeholder="Min. 8 characters"
          />
          {formErrors.password && (
            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="bg-stone-400 rounded shadow-md px-3 py-2 mt-1 w-full"
            placeholder="Confirm your password"
          />
          {formErrors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
          )}
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-300">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="bg-stone-400 rounded shadow-md px-3 py-2 mt-1 w-full"
              placeholder="First name"
            />
            {formErrors.first_name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.first_name}</p>
            )}
          </div>

          <div className="flex-1">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="bg-stone-400 rounded shadow-md px-3 py-2 mt-1 w-full"
              placeholder="Last name"
            />
            {formErrors.last_name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.last_name}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-300">
            Account Type
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="bg-stone-400 rounded shadow-md px-3 py-2 mt-1 w-full"
          >
            <option value="customer">Customer</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-stone-500 hover:bg-stone-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-300">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-blue-400 hover:text-blue-300"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Registration;
