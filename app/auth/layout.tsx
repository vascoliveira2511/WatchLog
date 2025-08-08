"use client";

import { CinematicBackground } from "@/components/ui/cinematic-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CinematicBackground variant="auth" className="min-h-screen">
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </CinematicBackground>
  );
}