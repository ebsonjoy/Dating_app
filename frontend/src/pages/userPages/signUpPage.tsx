import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../slices/apiUserSlice";
import { Heart, User, Mail, Phone, Calendar, Lock, Eye, EyeOff } from 'lucide-react';
import { IApiError } from "../../types/error.types";

const SignUp = () => {
  const [name, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formFocus, setFormFocus] = useState({
    name: false,
    email: false,
    mobile: false,
    dob: false,
    password: false,
    confirmPassword: false
  });

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 4000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);

    try {
      const res = await register({
        name,
        email,
        mobileNumber,
        password,
        dateOfBirth,
        confirmPassword,
      }).unwrap();
      
      const userId = res._id;
      const emailId = res.email;

      localStorage.setItem("userId", userId);
      localStorage.setItem("emailId", emailId);
      
      toast.success("Registration successful! Please verify your email.");
      navigate("/verifyOtp");
    } catch (err: unknown) {
      const error = err as IApiError
      if (error.data && Array.isArray(error.data.errors)) {
        setErrors(error.data.errors);
      } else {
        setErrors(['An unexpected error occurred. Please try again later.']);
      }
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

      {/* Left Side - Welcome Section */}
      <div className="lg:w-1/2 max-w-xl px-8 py-12 text-center lg:text-left relative z-10">
        <div className="space-y-8">
          <div className="flex items-center justify-center lg:justify-start space-x-3 transform hover:scale-105 transition duration-300">
            <Heart className="w-10 h-10 text-rose-500 animate-pulse" />
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-rose-500 to-pink-600 bg-clip-text text-transparent">
              Start Your Journey
            </h1>
          </div>
          
          <div className="space-y-6">
            <p className="text-xl text-gray-700 leading-relaxed">
              Join our vibrant community and discover meaningful connections. Your perfect match might be just a click away!
            </p>
            
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Member Benefits</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center space-x-2">
                  <span className="text-rose-500">✨</span>
                  <span>Smart Match Technology</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-rose-500">🔒</span>
                  <span>Privacy First Approach</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-rose-500">💫</span>
                  <span>24/7 Support Available</span>
                </li>
              </ul>
            </div>

            <Link to="/login">
              <button className="px-8 py-3 bg-white/80 text-gray-800 rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5">
                Already have an account? Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="lg:w-1/2 w-full max-w-2xl mt-8 lg:mt-0 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transform transition duration-500 hover:shadow-rose-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-600">Fill in your details to get started</p>
            </div>

            {errors.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                {errors.map((error, index) => (
                  <div key={index} className="text-red-700 text-sm">
                    ⚠️ {error}
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="relative">
                <label className={`text-sm font-medium transition-all duration-200 ${
                  formFocus.name ? 'text-rose-600' : 'text-gray-700'
                }`}>
                  Full Name
                </label>
                <div className="relative mt-1">
                  <User className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 ${
                    formFocus.name ? 'text-rose-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setFirstName(e.target.value.trim())}
                    onFocus={() => setFormFocus(prev => ({ ...prev, name: true }))}
                    onBlur={() => setFormFocus(prev => ({ ...prev, name: false }))}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 bg-white/90"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="relative">
                <label className={`text-sm font-medium transition-all duration-200 ${
                  formFocus.email ? 'text-rose-600' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <div className="relative mt-1">
                  <Mail className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 ${
                    formFocus.email ? 'text-rose-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFormFocus(prev => ({ ...prev, email: true }))}
                    onBlur={() => setFormFocus(prev => ({ ...prev, email: false }))}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 bg-white/90"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number Input */}
              <div className="relative">
                <label className={`text-sm font-medium transition-all duration-200 ${
                  formFocus.mobile ? 'text-rose-600' : 'text-gray-700'
                }`}>
                  Mobile Number
                </label>
                <div className="relative mt-1">
                  <Phone className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 ${
                    formFocus.mobile ? 'text-rose-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.trim())}
                    onFocus={() => setFormFocus(prev => ({ ...prev, mobile: true }))}
                    onBlur={() => setFormFocus(prev => ({ ...prev, mobile: false }))}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 bg-white/90"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth Input */}
              <div className="relative">
                <label className={`text-sm font-medium transition-all duration-200 ${
                  formFocus.dob ? 'text-rose-600' : 'text-gray-700'
                }`}>
                  Date of Birth
                </label>
                <div className="relative mt-1">
                  <Calendar className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 ${
                    formFocus.dob ? 'text-rose-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    onFocus={() => setFormFocus(prev => ({ ...prev, dob: true }))}
                    onBlur={() => setFormFocus(prev => ({ ...prev, dob: false }))}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 bg-white/90"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <label className={`text-sm font-medium transition-all duration-200 ${
                  formFocus.password ? 'text-rose-600' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative mt-1">
                  <Lock className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 ${
                    formFocus.password ? 'text-rose-500' : 'text-gray-400'
                  }`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFormFocus(prev => ({ ...prev, password: true }))}
                    onBlur={() => setFormFocus(prev => ({ ...prev, password: false }))}
                    className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 bg-white/90"
                    placeholder="Create password"
                    required
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

              {/* Confirm Password Input */}
              <div className="relative">
                <label className={`text-sm font-medium transition-all duration-200 ${
                  formFocus.confirmPassword ? 'text-rose-600' : 'text-gray-700'
                }`}>
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <Lock className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 ${
                    formFocus.confirmPassword ? 'text-rose-500' : 'text-gray-400'
                  }`} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFormFocus(prev => ({ ...prev, confirmPassword: true }))}
                    onBlur={() => setFormFocus(prev => ({ ...prev, confirmPassword: false }))}
                    className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200 bg-white/90"
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-rose-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 mt-6"
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
                  <span>Creating Account...</span>
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Terms and Privacy Policy */}
            <p className="text-center text-sm text-gray-600 mt-4">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-rose-600 hover:text-rose-700 font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-rose-600 hover:text-rose-700 font-medium">
                Privacy Policy
              </Link>
            </p>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            {/* Social Sign Up Options */}
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => toast.info("Google sign up coming soon!")}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  />
                </svg>
              </button>
            </div>

            {/* Login Link for Mobile */}
            <div className="mt-6 text-center lg:hidden">
              <Link
                to="/login"
                className="text-rose-600 hover:text-rose-700 font-medium transition duration-200"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;