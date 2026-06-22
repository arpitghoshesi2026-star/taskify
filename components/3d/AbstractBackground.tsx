"use client";

import Spline from '@splinetool/react-spline';
import { useState } from 'react';

export function AbstractBackground() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="absolute inset-0 z-0 bg-[#C0C0C0] flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="w-12 h-12 border-4 border-gray-400 border-t-white rounded-full animate-spin shadow-lg"></div>
          <p className="mt-4 text-white font-medium drop-shadow-md">Loading 3D Robot...</p>
        </div>
      )}
      <Spline 
        scene="https://prod.spline.design/vSuxUlfCHUVQz7R0/scene.splinecode" 
        onLoad={() => setIsLoading(false)}
      />
      <div className="absolute inset-0 bg-background/20 pointer-events-none" />
    </div>
  );
}
