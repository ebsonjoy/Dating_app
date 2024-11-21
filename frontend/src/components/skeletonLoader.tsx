
const HeartLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      <div className="relative">
        {/* Pulsing Background Heart */}
        <div className="absolute inset-0 bg-rose-300 rounded-full opacity-20 animate-ping" 
             style={{ 
               width: '200px', 
               height: '200px',
               animationDuration: '2s',
               animationIterationCount: 'infinite'
             }} 
        />
        
        {/* Main Heart SVG */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="relative w-48 h-48 text-rose-500 animate-pulse"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </div>
  );
};

export default HeartLoader;