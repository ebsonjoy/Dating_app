import  React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHeart, FaUserCircle, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation,useGetReceivedLikesCountQuery } from '../../slices/apiUserSlice';
import { logout } from '../../slices/authSlice';
import { RootState } from '../../store';
import NotificationsDropdown from '../../pages/userPages/notification';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  active: boolean;
}

interface DropdownItemProps {
  to: string;
  children: React.ReactNode;
}
interface MobileNavLinkProps {
  to: string;
  children: React.ReactNode;
  active: boolean;
}


const Navbar = () => {
  const [logoutApiCall] = useLogoutMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const { data: likesCount } = useGetReceivedLikesCountQuery(userId as string);
console.log('count',likesCount?.count)
  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setPlansOpen(false);
  }, [location]);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/landing');
    } catch (error) {
      console.log(error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-br from-rose-500 to-purple-600 shadow-xl">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Main Navigation Bar */}
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <div 
              onClick={() => navigate("/")}
              className="flex items-center cursor-pointer group"
            >
              <span className="text-2xl font-black text-white tracking-wider group-hover:scale-105 transition-transform duration-200">
              CupidsCourt
              </span>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-2">
              <NavLink to="/" active={isActive('/')}>
                Home
              </NavLink>

              <NavLink to="/message" active={isActive('/message')}>
                Message
              </NavLink>

              <NavLink to="/dating-advice" active={isActive('/dating-advice')}>
                Dating Advice
              </NavLink>

              <NavLink to="/game-zone" active={isActive('/game-zone')}>
                Game Zone
              </NavLink>

              {/* Plans Dropdown */}
              <div className="relative group">
                <button
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive('/userSubscription') || isActive('/userPlanDetails') 
                      ? 'bg-white text-rose-500' 
                      : 'text-white hover:bg-white/10'}`}
                  onClick={() => setPlansOpen(!plansOpen)}
                >
                  Plans
                  <FaChevronDown className="ml-1 text-xs group-hover:rotate-180 transition-transform duration-200" />
                </button>

                <div className={`absolute right-0 w-48 py-2 mt-1 bg-white rounded-lg shadow-xl ${plansOpen ? 'block' : 'hidden'}`} style={{ zIndex: 50 }}>
                  <DropdownItem to="/userSubscription">
                    Subscription Plans
                  </DropdownItem>
                  <DropdownItem to="/userPlanDetails">
                    Your Plans
                  </DropdownItem>
                </div>
              </div>

              {/* Like Button */}
              <button onClick={() => navigate("/userLikes")} className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                <FaHeart className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {likesCount && likesCount?.count>0 ? likesCount?.count : 0}
                </span>
              </button>

              {/* Profile and Logout */}
              <div className="flex items-center gap-2 ml-2">
                 <NotificationsDropdown />
                <button
                  onClick={() => navigate("/profile")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive('/profile') ? 'bg-white text-rose-500' : 'text-white hover:bg-white/10'}`}
                >
                  <FaUserCircle className="text-xl" />
                  <span>{userInfo ? userInfo.name : "Guest"}</span>
                </button>

                <button
                  onClick={logoutHandler}
                  className="px-4 py-2 text-sm font-medium bg-white text-rose-500 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`lg:hidden transition-all duration-300 ease-in-out ${
              menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              <MobileNavLink to="/" active={isActive('/')}>
                Home
              </MobileNavLink>
              
              <MobileNavLink to="/message" active={isActive('/message')}>
                Message
              </MobileNavLink>
              
              <MobileNavLink to="/dating-advice" active={isActive('/dating-advice')}>
                Dating Advice
              </MobileNavLink>
              
              <MobileNavLink to="/game-zone" active={isActive('/game-zone')}>
                Game Zone
              </MobileNavLink>
              
              <MobileNavLink to="/userSubscription" active={isActive('/userSubscription')}>
                Subscription Plans
              </MobileNavLink>
              
              <MobileNavLink to="/userPlanDetails" active={isActive('/userPlanDetails')}>
                Your Plans
              </MobileNavLink>
              
              <MobileNavLink to="/profile" active={isActive('/profile')}>
                <div className="flex items-center">
                  <FaUserCircle className="mr-2" />
                  {userInfo ? userInfo.name : "Guest"}
                </div>
              </MobileNavLink>

              <button
                onClick={logoutHandler}
                className="w-full mt-2 px-4 py-2 text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Utility Components
const NavLink: React.FC<NavLinkProps> = ({ to, children, active }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
      ${active ? 'bg-white text-rose-500' : 'text-white hover:bg-white/10'}`}
  >
    {children}
  </Link>
);

const DropdownItem: React.FC<DropdownItemProps>  = ({ to, children }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-500 transition-colors"
  >
    {children}
  </Link>
);

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, children, active }) => (
  <Link
    to={to}
    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors
      ${active ? 'bg-rose-50 text-rose-500' : 'text-gray-700 hover:bg-rose-50 hover:text-rose-500'}`}
  >
    {children}
  </Link>
);

export default Navbar;
