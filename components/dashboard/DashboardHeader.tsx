// components/dashboard/DashboardHeader.tsx
"use client";

import { UserProfile } from "@/types/user";
import { useUserAvatar, useUploadAvatar } from "@/hooks/use-user-mutations";
import Image from "next/image";
import { Sparkles, Camera } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { ImageCropDialog } from "@/components/settings/ImageCropDialog";
import { getImageSrc } from "@/lib/utils";

interface DashboardHeaderProps {
  user: UserProfile;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const avatarUrl = useUserAvatar();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageError, setImageError] = useState(false);

  const currentHour = new Date().getHours();

  const fullAvatarUrl = getImageSrc(avatarUrl);

  const hasCustomAvatar =
    fullAvatarUrl && !fullAvatarUrl.includes("default-avatar");

  useEffect(() => {
    setImageError(false);
  }, [fullAvatarUrl]);

  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleAvatarSave = (croppedImage: Blob) => {
    const file = new File([croppedImage], `avatar-${user._id}.png`, {
      type: "image/png",
    });
    uploadAvatar.mutate(file);
    setImageSrc("");
  };

  return (
    <>
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-6">
            {/* AVATAR CONTAINER - Increased size to h-24 w-24 (96px) */}
            <div className="relative group h-24 w-24 shrink-0">
              {/* 1. Main Circle */}
              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white shadow-md bg-white">
                {hasCustomAvatar && !imageError ? (
                  <Image
                    src={fullAvatarUrl}
                    alt={user.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                    priority
                    unoptimized
                    onError={() => setImageError(true)}
                  />
                ) : (
                  // 2. New Clean Fallback: White BG, Dark Text
                  <div className="flex h-full w-full items-center justify-center bg-white text-4xl font-bold text-gray-800 border border-gray-100">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* 3. Upload Overlay */}
              <label
                htmlFor="dashboard-avatar-upload"
                className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              >
                <Camera className="h-8 w-8 text-white/90" />
                <input
                  id="dashboard-avatar-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={uploadAvatar.isPending}
                />
              </label>

              {/* 4. Verification Badge - Adjusted position for larger size */}
              {user.isEmailVerified && (
                <div className="absolute bottom-0 right-0 z-20 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-sm">
                  <svg
                    className="h-3.5 w-3.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* TEXT SECTION */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {getGreeting()}, {user.name.split(" ")[0]}!
                </h1>
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-base text-gray-500">
                Here&apos;s your account overview
              </p>
            </div>
          </div>
        </div>
      </div>

      <ImageCropDialog
        imageSrc={imageSrc}
        onClose={() => setImageSrc("")}
        onSave={handleAvatarSave}
      />
    </>
  );
}
