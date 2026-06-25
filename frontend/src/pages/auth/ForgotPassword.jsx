import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';
import GlassCard from '../../components/common/GlassCard';
import GradientButton from '../../components/common/GradientButton';
import Logo from '../../components/common/Logo';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!phone) {
            toast.error('Please enter your phone number');
            return;
        }
        setLoading(true);
        try {
            await forgotPassword(phone);
            setSent(true);
            toast.success('Password reset link sent to your phone');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <GlassCard className="max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <Logo />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Reset your password
                    </p>
                </div>

                {sent ? (
                    <div className="text-center space-y-4">
                        <div className="text-emerald-600 dark:text-emerald-400 text-4xl">✅</div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Check your phone
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            We've sent a password reset link to <strong>{phone}</strong>.
                            Please follow the instructions to reset your password.
                        </p>
                        <Link to="/login" className="text-primary-600 hover:underline dark:text-primary-400 text-sm">
                            Back to login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                placeholder="0912345678"
                                className="input-field"
                                required
                            />
                            <p className="text-xs text-slate-400 mt-1">
                                Enter your registered phone number to receive a reset link.
                            </p>
                        </div>

                        <GradientButton
                            type="submit"
                            variant="primary"
                            className="w-full py-3"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </GradientButton>

                        <div className="text-center">
                            <Link to="/login" className="text-sm text-primary-600 hover:underline dark:text-primary-400">
                                Back to login
                            </Link>
                        </div>
                    </form>
                )}
            </GlassCard>
        </div>
    );
};

export default ForgotPassword;