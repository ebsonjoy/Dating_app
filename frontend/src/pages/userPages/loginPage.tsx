import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../slices/apiUserSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/user/loader";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { useGoogleLoginMutation } from "../../slices/apiUserSlice";
import { GoogleLogin,CredentialResponse } from '@react-oauth/google';
import { Heart, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { IApiError } from "../../types/error.types";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formFocus, setFormFocus] = useState({ email: false, password: false });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [login] = useLoginMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [googleLogin] = useGoogleLoginMutation();

  useEffect(() => {
    if (userInfo && !userInfo.isGoogleLogin) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setIsLoading(true);
      const res = await googleLogin({ 
        credential: credentialResponse.credential || ''
      }).unwrap();
      const userId = res._id;
      localStorage.setItem("userId", userId);
      dispatch(setCredentials({ ...res}));
      if (res.isGoogleLogin) {
        navigate('/userInfoSignUp');
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      const error = err as IApiError
      if (error?.data?.message === "Your account has been blocked by the admin.") {
        toast.error("Your account has been blocked by the admin. Please contact support.");
      } else {
        toast.error(error?.data?.message || error.error);
      }
      // toast.error(err?.data?.message || err.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Successfully logged in!");
      navigate("/");
    } catch (err: unknown) {
      const error = err as IApiError
      console.log('eeeeeee',error)
      if (error?.data?.message === "Your account has been blocked by the admin.") {
        toast.error("Your account has been blocked by the admin. Please contact support.");
      } else {
        toast.error(error?.data?.message || error.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-rose-100 to-pink-100 flex flex-col lg:flex-row items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-64 h-64 bg-pink-300/20 rounded-full -top-12 -left-12 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-300/20 rounded-full -bottom-24 -right-24 animate-pulse delay-700" />
      </div>

      {/* Left Side - Welcome Section */}
      <div className="lg:w-1/2 max-w-xl px-8 py-12 text-center lg:text-left relative z-10">
        <div className="space-y-8">
          <div className="flex items-center justify-center lg:justify-start space-x-3 transform hover:scale-105 transition duration-300">
            <Heart className="w-10 h-10 text-rose-500 animate-pulse" />
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-rose-500 to-pink-600 bg-clip-text text-transparent">
              Love Awaits
            </h1>
          </div>
          
          <div className="space-y-6">
            <p className="text-xl text-gray-700 leading-relaxed">
              Begin your journey to meaningful connections. Join our community of singles looking for authentic relationships.
            </p>
            
            <div className="flex flex-col space-y-4">
              <div className="bg-white/30 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Why Choose Us?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✨ Advanced Matching Algorithm</li>
                  <li>🔒 Secure & Private</li>
                  <li>💫 Verified Profiles</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 w-full max-w-md mt-8 lg:mt-0 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transform transition duration-500 hover:shadow-rose-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600">We're so excited to see you again!</p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <label 
                  htmlFor="email" 
                  className={`text-sm font-medium transition-all duration-200 ${
                    formFocus.email ? 'text-rose-600' : 'text-gray-700'
                  }`}
                >
                  Email Address
                </label>
                <div className="relative mt-1">
                  <Mail className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 ${
                    formFocus.email ? 'text-rose-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFormFocus(prev => ({ ...prev, email: true }))}
                    onBlur={() => setFormFocus(prev => ({ ...prev, email: false }))}
                    required
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 bg-white/90 text-gray-900"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="relative">
                <label 
                  htmlFor="password" 
                  className={`text-sm font-medium transition-all duration-200 ${
                    formFocus.password ? 'text-rose-600' : 'text-gray-700'
                  }`}
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <Lock className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 ${
                    formFocus.password ? 'text-rose-500' : 'text-gray-400'
                  }`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFormFocus(prev => ({ ...prev, password: true }))}
                    onBlur={() => setFormFocus(prev => ({ ...prev, password: false }))}
                    required
                    className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 bg-white/90 text-gray-900"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {isLoading && <Loader />}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-rose-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            <div className="flex items-center justify-between">
              <Link
                to="/register"
                className="text-sm text-gray-600 hover:text-rose-600 transition duration-200"
              >
                New here? Sign up
              </Link>
              <Link
                to="/forgotPasswordRequesting"
                className="text-sm text-gray-600 hover:text-rose-600 transition duration-200"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center transform hover:scale-105 transition duration-300">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast.error('Google Sign In was unsuccessful');
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;