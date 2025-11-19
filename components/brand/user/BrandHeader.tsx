// components/brand/user/BrandHeader.tsx
"use client";

export function BrandHeader() {
  return (
    <div className="p-4 sm:p-6 mb-4 sm:mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Brands
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1.5 sm:mt-2">
          Explore our curated collection of trusted brands
        </p>
      </div>
    </div>
  );
}
