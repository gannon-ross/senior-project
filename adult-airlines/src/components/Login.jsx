import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, error } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setLoginError('Please enter both email and password');
            return;
        }

        try {
            setIsSubmitting(true);
            setLoginError('');

            console.log('Attempting login with:', { email: formData.email });

            try {
                await login(formData.email, formData.password);

                // Redirect to dashboard
                navigate('/dashboard');
            } catch (error) {
                console.error('Login failed:', error);
                setLoginError(error.message || 'Invalid email or password');

                // For demo purposes, you can uncomment this to bypass login errors
                // console.log('Simulating successful login despite error');
                // navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login submission error:', error);
            setLoginError(error.message || 'An error occurred during login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='w-full h-dvh flex flex-col items-center justify-center'>
            <h2 className="text-2xl font-bold mb-2">Welcome to Adult Airlines!</h2>
            <h2 className="text-xl mb-6">Please log in below:</h2>

            {(error || loginError) && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-80">
                    {error || loginError}
                </div>
            )}

            <form onSubmit={handleSubmit} className='flex flex-col justify-between w-80'>
                <input
                    className='bg-stone-400 rounded shadow-md px-3 py-2 my-2'
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Email:'
                />
                <input
                    className='bg-stone-400 rounded shadow-md px-3 py-2 my-2'
                    type='password'
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='Password:'
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className='place-self-center duration-300 w-[40%] rounded hover:cursor-pointer bg-stone-400 hover:bg-stone-600 px-3 py-2 my-2'
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-300">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;