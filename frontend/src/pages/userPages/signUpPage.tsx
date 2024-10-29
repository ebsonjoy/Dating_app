import React, { useState, FormEvent, useEffect } from "react";
import "../style/userStyle/userSignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../slices/apiUserSlice";
import { Alert } from '@mui/material';

const SignUp: React.FC = () => {
  const [name, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");

  const [errors, setErrors] = useState<string[]>([]);

  // const [errorMessages, setErrorMessages] = useState<{
  //   name?: string;
  //   email?: string;
  //   mobileNumber?: string;
  //   password?: string;
  //   confirmPassword?: string;
  //   dateOfBirth?: string;
  // }>({});

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 4000);
      return () => clearTimeout(timer); // Clear timeout if errors change
    }
  }, [errors]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);


    // setErrorMessages({});

    // const newErrorMessages: {
    //   name?: string;
    //   email?: string;
    //   mobileNumber?: string;
    //   password?: string;
    //   confirmPassword?: string;
    //   dateOfBirth?: string;
    // } = {};

    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // const nameRegex = /^[A-Za-z\s'-]+$/;
    // const mobileRegex = /^[0-9]{10}$/;
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    // if (!name) {
    //   newErrorMessages.name = "Name is required";
    // } else if (name.length < 2 || name.length > 50) {
    //   newErrorMessages.name = "Name must be between 2 and 50 characters long";
    // } else if (!nameRegex.test(name)) {
    //   newErrorMessages.name = "Name is not valid";
    // }

    // if (!email) {
    //   newErrorMessages.email = "Email is required";
    // } else if (!emailRegex.test(email)) {
    //   newErrorMessages.email = "Email is not valid";
    // } else if (email.endsWith(".")) {
    //   newErrorMessages.email = "Email cannot end with a dot";
    // }

    // if (!mobileNumber) {
    //   newErrorMessages.mobileNumber = "Mobile number is required";
    // } else if (!mobileRegex.test(mobileNumber)) {
    //   newErrorMessages.mobileNumber = "Mobile number must be exactly 10 digits";
    // }

    // if (!password) {
    //   newErrorMessages.password = "Password is required";
    // } else if (password.length < 6) {
    //   newErrorMessages.password = "Password must be at least 6 characters";
    // } else if (!passwordRegex.test(password)) {
    //   newErrorMessages.password =
    //     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    // }

    // if (password !== confirmPassword) {
    //   newErrorMessages.confirmPassword = "Passwords do not match";
    // }

    // const dob = new Date(dateOfBirth);
    // const today = new Date();

    // if (!dateOfBirth) {
    //   newErrorMessages.dateOfBirth = "Date of birth is required";
    // } else if (dob > today) {
    //   newErrorMessages.dateOfBirth = "Date of birth cannot be in the future";
    // }

    // if (dob) {
    //   let age = today.getFullYear() - dob.getFullYear();
    //   const monthDifference = today.getMonth() - dob.getMonth();

    //   if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
    //     age--;
    //   }

    //   if (age < 18) {
    //     newErrorMessages.dateOfBirth = "You must be at least 18 years old to use this app.";
    //   }
    // }
    // if (Object.keys(newErrorMessages).length > 0) {
    //   setErrorMessages(newErrorMessages);

    //   setTimeout(() => {
    //     setErrorMessages({});
    //   }, 3000);

    //   return;
    // }

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

      navigate("/verifyOtp");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('Error response:', error);

      if (error.data && Array.isArray(error.data.errors)) {
        setErrors(error.data.errors);
      } else {
        setErrors(['An unexpected error occurred. Please try again later.']);
      }
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google Sign Up");
  };

  return (
    <div className="container-signup">
      <div className="left-side-signup">
        <h1 className="creative-text-signup">Join Us Today!</h1>
        <p className="description-signup">
          Create an account to start exploring the world of new connections.
        </p>
        <Link to="/login">
          <button className="sign-in-button-signup">Sign In</button>
        </Link>
      </div>

      <div className="right-side-signup">
        <div className="form-box-signup">
          <form className="form-signup" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>

            {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              <span className="error-icon">⚠️</span> {error}
            </div>
          ))}
        </div>
      )}

            <div className="row-input-group">
              <div className="input-group-signup">
                <label htmlFor="name">First Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setFirstName(e.target.value.trim())}
                  required
                  className="input-signup"
                />
                {/* {errorMessages.name && <span className="error-message">{errorMessages.name}</span>} */}
              </div>

              <div className="input-group-signup">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-signup"
                />
                {/* {errorMessages.email && <span className="error-message">{errorMessages.email}</span>} */}
              </div>
            </div>

            <div className="row-input-group">
              <div className="input-group-signup">
                <label htmlFor="mobileNumber">Mobile Number:</label>
                <input
                  type="tel"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.trim())}
                  required
                  className="input-signup"
                />
                {/* {errorMessages.mobileNumber && <span className="error-message">{errorMessages.mobileNumber}</span>} */}
              </div>

              <div className="input-group-signup">
                <label htmlFor="dateOfBirth">Date of Birth:</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  className="input-signup"
                />
                {/* {errorMessages.dateOfBirth && <span className="error-message">{errorMessages.dateOfBirth}</span>} */}
              </div>
            </div>

            <div className="row-input-group">
              <div className="input-group-signup">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-signup"
                />
                {/* {errorMessages.password && <span className="error-message">{errorMessages.password}</span>} */}
              </div>

              <div className="input-group-signup">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input-signup"
                />
                {/* {errorMessages.confirmPassword && <span className="error-message">{errorMessages.confirmPassword}</span>} */}
              </div>
            </div>

            <button
              type="submit"
              className="submit-button-signup"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="or-divider-signup">OR</div>

            <div className="google-sign-up-signup">
              <span>Sign up with Google</span>
              <button
                className="google-button-signup"
                onClick={handleGoogleSignUp}
              >
                G
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
