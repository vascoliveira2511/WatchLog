"use client";

import { useEffect } from "react";
import { useGlobalShortcuts } from "@/hooks/use-keyboard-shortcuts";

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  // Initialize global keyboard shortcuts
  useGlobalShortcuts(true);

  return <>{children}</>;
}