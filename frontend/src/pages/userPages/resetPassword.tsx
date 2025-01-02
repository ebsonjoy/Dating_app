import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResetPasswordMutation } from '../../slices/apiUserSlice';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Loader from "../../components/user/loader";
import { IApiError } from '../../types/error.types';


const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formFocus, setFormFocus] = useState({ password: false, confirmPassword: false });
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [resetPassword] = useResetPasswordMutation();

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let valid = true;
        setPasswordError('');
        setConfirmPasswordError('');

        if (!password) {
            setPasswordError('Please enter your password.');
            valid = false;
        } else if (!validatePassword(password)) {
            setPasswordError(
                'Password must include at least 1 uppercase, 1 lowercase, 1 digit, 1 special character, and be at least 8 characters long.'
            );
            valid = false;
        }

        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password.');
            valid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            valid = false;
        }

        if (!valid) return;

        if (!token) {
            setPasswordError('Invalid or missing token.');
            return;
        }

        try {
            setIsLoading(true);
            await resetPassword({ data: { password }, token });
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: unknown) {
            const error = err as IApiError
            setPasswordError(error?.data?.message || 'Error resetting password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-rose-100 to-pink-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-64 h-64 bg-pink-300/20 rounded-full -top-12 -left-12 animate-pulse" />
                <div className="absolute w-96 h-96 bg-purple-300/20 rounded-full -bottom-24 -right-24 animate-pulse delay-700" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transform transition duration-500 hover:shadow-rose-200/50">
                    <div className="text-center space-y-2 mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                        <p className="text-gray-600">Enter your new password below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password Field */}
                        <div className="relative">
                            <label
                                htmlFor="password"
                                className={`text-sm font-medium transition-all duration-200 ${
                                    formFocus.password ? 'text-rose-600' : 'text-gray-700'
                                }`}
                            >
                                New Password
                            </label>
                            <div className="relative mt-1">
                                <Lock
                                    className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 ${
                                        formFocus.password ? 'text-rose-500' : 'text-gray-400'
                                    }`}
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFormFocus((prev) => ({ ...prev, password: true }))}
                                    onBlur={() => setFormFocus((prev) => ({ ...prev, password: false }))}
                                    required
                                    className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 bg-white/90 text-gray-900"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition duration-200"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {passwordError && <p className="text-sm text-rose-600 mt-2">{passwordError}</p>}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative">
                            <label
                                htmlFor="confirm-password"
                                className={`text-sm font-medium transition-all duration-200 ${
                                    formFocus.confirmPassword ? 'text-rose-600' : 'text-gray-700'
                                }`}
                            >
                                Confirm Password
                            </label>
                            <div className="relative mt-1">
                                <Lock
                                    className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 ${
                                        formFocus.confirmPassword ? 'text-rose-500' : 'text-gray-400'
                                    }`}
                                />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onFocus={() => setFormFocus((prev) => ({ ...prev, confirmPassword: true }))}
                                    onBlur={() => setFormFocus((prev) => ({ ...prev, confirmPassword: false }))}
                                    required
                                    className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 bg-white/90 text-gray-900"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition duration-200"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {confirmPasswordError && (
                                <p className="text-sm text-rose-600 mt-2">{confirmPasswordError}</p>
                            )}
                        </div>

                        {isLoading && <Loader />}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 via-rose-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
                        >
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                        </button>

                        <div className="text-center">
  <button
    onClick={() => navigate('/login')}
    className="text-sm text-gray-600 hover:text-rose-600 transition duration-200"
  >
    Back to Login
  </button>
</div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
