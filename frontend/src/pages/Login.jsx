import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice.js';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';

export default function Login() {

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.role) {
            toast.error('Please select a role');
            return;
        }
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            dispatch(signInStart());
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message);
                dispatch(signInFailure(data.message));
                setLoading(false);
                return;
            }

            toast.success('Sign in successful!');
            dispatch(signInSuccess(data));
            setLoading(false);
            navigate('/dashboard', { replace: true });

        } catch (error) {
            toast.error(error.message);
            dispatch(signInFailure(error.message));
            setLoading(false);
        }
    }

    const fillDemo = (role, email, password) => {
        setFormData({
            role,
            email,
            password
        });
    };

    return (
        <div className='bg-gray-50 min-h-screen flex items-center justify-center p-4'>
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-8 sm:p-10 w-full max-w-lg mx-auto">

                {/* Branding */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center mb-3">
                        <MdAdminPanelSettings className="text-white" size={28} />
                    </div>
                    <h1 className="text-2xl font-bold font-cinzel text-gray-900">Admin Login</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign in to access the dashboard</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Login As
                        </label>
                        <select
                            id="role"
                            onChange={handleChange}
                            value={formData.role || ''}
                            defaultValue=""
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-shadow bg-white cursor-pointer"
                        >
                            <option value="" disabled>
                                Select Role
                            </option>
                            <option value="Admin">Admin</option>
                            <option value="Production Manager">Production Manager</option>
                        </select>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-1.5'>
                            Your Email
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                id='email'
                                type='email'
                                value={formData.email || ''}
                                onChange={handleChange}
                                className='w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-shadow'
                                placeholder='company@gmail.com'
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-1.5'>
                            Your Password
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                id='password'
                                type={showPassword ? 'text' : 'password'}
                                onChange={handleChange}
                                value={formData.password || ''}
                                className='w-full pl-9 pr-10 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-shadow'
                                placeholder='••••••••••'
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                value={formData.role || ''}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type='submit'
                        className='uppercase text-sm tracking-wide flex items-center gap-2 justify-center py-2.5 mt-2 bg-black text-white rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100'
                        disabled={loading}
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                        )}
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Demo Credentials */}
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-5 text-xs text-gray-700 mt-5">
                    
                    <p className='mb-3'>Click to Fill Data</p>

                    <div className='flex items-center gap-2'>
                        <div
                            onClick={() => fillDemo('Admin', 'admin@gmail.com', '123456')}
                            className="flex-1 cursor-pointer bg-white hover:bg-gray-200 p-2 rounded-md transition"
                        >
                            <p className="font-medium text-gray-900">Admin</p>
                            <p>Email: admin@gmail.com</p>
                            <p>Password: 123456</p>
                        </div>
                        <div
                            onClick={() => fillDemo('Production Manager', 'production@gmail.com', '12345678')}
                            className="flex-1 cursor-pointer bg-white hover:bg-gray-200 p-2 rounded-md transition"
                        >
                            <p className="font-medium text-gray-900">Production Manager</p>
                            <p>Email: production@gmail.com</p>
                            <p>Password: 12345678</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}