import React from 'react';
import { Box, Menu, X } from 'lucide-react';
import type { ComponentSpec } from '../../data/componentSpecs';

interface SidebarProps {
  specs: ComponentSpec[];
  activeId: string;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ specs, activeId, onSelect, isOpen, onClose }) => {
  const categories = Array.from(new Set(specs.map((s) => s.category)));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        aria-label="Component navigation"
        className={`fixed top-0 left-0 h-full w-64 bg-[#0C0D0E] border-r border-[#22252A] z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#22252A] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#3B82F6] flex items-center justify-center">
              <Box className="w-4 h-4 text-white" />
            </div>
            <span className="font-mono font-bold text-white tracking-tight text-sm">PixelFoundry</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="lg:hidden p-1 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#1C1F23] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Component list">
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <p className="px-3 mb-1.5 text-xs font-mono font-semibold text-[#4B5563] uppercase tracking-widest">
                {cat}
              </p>
              <ul role="list" className="space-y-0.5">
                {specs
                  .filter((s) => s.category === cat)
                  .map((spec) => (
                    <li key={spec.id}>
                      <button
                        type="button"
                        onClick={() => { onSelect(spec.id); onClose(); }}
                        aria-current={activeId === spec.id ? 'page' : undefined}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-mono transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3B82F6] ${
                          activeId === spec.id
                            ? 'bg-[#3B82F6]/15 text-[#93C5FD] border border-[#3B82F6]/30'
                            : 'text-[#9CA3AF] hover:text-white hover:bg-[#1C1F23]'
                        }`}
                      >
                        {spec.title}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#22252A] flex-shrink-0">
          <p className="text-xs font-mono text-[#4B5563]">v1.0.0 · React 19 · TS 5.8</p>
        </div>
      </aside>
    </>
  );
};

interface MobileMenuButtonProps {
  onClick: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Open navigation menu"
    className="lg:hidden p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1C1F23] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
  >
    <Menu className="w-5 h-5" />
  </button>
);
