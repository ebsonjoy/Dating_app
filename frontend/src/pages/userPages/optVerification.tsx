import React, { useEffect, useState, useCallback } from "react";
import {useNavigate } from "react-router-dom";
import { useVerifyOtpMutation, useResendOtpMutation } from "../../slices/apiUserSlice";
import { toast } from "react-toastify";
import { Heart, Mail } from 'lucide-react';
import { IApiError } from "../../types/error.types";

const OTPVerification = () => {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const [emailId, setEmailId] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isOtpExpired, setIsOtpExpired] = useState<boolean>(false);
  const navigate = useNavigate();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  useEffect(() => {
    const storedEmailId = localStorage.getItem('emailId');
    if (storedEmailId) {
      setEmailId(storedEmailId);
    } else {
      navigate('/register');
    }
  }, [navigate]);

  const startTimer = useCallback(() => {
    setIsOtpExpired(false);
    setTimeLeft(60);
    const timerInterval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timerInterval);
          setIsOtpExpired(true);
          return 0;
        }
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();
  }, [startTimer]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;

    if (value && index < 3) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
    if (!value && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
    setOtp(newOtp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp({ otp: otp.join(''), emailId }).unwrap();
      toast.success("Email verified successfully!");
      navigate("/userInfoSignUp");
    } catch (err: unknown) {
      const error = err as IApiError
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resendOtp({ emailId }).unwrap();
      setOtp(Array(4).fill(''));
      startTimer();
      toast.success("A new OTP has been sent to your email!");
    } catch (err: unknown) {
      const error = err as IApiError
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-rose-100 to-pink-100 flex flex-col lg:flex-row items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-64 h-64 bg-pink-300/20 rounded-full -top-12 -left-12 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-300/20 rounded-full -bottom-24 -right-24 animate-pulse delay-700" />
      </div>

      {/* Left Side */}
      <div className="lg:w-1/2 max-w-xl px-8 py-12 text-center lg:text-left relative z-10">
        <div className="space-y-8">
          <div className="flex items-center justify-center lg:justify-start space-x-3 transform hover:scale-105 transition duration-300">
            <Heart className="w-10 h-10 text-rose-500 animate-pulse" />
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-rose-500 to-pink-600 bg-clip-text text-transparent">
              Almost There!
            </h1>
          </div>

          <div className="space-y-6">
            <p className="text-xl text-gray-700 leading-relaxed">
              We've sent a verification code to your email. Please check your inbox and enter the code below.
            </p>

            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition duration-300">
              <div className="flex items-center space-x-3 text-gray-700">
                <Mail className="w-6 h-6 text-rose-500" />
                <span className="font-medium">Sent to: {emailId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - OTP Form */}
      <div className="lg:w-1/2 w-full max-w-md mt-8 lg:mt-0 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transform transition duration-500 hover:shadow-rose-200/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">Enter OTP</h2>
              <p className="text-gray-600">Please enter the 4-digit code</p>
            </div>

            {/* OTP Input Fields */}
            <div className="flex justify-center space-x-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  id={`otp-input-${index}`}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  maxLength={1}
                  className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 bg-white/90"
                />
              ))}
            </div>

            {/* Timer Display */}
            <div className={`text-center ${isOtpExpired ? 'text-red-500' : 'text-gray-600'}`}>
              {isOtpExpired ? (
                <span className="flex items-center justify-center space-x-2">
                  <span>OTP has expired.</span>
                </span>
              ) : (
                <span className="font-medium">
                  Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || isOtpExpired || otp.some(digit => digit === '')}
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-rose-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying...</span>
                </span>
              ) : (
                "Verify OTP"
              )}
            </button>

            {/* Resend Button */}
            <button
              type="button"
              onClick={handleResend}
              disabled={!isOtpExpired}
              className="w-full py-3 bg-white text-gray-800 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;