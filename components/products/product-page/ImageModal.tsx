// src/components/products/product-page/ImageModal.tsx
import Image from "next/image";
import { X } from "lucide-react";

interface ImageModalProps {
  selectedImage: string | null;
  onClose: () => void;
}

export function ImageModal({ selectedImage, onClose }: ImageModalProps) {
  if (!selectedImage) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-[90vh] w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Close image viewer"
        >
          <X className="w-7 h-7" />
        </button>
        <div className="relative w-full h-full">
          <Image
            src={selectedImage}
            alt="Review image enlarged"
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
      </div>
    </div>
  );
}
