import React from 'react';
import '../style/user/navBar.css'
import { FaHeart, FaUserCircle } from 'react-icons/fa'; // Heart and profile icon
import { useLogoutMutation } from '../../slices/apiUserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {logout} from '../../slices/authSlice'
import { RootState } from '../../store'
const Navbar: React.FC = () => {

  const [logoutApiCall] = useLogoutMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const logoutHandler = async ()=>{
    

    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate('/landing')
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <nav className="vr-dating-navbar">
      <div className="vr-dating-navbar-logo">VR_DATING</div>
      <ul className="vr-dating-navbar-menu">
        <li className="vr-dating-menu-item">Home</li>
        <li className="vr-dating-menu-item">Message</li>
        <li className="vr-dating-menu-item">Dating Advice</li>
        <li className="vr-dating-menu-item">Game Zone</li>
        
        {/* Like icon inside a black circle */}
        <li className="vr-dating-menu-item vr-dating-like">
          <div className="vr-dating-like-circle">
            <FaHeart className="vr-dating-like-icon" />
          </div>
        </li>

        {/* Profile icon with user's name */}
        <li className="vr-dating-menu-item vr-dating-profile">
          <FaUserCircle className="vr-dating-profile-icon" />
          <span className="vr-dating-profile-name">{userInfo ? userInfo.name : "Guest"}</span>
        </li>
        {/* Logout button */}
        <li className="vr-dating-menu-item vr-dating-logout">
          <button className="vr-dating-logout-button" onClick={logoutHandler}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
