import React, { useRef, useEffect, useState } from 'react';
import type { SegmentedControlProps } from './SegmentedControl.types';

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  className = '',
  name,
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  } as const;

  const paddingClasses = {
    sm: 'px-3',
    md: 'px-4',
    lg: 'px-5',
  } as const;

  useEffect(() => {
    if (!containerRef.current) return;
    const idx = options.findIndex((o) => o.value === value);
    if (idx === -1) return;
    const buttons = containerRef.current.querySelectorAll<HTMLButtonElement>('[data-seg-btn]');
    const btn = buttons[idx];
    if (!btn) return;
    setPillStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [value, options]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIdx: number) => {
    const enabledIndices = options
      .map((o, i) => (o.disabled ? null : i))
      .filter((i): i is number => i !== null);
    const pos = enabledIndices.indexOf(currentIdx);
    if (pos === -1) return;

    let nextPos: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextPos = enabledIndices[(pos + 1) % enabledIndices.length];
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextPos = enabledIndices[(pos - 1 + enabledIndices.length) % enabledIndices.length];
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextPos = enabledIndices[0];
    } else if (e.key === 'End') {
      e.preventDefault();
      nextPos = enabledIndices[enabledIndices.length - 1];
    }

    if (nextPos !== null) {
      onChange(options[nextPos].value);
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('[data-seg-btn]');
      buttons?.[nextPos]?.focus();
    }
  };

  return (
    <div
      role="group"
      aria-label={name ?? 'Segmented control'}
      className={`relative inline-flex items-center rounded-xl bg-[#1C1F23] p-1 border border-[#2A2D33] ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {/* Animated pill */}
      <div
        ref={containerRef}
        className="relative flex w-full items-center"
        aria-hidden
      />
      <div
        className="absolute top-1 bottom-1 rounded-lg bg-[#3B82F6] transition-all duration-200 ease-out pointer-events-none"
        style={{ left: pillStyle.left + 4, width: pillStyle.width }}
        aria-hidden="true"
      />

      {/* Buttons */}
      <div ref={containerRef} className={`relative flex w-full items-center ${sizeClasses[size]}`}>
        {options.map((option, idx) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              data-seg-btn
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={option.disabled}
              onClick={() => !option.disabled && onChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-lg font-mono font-medium tracking-tight transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1F23] ${paddingClasses[size]} ${
                isSelected
                  ? 'text-white'
                  : option.disabled
                    ? 'text-[#4B5563] cursor-not-allowed'
                    : 'text-[#9CA3AF] hover:text-[#D1D5DB] cursor-pointer'
              }`}
            >
              {option.icon && <span className="w-4 h-4">{option.icon}</span>}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
