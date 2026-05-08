import Image from "next/image";
import React from "react";

const LoadingSpinner = () => {
  return (
    <div>
      <div className="relative flex justify-center items-center min-h-screen">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
        <Image
          src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
          alt="avatar"
          className="rounded-full h-28 w-28"
          width={112}
          height={112}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
