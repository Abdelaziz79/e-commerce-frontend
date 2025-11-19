"use client";

import Image from "next/image"; // CORRECTLY using Next.js Image
import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// --- Constants for better maintainability ---
const ASPECT_RATIO = 1;
const OUTPUT_WIDTH = 512; // The final width of the avatar in pixels
const OUTPUT_HEIGHT = 512; // The final height of the avatar in pixels

interface ImageCropDialogProps {
  imageSrc: string;
  onClose: () => void;
  onSave: (croppedImage: Blob) => void;
}

export function ImageCropDialog({
  imageSrc,
  onClose,
  onSave,
}: ImageCropDialogProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();

  /**
   * FIX #2: This function creates a large, centered crop selection when the image first loads,
   * providing a much better user experience.
   */
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const smallerDimension = Math.min(width, height);

    // Create a crop that's 80% of the smaller dimension and centered.
    const initialCrop = makeAspectCrop(
      {
        unit: "px",
        width: smallerDimension * 0.8,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(initialCrop, width, height);
    setCrop(centeredCrop);
  }

  /**
   * FIX #1: This is the core logic that now correctly crops the image.
   * It accurately translates the on-screen crop coordinates to the original image's
   * full-resolution coordinates.
   */
  const getCroppedImg = async () => {
    const image = imgRef.current;
    if (!image || !crop || !crop.width || !crop.height) {
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return null;
    }

    // Calculate the scaling factors between the displayed image and its natural size.
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas smoothing quality
    ctx.imageSmoothingQuality = "high";

    // The source rectangle (the part to crop from the original image)
    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;
    const sourceWidth = crop.width * scaleX;
    const sourceHeight = crop.height * scaleY;

    // Draw the cropped image onto the canvas, resizing it to our OUTPUT_WIDTH/HEIGHT.
    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0, // Destination X on canvas
      0, // Destination Y on canvas
      OUTPUT_WIDTH, // Destination width on canvas
      OUTPUT_HEIGHT // Destination height on canvas
    );

    // Return a promise that resolves with the high-quality cropped image as a Blob.
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/png", // Use PNG for high quality
        1 // Quality argument (0 to 1)
      );
    });
  };

  const handleSave = async () => {
    const croppedImageBlob = await getCroppedImg();
    if (croppedImageBlob) {
      onSave(croppedImageBlob);
      onClose();
    }
  };

  return (
    <Dialog open={!!imageSrc} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Crop & Resize Avatar</DialogTitle>
          <DialogDescription>
            Adjust the selection to crop your new profile picture.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center py-4">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(pixelCrop) => setCrop(pixelCrop)} // Use pixel values for accuracy
              circularCrop
              keepSelection
              aspect={ASPECT_RATIO}
              minWidth={100} // Set a minimum crop size
            >
              {/* FIX #3: Using the Next.js <Image> component as requested. */}
              <Image
                ref={imgRef}
                alt="Crop preview"
                src={imageSrc}
                width={500} // Base width for layout
                height={500} // Base height for layout
                style={{ maxHeight: "70vh", objectFit: "contain" }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!crop}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
