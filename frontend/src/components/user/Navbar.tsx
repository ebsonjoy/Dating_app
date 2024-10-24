import React, { useState } from "react";
import { FaHeart, FaUserCircle, FaBars } from "react-icons/fa";
import { useLogoutMutation } from "../../slices/apiUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/authSlice";
import { RootState } from "../../store";
//Tailwind
const Navbar: React.FC = () => {
  const [logoutApiCall] = useLogoutMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/landing");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      {/* Logo */}
      <div className="text-white text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        VR_DATING
      </div>

      {/* Hamburger Icon (mobile) */}
      <div className="text-white text-2xl lg:hidden cursor-pointer" onClick={toggleMenu}>
        <FaBars />
      </div>

      {/* Menu */}
      <ul
        className={`${
          menuOpen ? "flex" : "hidden"
        } lg:flex flex-col lg:flex-row lg:space-x-8 lg:items-center lg:ml-auto absolute lg:relative top-16 lg:top-0 right-0 lg:right-auto bg-gray-800 lg:bg-transparent w-full lg:w-auto z-20 lg:z-auto`}
      >
        {/* Home */}
        <li className="text-white text-center py-2 lg:py-0 cursor-pointer" onClick={() => navigate("/")}>
          Home
        </li>
        {/* Message */}
        <li className="text-white text-center py-2 lg:py-0 cursor-pointer">Message</li>
        {/* Dating Advice */}
        <li className="text-white text-center py-2 lg:py-0 cursor-pointer">Dating Advice</li>
        {/* Game Zone */}
        <li className="text-white text-center py-2 lg:py-0 cursor-pointer">Game Zone</li>

        {/* Dropdown (Plans) */}
        <li className="relative text-white text-center py-2 lg:py-0 cursor-pointer group">
          <span>Plans</span>
          <ul className="absolute hidden group-hover:block bg-gray-700 text-sm w-48 p-2 mt-1 rounded-md text-left">
            <li
              className="hover:bg-gray-600 px-4 py-2 rounded-md cursor-pointer"
              onClick={() => navigate("/userSubscription")}
            >
              Subscription Plans
            </li>
            <li className="hover:bg-gray-600 px-4 py-2 rounded-md cursor-pointer">Your Plans</li>
          </ul>
        </li>

        {/* Like Icon */}
        <li className="flex justify-center py-2 lg:py-0 cursor-pointer">
          <div className="bg-black p-2 rounded-full">
            <FaHeart className="text-red-500 text-xl" />
          </div>
        </li>

        {/* Profile */}
        <li className="flex items-center text-white py-2 lg:py-0 cursor-pointer" onClick={() => navigate("/profile")}>
          <FaUserCircle className="text-2xl mr-2" />
          <span>{userInfo ? userInfo.name : "Guest"}</span>
        </li>

        {/* Logout */}
        <li className="py-2 lg:py-0">
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md w-full lg:w-auto"
            onClick={logoutHandler}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
