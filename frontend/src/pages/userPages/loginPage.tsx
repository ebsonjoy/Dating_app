import React, { useEffect, useState } from "react";
import "../style/userStyle/userLogin.css";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../slices/apiUserSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/user/loader";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../store";
import {  useSelector } from 'react-redux';
import { RootState } from '../../store'; 

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth); 
  

  useEffect(()=>{
    if(userInfo){
        navigate('/');
    }
},[navigate, userInfo])
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
  
      dispatch(setCredentials({ ...res }));
      navigate("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In");
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-left-side">
        <h1 className="sign-in-creative-text">Discover New Connections!</h1>
        <p className="sign-in-description">
          Join our platform and start exploring. Your next best match is just a
          sign-in away!
        </p>
        <Link to="/register">
          <button className="sign-in-sign-up-button">Sign Up</button>
        </Link>
      </div>

      <div className="sign-in-right-side">
        <div className="sign-in-form-box">
          <form className="sign-in-form" onSubmit={handleSubmit}>
            <h2>Sign In</h2>

            <div className="sign-in-input-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="sign-in-input"
              />
            </div>

            <div className="sign-in-input-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="sign-in-input"
              />
            </div>
            {isLoading && <Loader />}
            <button type="submit" className="sign-in-submit-button">
              Sign In
            </button>

            <Link to="/forgotPasswordRequesting" className="sign-in-forgot-password">
              Forgot Password?
            </Link>

            <div className="sign-in-or-divider">OR</div>

            <div className="sign-in-google-sign-in">
              <span>Sign in with Google</span>
              <button className="sign-in-google-button" onClick={handleGoogleSignIn}>
                G
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
