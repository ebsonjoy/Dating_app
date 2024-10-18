// ResetPassword.tsx
import React, { useState } from 'react';
import { useParams,useNavigate  } from 'react-router-dom';
import {useResetPasswordMutation} from '../../slices/apiUserSlice'
import { toast } from "react-toastify";


const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { token } = useParams<{ token: string }>(); // Get token from URL
    const navigate = useNavigate();
    const [resetPassword] = useResetPasswordMutation();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate passwords
        if (!password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!token) {
            toast.error('Invalid or missing token.');
            return;
          }

        try{
            await resetPassword({ data: { password }, token }); 
            toast.success("Password reset successful!");
            setTimeout(() => {
                navigate('/login');
              }, 3000); // Redirect after 3 seconds
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                toast.error('Error resetting password.');
                console.log(error);
                
            }
        

        // Clear error if valid
        setError('');

        // Simulate API call to reset password with token
        console.log('Token:', token);
        console.log('Password successfully updated!');

        // You would call your API here, passing the token and new password
        // Example:
        // axios.post('/api/reset-password', { token, password })
        //      .then(response => { /* handle success */ })
        //      .catch(error => { /* handle error */ });
    };

    return (
        <div className="bg-gray-100 h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Reset Password</h2>
                
                <form onSubmit={handleSubmit}>
                    {/* New Password Field */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter new password"
                            required
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-4">
                        <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Submit
                        </button>
                    </div>
                </form>

                {/* Back to login link */}
                <div className="mt-4 text-center">
                    <a href="/login" className="text-blue-500 hover:underline">Back to Login</a>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
