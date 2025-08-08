"use client";

import { useState, useEffect } from "react";
import { Keyboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["D"], description: "Go to Dashboard" },
      { keys: ["M"], description: "Go to Movies" },
      { keys: ["T"], description: "Go to TV Shows" },
      { keys: ["H"], description: "Go to History" },
      { keys: ["S"], description: "Go to Statistics" },
      { keys: ["C"], description: "Go to Calendar" },
      { keys: ["/"], description: "Focus search" },
    ],
  },
  {
    title: "Media Actions",
    shortcuts: [
      { keys: ["Space"], description: "Mark as watched" },
      { keys: ["W"], description: "Toggle watchlist" },
      { keys: ["1", "2", "3", "4", "5"], description: "Rate (1-5 stars)" },
    ],
  },
  {
    title: "Episode Navigation",
    shortcuts: [
      { keys: ["←"], description: "Previous episode" },
      { keys: ["→"], description: "Next episode" },
      { keys: ["Enter"], description: "Toggle watched" },
    ],
  },
  {
    title: "General",
    shortcuts: [
      { keys: ["?"], description: "Show keyboard shortcuts" },
      { keys: ["Escape"], description: "Close modals/dialogs" },
    ],
  },
];

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShowShortcuts = () => {
      setIsOpen(true);
    };

    document.addEventListener('show-shortcuts-modal', handleShowShortcuts);

    return () => {
      document.removeEventListener('show-shortcuts-modal', handleShowShortcuts);
    };
  }, []);

  const formatKey = (key: string) => {
    const keyMap: Record<string, string> = {
      'Space': '⎵',
      'Enter': '↵',
      'Escape': 'Esc',
      'ArrowLeft': '←',
      'ArrowRight': '→',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      '/': '/',
      '?': '?',
    };

    return keyMap[key] || key.toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Keyboard className="h-5 w-5" />
            <span>Keyboard Shortcuts</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto">
          {shortcutGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-2">
                {group.title}
              </h3>
              
              <div className="space-y-3">
                {group.shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex-1">
                      {shortcut.description}
                    </span>
                    
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center">
                          {keyIndex > 0 && <span className="text-gray-400 mx-1">or</span>}
                          <Badge 
                            variant="outline" 
                            className="font-mono text-xs px-2 py-1 bg-gray-50"
                          >
                            {formatKey(key)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center text-sm text-gray-500 pt-4 border-t">
          <p>
            Shortcuts work when you're not typing in input fields. 
            Press <Badge variant="outline" className="font-mono text-xs">?</Badge> anytime to view this list.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}