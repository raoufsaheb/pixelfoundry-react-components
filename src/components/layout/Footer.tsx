import React from 'react';
import { Github, Box } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#22252A] bg-[#0C0D0E] mt-16">
      <div className="px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#3B82F6] flex items-center justify-center">
            <Box className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-mono text-sm font-bold text-white">PixelFoundry</span>
          <span className="text-[#4B5563] font-mono text-xs">— Precision-crafted React components</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex items-center gap-1.5 text-xs font-mono text-[#6B7280] hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <span className="text-xs font-mono text-[#4B5563]">
            Built with React 19 · TypeScript 5.8 · Tailwind v4
          </span>
        </div>
      </div>
    </footer>
  );
};
