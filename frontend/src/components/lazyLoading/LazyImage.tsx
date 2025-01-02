// import React, { useState, useEffect, useRef } from "react";

// interface LazyImageProps {
//   src: string;
//   alt: string;
//   className?: string;
// }

// const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className }) => {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [isInView, setIsInView] = useState(false);
//   const imgRef = useRef<HTMLImageElement | null>(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsInView(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.1 }
//     );

//     if (imgRef.current) observer.observe(imgRef.current);

//     return () => {
//       if (imgRef.current) observer.unobserve(imgRef.current);
//     };
//   }, []);

//   const handleImageLoad = () => {
//     setIsLoaded(true);
//   };

//   return (
//     <div className="relative overflow-hidden">
//       {/* Shimmer loading effect */}
//       {!isLoaded && (
//         <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" 
//              style={{ 
//                backgroundSize: '200% 100%',
//                animation: 'shimmer 1.5s infinite linear'
//              }}
//         />
//       )}
      
//       {/* Actual image */}
//       <img
//         ref={imgRef}
//         src={isInView ? src : undefined}
//         alt={alt}
//         className={`
//           ${className}
//           transition-opacity duration-500 ease-in-out
//           ${isLoaded ? 'opacity-100' : 'opacity-0'}
//         `}
//         loading="lazy"
//         onLoad={handleImageLoad}
//       />
//     </div>
//   );
// };

// // Add these styles to your global CSS or Tailwind config
// const styles = `
//   @keyframes shimmer {
//     0% {
//       background-position: 200% 0;
//     }
//     100% {
//       background-position: -200% 0;
//     }
//   }
// `;

// export default LazyImage;