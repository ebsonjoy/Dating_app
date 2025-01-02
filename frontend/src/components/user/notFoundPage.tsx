import  { useEffect, useState } from 'react';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';
import {useNavigate } from 'react-router-dom';
const NotFound = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoaded(true);
    
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    // Handle mouse movement only on desktop
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        setMousePosition({
          x: (e.clientX - window.innerWidth / 2) * 0.05,
          y: (e.clientY - window.innerHeight / 2) * 0.05
        });
      }
    };

    // Handle resize
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      {/* Animated background shapes - responsive sizes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 md:-top-40 md:-right-40 w-40 h-40 md:w-80 md:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-20 -left-20 md:-bottom-40 md:-left-40 w-40 h-40 md:w-80 md:h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-20 left-20 md:top-40 md:left-40 w-40 h-40 md:w-80 md:h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Content container with responsive padding */}
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 text-white">
        {/* Glitch effect text with responsive sizing */}
        <div 
          className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-4 md:mb-8 transition-transform duration-500"
          style={{
            transform: isMobile ? 'none' : `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            opacity: isLoaded ? 1 : 0,
          }}
        >
          <span className="absolute top-0 left-0 -ml-1 animate-glitch-1 text-violet-500">404</span>
          <span className="absolute top-0 left-0 -ml-2 animate-glitch-2 text-blue-500">404</span>
          <span>404</span>
        </div>

        {/* Main content with responsive text sizing */}
        <div className={`text-center space-y-4 md:space-y-8 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="space-y-2 md:space-y-4 px-4 md:px-0">
            <h2 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
              Reality Not Found
            </h2>
            <p className="text-base md:text-lg text-gray-300 max-w-xs md:max-w-md mx-auto">
              The page you're looking for has slipped into another dimension.
              Don't worry, it happens to the best of us.
            </p>
          </div>

          {/* Interactive buttons with mobile-optimized layout */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4 md:px-0">
            <button 
              onClick={() => window.history.back()}
              className="group relative px-4 md:px-6 py-2.5 md:py-3 text-sm font-medium rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 w-full sm:w-auto"
            >
              <span className="relative flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Time Travel Back
              </span>
            </button>
            
            <button 
              onClick={() => navigate("/")}
              className="group relative px-4 md:px-6 py-2.5 md:py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all duration-300 w-full sm:w-auto"
            >
              <span className="relative flex items-center justify-center gap-2">
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Return Home
              </span>
            </button>
          </div>
        </div>

        {/* Floating elements with responsive positioning */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-float-slow hidden md:block">
            <RefreshCw className="w-6 h-6 md:w-8 md:h-8 text-violet-400 opacity-50" />
          </div>
          <div className="absolute bottom-1/4 right-1/4 animate-float hidden md:block">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-400 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;


