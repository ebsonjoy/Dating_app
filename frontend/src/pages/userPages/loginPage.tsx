import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../slices/apiUserSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/user/loader";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { useGoogleLoginMutation } from "../../slices/apiUserSlice";
import { GoogleLogin } from '@react-oauth/google'

// import { AiOutlineGoogle } from "react-icons/ai";

//tailwind
const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [googleLogin] = useGoogleLoginMutation();

  useEffect(() => {
    if (userInfo && !userInfo.isGoogleLogin) {
      console.log('useeeeeeeeeeeeeeeeeeeeeeee');
      
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await googleLogin({ 
        credential: credentialResponse.credential 
      }).unwrap();
      const userId = res._id;
      localStorage.setItem("userId", userId);
      console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',res)
      // console.log('nnn',res.navigateTo)
      dispatch(setCredentials({ ...res}));
      if (res.isGoogleLogin) {
        console.log('wrkkkkkkkkkkkkkkkkkkkkkkkkkk')
        navigate('/userInfoSignUp'); // Redirect to profile completion page
      } else {
        console.log('hmhm')
        navigate('/'); // Home page for users with a complete profile
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      console.log('submitttttt',res)

      navigate("/");
    } catch (err: any) {
      console.log('eeeeeeeeeeeeeeeeeeeeee',err)
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

  // const handleGoogleSignIn = () => {
  //   console.log("Google Sign In");
  // };

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
      {/* <span className="text-sm text-gray-700">Sign in with Google</span> */}
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
