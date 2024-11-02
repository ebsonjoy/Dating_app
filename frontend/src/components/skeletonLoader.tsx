import React from 'react';

const CreativeSkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Floating Shapes Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.1
            }}
          >
            <div className={`w-24 h-24 rotate-${i * 45} bg-purple-400 rounded-xl`} />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 space-y-4">
          <div className="w-24 h-24 relative">
            <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20" />
            {/* Custom Loader Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </div>
          <div className="h-8 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-48 animate-pulse" />
          <div className="h-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-64 animate-pulse" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Card Image Skeleton */}
              <div className="relative h-48 mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-purple-100 to-pink-100">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              {/* Card Content Skeletons */}
              <div className="space-y-4">
                <div className="h-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-3/4 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full w-full animate-pulse" />
                  <div className="h-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full w-5/6 animate-pulse" />
                </div>
                <div className="h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full animate-pulse" />
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-4 right-4 opacity-10">
                <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin" />
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-12 space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-purple-300 animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreativeSkeletonLoader;