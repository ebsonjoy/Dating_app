import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../slices/apiUserSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/user/loader";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";

import { AiOutlineGoogle } from "react-icons/ai";

//tailwind
const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err: any) {
      if (
        err?.data?.message === "Your account has been blocked by the admin."
      ) {
        toast.error(
          "Your account has been blocked by the admin. Please contact support."
        );
      } else {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In");
  };

  return (
    <div className="flex h-screen bg-gray-200 text-gray-900">
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-5">
        <h1 className="text-4xl font-bold text-center">
          Discover New Connections!
        </h1>
        <p className="text-lg text-center mt-5 px-4">
          Join our platform and start exploring. Your next best match is just a
          sign-in away!
        </p>
        <Link to="/register">
          <button className="mt-6 px-6 py-2 bg-black text-white rounded hover:bg-gray-900 transition duration-300">
            Sign Up
          </button>
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex justify-center items-center p-5">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <h2 className="text-2xl font-semibold mb-6">Sign In</h2>

            <div className="mb-5">
              <label htmlFor="email" className="block text-sm mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none text-white focus:border-gray-500"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block text-sm mb-1">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none text-white focus:border-gray-500"
              />
            </div>

            {isLoading && <Loader />}

            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded text-lg hover:bg-gray-900 transition duration-300 mb-3"
            >
              Sign In
            </button>

            <Link
              to="/forgotPasswordRequesting"
              className="text-blue-500 text-center text-sm"
            >
              Forgot Password?
            </Link>

            <div className="text-center text-sm text-gray-500 mt-6 mb-6">
              OR
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Sign in with Google</span>
              <button
                className="p-2 bg-white border border-gray-300 text-gray-700 rounded-full flex items-center"
                onClick={handleGoogleSignIn}
              >
                {/* Embedded Google SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-6 h-6 mr-2"
                >
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.04 0 5.24 1.26 6.44 2.32l4.92-4.92C31.78 4.76 28.22 3 24 3 14.92 3 7.4 9.74 5.08 18.26l5.92 4.6C12.9 15.66 18.03 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.63 24.56c0-.9-.08-1.77-.2-2.62H24v7.05h12.7c-.55 2.68-2.14 4.95-4.5 6.46l5.92 4.6c3.44-3.16 5.5-7.82 5.5-13.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M11 28.8c-1.16-1.44-1.82-3.26-1.82-5.26 0-1.99.66-3.82 1.8-5.26l-5.92-4.6C2.53 16.74 1 20.24 1 24.04s1.53 7.3 4.06 10.36l5.94-4.6z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 46c5.22 0 9.6-1.72 12.8-4.68l-5.92-4.6c-1.64 1.14-3.72 1.86-6.88 1.86-5.97 0-11.1-6.16-12.02-13.36l-5.92 4.6C7.4 38.26 14.92 45 24 45z"
                  />
                </svg>
                <span>Sign in</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
