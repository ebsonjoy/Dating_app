// ForgotPassword.tsx
import React, { useState } from 'react';
import {useForgotPasswordRequestingMutation} from "../../slices/apiUserSlice";
import { toast } from "react-toastify";
const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
  const [forgotPasswordRequesting] = useForgotPasswordRequestingMutation();
    
    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        if (!email) {
            setError('Please enter your email.');
            return;
        }
        try{
            await forgotPasswordRequesting({email}).unwrap()
        toast.success("Password reset link sent to your email");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }catch(err:any){
            toast.error(err?.data?.message || err.error);
        }
        setError('');
        console.log('Email submitted:', email);
    };

    return (
        <div className="bg-gray-100 h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Forgot Password</h2>
                
                <form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email ID</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your email"
                            required
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>

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

export default ForgotPassword;
