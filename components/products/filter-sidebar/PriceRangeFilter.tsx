"use client";

import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface PriceRangeFilterProps {
  priceRange: number[];
  handlePriceChange: (values: number[]) => void;
}

export function PriceRangeFilter({
  priceRange,
  handlePriceChange,
}: PriceRangeFilterProps) {
  const [minInput, setMinInput] = useState(priceRange[0].toString());
  const [maxInput, setMaxInput] = useState(priceRange[1].toString());

  useEffect(() => {
    setMinInput(priceRange[0].toString());
    setMaxInput(priceRange[1].toString());
  }, [priceRange]);

  const handleMinChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned === "") {
      setMinInput("");
      return;
    }

    let numValue = parseInt(cleaned, 10);

    if (numValue > 10000) {
      numValue = 10000;
    }

    if (numValue >= priceRange[1]) {
      numValue = priceRange[1] - 1;
    }

    if (numValue < 0) {
      numValue = 0;
    }

    setMinInput(numValue.toString());
    handlePriceChange([numValue, priceRange[1]]);
  };

  const handleMaxChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned === "") {
      setMaxInput("");
      return;
    }

    let numValue = parseInt(cleaned, 10);

    if (numValue > 10000) {
      numValue = 10000;
    }

    if (numValue <= priceRange[0]) {
      numValue = priceRange[0] + 1;
    }

    if (numValue < 0) {
      numValue = 0;
    }

    setMaxInput(numValue.toString());
    handlePriceChange([priceRange[0], numValue]);
  };

  const handleMinBlur = () => {
    if (minInput === "") {
      setMinInput(priceRange[0].toString());
    }
  };

  const handleMaxBlur = () => {
    if (maxInput === "") {
      setMaxInput(priceRange[1].toString());
    }
  };

  return (
    <div className="space-y-4">
      <div className="px-2 py-4">
        <Slider
          value={priceRange}
          onValueChange={handlePriceChange}
          max={10000}
          step={10}
          className="w-full"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-600 mb-2 block uppercase tracking-wider">
            Min
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-900">
              $
            </span>
            <input
              type="text"
              value={minInput}
              onChange={(e) => handleMinChange(e.target.value)}
              onBlur={handleMinBlur}
              className="w-full pl-7 pr-4 py-3 bg-gray-50 border border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-600 mb-2 block uppercase tracking-wider">
            Max
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-900">
              $
            </span>
            <input
              type="text"
              value={maxInput}
              onChange={(e) => handleMaxChange(e.target.value)}
              onBlur={handleMaxBlur}
              className="w-full pl-7 pr-4 py-3 bg-gray-50 border border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
