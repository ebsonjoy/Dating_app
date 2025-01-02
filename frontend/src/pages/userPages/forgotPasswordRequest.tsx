import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForgotPasswordRequestingMutation } from "../../slices/apiUserSlice";
import { toast } from "react-toastify";
import { Heart, Mail } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const [forgotPasswordRequesting, { isLoading }] =
    useForgotPasswordRequestingMutation();

  useEffect(() => {
    if (location.state) {
      const { email, isChangePassword } = location.state as {
        email: string;
        isChangePassword: boolean;
      };
      setEmail(email || "");
      setIsChangePassword(isChangePassword || false);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPasswordRequesting({ email }).unwrap();
      toast.success("Password reset link sent to your email");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "An unexpected error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
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
              {isChangePassword ? "Change Password" : "Reset Password"}
            </h1>
          </div>

          <div className="space-y-6">
            <p className="text-xl text-gray-700 leading-relaxed">
              {isChangePassword
                ? "Update your password here."
                : "Don't worry! Enter your email to reset your password."}
            </p>

            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition duration-300">
              <div className="flex items-center space-x-3 text-gray-700">
                <Mail className="w-6 h-6 text-rose-500" />
                <span className="font-medium">
                  {isChangePassword
                    ? "Enter your email to change your password"
                    : "We'll send you a reset link"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-1/2 w-full max-w-md mt-8 lg:mt-0 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transform transition duration-500 hover:shadow-rose-200/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">
                {isChangePassword ? "Change Password" : "Forgot Password"}
              </h2>
              <p className="text-gray-600">
                {isChangePassword
                  ? "Update your password using your registered email."
                  : "Enter your registered email address"}
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 bg-white/90"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-rose-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Sending...</span>
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
