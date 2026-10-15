import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, CornerDownLeft } from 'lucide-react';
import type { CommandPaletteProps, CommandItem } from './CommandPalette.types';

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  placeholder = 'Type a command or search...',
  emptyMessage = 'No matching commands found.',
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase();
    return items.filter((item) => {
      const matchLabel = item.label.toLowerCase().includes(lower);
      const matchCategory = item.category.toLowerCase().includes(lower);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(lower));
      return matchLabel || matchCategory || matchKeywords;
    });
  }, [items, query]);

  // Group filtered items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of filteredItems) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [filteredItems]);

  // Reset selectedIndex when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (filteredItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        selected.onSelect();
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  let flatIndex = 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#141618] border border-[#22252A] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#22252A] gap-3">
          <Search className="w-5 h-5 text-[#9CA3AF] shrink-0" />
          <input
            ref={inputRef}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls="command-palette-listbox"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-[#F3F4F6] placeholder:text-[#5E656E] focus:outline-none font-sans"
          />
          <kbd className="px-2 py-0.5 rounded bg-[#1C1F23] border border-[#22252A] font-mono text-[10px] text-[#9CA3AF] select-none">
            ESC
          </kbd>
        </div>

        {/* Listbox */}
        <div
          ref={listboxRef}
          id="command-palette-listbox"
          role="listbox"
          aria-label="Commands"
          className="max-h-80 overflow-y-auto p-2 divide-y divide-[#22252A]/40"
        >
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#9CA3AF]">{emptyMessage}</div>
          ) : (
            Object.entries(groupedItems).map(([category, catItems]) => (
              <div key={category} className="py-1.5 first:pt-0 last:pb-0">
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#5E656E] font-semibold">
                  {category}
                </div>

                {catItems.map((item) => {
                  const currentIndex = flatIndex++;
                  const isSelected = selectedIndex === currentIndex;

                  return (
                    <div
                      key={item.id}
                      id={`command-option-${item.id}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        item.onSelect();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#1C1F23] text-[#F3F4F6] border border-[#3B82F6]/40'
                          : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1C1F23]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.icon && (
                          <div className={`p-1 rounded-md ${isSelected ? 'text-[#3B82F6]' : 'text-[#9CA3AF]'}`}>
                            {item.icon}
                          </div>
                        )}
                        <span className="font-medium truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.shortcut && (
                          <div className="flex gap-1 font-mono text-[10px] text-[#9CA3AF]">
                            {item.shortcut.map((key) => (
                              <kbd key={key} className="px-1.5 py-0.5 rounded bg-[#0C0D0E] border border-[#22252A]">
                                {key}
                              </kbd>
                            ))}
                          </div>
                        )}
                        {isSelected && (
                          <CornerDownLeft className="w-3.5 h-3.5 text-[#3B82F6]" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 border-t border-[#22252A] bg-[#0C0D0E]/60 flex items-center justify-between text-[11px] text-[#5E656E]">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono">↑↓</kbd> to navigate</span>
            <span><kbd className="font-mono">↵</kbd> to select</span>
          </div>
          <span>PixelFoundry Command Engine</span>
        </div>
      </div>
    </div>
  );
};
