import React, { useEffect, useState, useCallback } from "react";
import "../style/userStyle/userOtp.css"; 
import { Link, useNavigate } from "react-router-dom";
import { useVerifyOtpMutation,useResendOtpMutation } from "../../slices/apiUserSlice";
import { toast } from "react-toastify";
const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const [emailId, setEmailId] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(60); 
  const [isOtpExpired, setIsOtpExpired] = useState<boolean>(false);
  const navigate = useNavigate();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation()

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
          setIsOtpExpired(true); // OTP has expired
          return 0;
        }
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer(); 
    
  }, [startTimer]);

  const handleInputChange = (index: number, value: string) => {
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
      navigate("/userInfoSignUp");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleResend = async (e:React.FormEvent) => {
    e.preventDefault();
    try{
      await resendOtp({emailId}).unwrap();
      console.log(emailId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
    // Resend OTP 
    console.log("Resend OTP");
    startTimer(); 
    setOtp(Array(4).fill('')); 
    startTimer(); 
    toast.success("A new OTP has been sent!");
  };

  return (
    <div className="otp-verification-container">
      <div className="otp-verification-left-side">
        <h1 className="otp-verification-creative-text">Verify Your Email!</h1>
        <p className="otp-verification-description">
          Please enter the OTP sent to your registered email address to proceed.
        </p>
        <Link to=" ">
          <button className="otp-verification-back-button">Explore</button>
        </Link>
      </div>

      <div className="otp-verification-right-side">
        <div className="otp-verification-form-box">
          <form className="otp-verification-form" onSubmit={handleSubmit}>
            <h2>OTP Verification</h2>

            <div className="otp-verification-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  id={`otp-input-${index}`}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  maxLength={1}
                  className="otp-verification-input"
                />
              ))}
            </div>

            {/* Timer Display */}
            <div className={`otp-timer ${isOtpExpired ? 'expired' : ''}`}>
              {isOtpExpired
                ? 'OTP has expired.'
                : `Time left: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
            </div>

            <button type="submit" className="otp-verification-submit-button" disabled={isLoading || isOtpExpired}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {/* Resend button */}
            <p
              className={`otp-verification-resend ${isOtpExpired ? '' : 'disabled'}`}
              onClick={isOtpExpired ? handleResend : undefined}
            >
              Resend OTP
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
