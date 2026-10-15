import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { AccordionProps } from './Accordion.types';

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpandedIds = [],
  onChange,
  className = '',
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpandedIds);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    buttonRefs.current = buttonRefs.current.slice(0, items.length);
  }, [items]);

  const toggleItem = (id: string, disabled?: boolean) => {
    if (disabled) return;

    let nextIds: string[];
    if (allowMultiple) {
      nextIds = expandedIds.includes(id)
        ? expandedIds.filter((item) => item !== id)
        : [...expandedIds, id];
    } else {
      nextIds = expandedIds.includes(id) ? [] : [id];
    }

    setExpandedIds(nextIds);
    if (onChange) onChange(nextIds);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabledIndices = items
      .map((item, idx) => (item.disabled ? null : idx))
      .filter((idx): idx is number => idx !== null);

    const currentPos = enabledIndices.indexOf(index);
    if (currentPos === -1) return;

    let targetIndex: number | null = null;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        targetIndex = enabledIndices[(currentPos + 1) % enabledIndices.length];
        break;
      case 'ArrowUp':
        e.preventDefault();
        targetIndex = enabledIndices[(currentPos - 1 + enabledIndices.length) % enabledIndices.length];
        break;
      case 'Home':
        e.preventDefault();
        targetIndex = enabledIndices[0];
        break;
      case 'End':
        e.preventDefault();
        targetIndex = enabledIndices[enabledIndices.length - 1];
        break;
    }

    if (targetIndex !== null && buttonRefs.current[targetIndex]) {
      buttonRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <div className={`divide-y divide-[#22252A] border border-[#22252A] rounded-xl bg-[#141618] overflow-hidden ${className}`}>
      {items.map((item, index) => {
        const isExpanded = expandedIds.includes(item.id);
        const headerId = `accordion-header-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div key={item.id} className="group">
            <h3>
              <button
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                id={headerId}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggleItem(item.id, item.disabled)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-inset ${
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed bg-transparent'
                    : 'hover:bg-[#1C1F23]/60 cursor-pointer'
                }`}
              >
                <div className="flex-1 pr-4">
                  <div className="font-sans font-semibold text-sm text-[#F3F4F6] tracking-tight">
                    {item.title}
                  </div>
                  {item.subtitle && (
                    <div className="text-xs text-[#9CA3AF] mt-0.5">{item.subtitle}</div>
                  )}
                </div>
                <div
                  className={`p-1 rounded-lg text-[#9CA3AF] transition-transform duration-200 ${
                    isExpanded ? 'rotate-180 text-[#3B82F6]' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isExpanded}
              className={`px-5 pb-5 pt-1 text-sm text-[#9CA3AF] leading-relaxed transition-all ${
                isExpanded ? 'block animate-in fade-in-50 duration-150' : 'hidden'
              }`}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};
