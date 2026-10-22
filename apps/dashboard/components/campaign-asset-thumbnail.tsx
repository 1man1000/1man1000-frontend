"use client";

import Image from "next/image";

interface CampaignAssetThumbnailProps {
  src: string;
  title?: string;
  className?: string;
  onClick?: () => void;
  playIconSize?: "sm" | "lg";
}

/**
 * Renders a campaign asset preview — images via next/image, videos show the
 * first frame with a play overlay. Use `className` to control the footprint
 * (e.g. `aspect-video` for cards, `h-14 w-20` for list rows).
 */
export function CampaignAssetThumbnail({
  src,
  title,
  className,
  onClick,
  playIconSize = "sm",
}: CampaignAssetThumbnailProps) {
  const isVideo = /\.(mp4|webm|ogg)$/i.test(src);
  const isLarge = playIconSize === "lg";

  return (
    <div
      className={`relative overflow-hidden rounded-md bg-muted shrink-0 ${
        onClick ? "cursor-pointer hover:opacity-90 transition-opacity" : ""
      } ${className ?? ""}`}
      onClick={onClick}
    >
      {isVideo ? (
        <div className="relative w-full h-full flex items-center justify-center bg-black/80">
          <video src={src} className="w-full h-full object-cover" muted />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`bg-white/90 rounded-full ${isLarge ? "p-3" : "p-1.5"}`}
            >
              <svg
                className={`text-black ${isLarge ? "w-8 h-8" : "w-4 h-4"}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <Image
          src={src}
          alt={title || "Campaign asset"}
          className="w-full h-full object-cover"
          fill
          sizes="(max-width: 768px) 80px, 96px"
        />
      )}
    </div>
  );
}
