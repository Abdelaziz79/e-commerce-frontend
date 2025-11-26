// components/shared/ImageModal.tsx
"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ImageModalProps {
  selectedImage: string | null;
  onClose: () => void;
}

export function ImageModal({ selectedImage, onClose }: ImageModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (selectedImage) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage, onClose]);

  // Don't render anything on the server or if no image selected
  if (!mounted || !selectedImage) return null;

  // Render the modal into the document.body using a Portal
  return createPortal(
    <div
      className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
          aria-label="Close image viewer"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="relative w-full h-full">
          <Image
            src={selectedImage}
            alt="Review image enlarged"
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 1280px"
            priority
            quality={90}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
