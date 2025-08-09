"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TMDBImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onLoadingComplete?: () => void;
  fallback?: React.ReactNode;
}

export function TMDBImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  sizes,
  priority = false,
  onLoadingComplete,
  fallback,
}: TMDBImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If no src or error occurred, show fallback
  if (!src || hasError) {
    return (
      <div className={cn("bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center", className)}>
        {fallback || (
          <div className="text-gray-500 text-center p-4">
            <div className="text-xs opacity-50">No image available</div>
          </div>
        )}
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    className: cn(className, isLoading ? "opacity-0" : "opacity-100", "transition-opacity duration-300"),
    sizes,
    priority,
    onLoadingComplete: () => {
      setIsLoading(false);
      onLoadingComplete?.();
    },
    onError: () => {
      setHasError(true);
      setIsLoading(false);
    },
    ...(fill ? { fill: true } : { width, height }),
  };

  return (
    <>
      {isLoading && (
        <div className={cn("absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse", className)} />
      )}
      <Image {...imageProps} />
    </>
  );
}