const SectionTitle = ({ heading, subHeading }) => {
    return (
      <div className="relative max-w-2xl mx-auto text-center py-12">
        {/* Decorative elements */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
        </div>
        
        <div className="relative">
          {/* Subtitle */}
          <div className="inline-block">
            <span className="text-sm md:text-base text-purple-600 font-medium bg-purple-50 px-4 py-1 rounded-full">
              {subHeading}
            </span>
          </div>
          
          {/* Main heading */}
          <h2 className="mt-4 text-2xl md:text-4xl font-bold text-gray-800">
            {heading}
          </h2>
          
          {/* Decorative underline */}
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="w-8 h-1 bg-purple-600 rounded-full"></span>
            <span className="w-3 h-1 bg-purple-400 rounded-full"></span>
            <span className="w-2 h-1 bg-purple-200 rounded-full"></span>
          </div>
        </div>
      </div>
    );
  };
  
  // Alternative version with different style
  const SectionTitleAlt = ({ heading, subHeading }) => {
    return (
      <div className="relative max-w-2xl mx-auto text-center py-12">
        {/* Background decoration */}
        <div className="absolute -inset-1">
          <div className="w-full h-full max-w-sm mx-auto opacity-30 blur-lg filter bg-gradient-to-r from-purple-400 to-pink-400"></div>
        </div>
        
        <div className="relative bg-white rounded-2xl shadow-xl px-6 py-8">
          {/* Subtitle */}
          <p className="text-purple-600 font-medium mb-3 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-purple-300"></span>
            {subHeading}
            <span className="w-6 h-px bg-purple-300"></span>
          </p>
          
          {/* Main heading */}
          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {heading}
          </h2>
        </div>
      </div>
    );
  };
  
  // Modern minimalist version
  const SectionTitleMinimal = ({ heading, subHeading }) => {
    return (
      <div className="max-w-2xl mx-auto text-center py-4 2xl:py-10 px-4 sm:px-6">
        <div className="space-y-2 sm:space-y-4">
          {/* Main heading first */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
            {heading}
          </h2>
          
          {/* Subtitle with dots below heading */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-purple-400"></span>
            <span className="text-xs sm:text-sm text-purple-600 font-medium uppercase tracking-wider">
              {subHeading}
            </span>
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-purple-400"></span>
          </div>
          
          {/* Simple underline */}
          <div className="w-16 sm:w-20 h-0.5 sm:h-1 mx-auto bg-gradient-to-r from-purple-400 to-[#eee4f3] rounded-full"></div>
        </div>
      </div>
    );
  };
  
  // Export all versions
  export { SectionTitle as default, SectionTitleAlt, SectionTitleMinimal };