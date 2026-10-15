import React from 'react';
import { Command, Box } from 'lucide-react';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  mobileMenuButton: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette, mobileMenuButton }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-16 bg-[#0C0D0E]/90 backdrop-blur-md border-b border-[#22252A] flex items-center px-4 lg:pl-68 gap-4">
      {mobileMenuButton}

      {/* Mobile logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-6 h-6 rounded-md bg-[#3B82F6] flex items-center justify-center">
          <Box className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-mono font-bold text-white text-sm">PixelFoundry</span>
      </div>

      <div className="flex-1" />

      {/* Command palette trigger */}
      <button
        type="button"
        onClick={onOpenCommandPalette}
        aria-label="Open command palette"
        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-[#2A2D33] bg-[#141618] text-sm font-mono text-[#6B7280] hover:border-[#3B82F6]/50 hover:text-[#9CA3AF] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3B82F6] min-w-[200px]"
      >
        <Command className="w-4 h-4" />
        <span className="flex-1 text-left">Search components…</span>
        <kbd className="px-1.5 py-0.5 rounded bg-[#1C1F23] border border-[#2A2D33] text-xs text-[#4B5563]">⌘K</kbd>
      </button>

      {/* Mobile command palette trigger */}
      <button
        type="button"
        onClick={onOpenCommandPalette}
        aria-label="Search"
        className="sm:hidden p-2 rounded-xl border border-[#2A2D33] text-[#6B7280] hover:text-white hover:border-[#3B82F6]/50 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
      >
        <Command className="w-5 h-5" />
      </button>

      {/* Badge */}
      <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20">
        <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
        <span className="text-xs font-mono text-[#93C5FD]">7 Components</span>
      </div>
    </header>
  );
};
