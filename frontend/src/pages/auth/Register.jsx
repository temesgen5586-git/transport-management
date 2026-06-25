import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { isValidPhone, isValidEmail, isValidNationalId } from '../../utils/validators';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import Logo from '../../components/common/Logo';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        national_id: '',
        full_name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!isValidNationalId(formData.national_id)) {
            toast.error('Invalid National ID. Must be 10-12 digits.');
            return false;
        }
        if (!isValidPhone(formData.phone)) {
            toast.error('Invalid phone number. Must be 09XXXXXXXX.');
            return false;
        }
        if (formData.email && !isValidEmail(formData.email)) {
            toast.error('Invalid email format.');
            return false;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await register({
                national_id: formData.national_id,
                full_name: formData.full_name,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
            });
            navigate('/');
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <GlassCard className="max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-6">
                    <Logo />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Create your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            National ID *
                        </label>
                        <input
                            name="national_id"
                            value={formData.national_id}
                            onChange={handleChange}
                            placeholder="123456789012"
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Full Name *
                        </label>
                        <input
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Phone Number *
                        </label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="0912345678"
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Email (optional)
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@email.com"
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Password *
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="input-field pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Minimum 6 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Confirm Password *
                        </label>
                        <input
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="input-field"
                            required
                        />
                    </div>

                    <GradientButton
                        type="submit"
                        variant="primary"
                        className="w-full py-3 mt-2"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </GradientButton>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:underline dark:text-primary-400">
                            Sign in
                        </Link>
                    </p>
                </div>
            </GlassCard>
        </div>
    );
};

export default Register;