import React, { useState, useRef, useId } from 'react';
import { X } from 'lucide-react';
import type { TagInputProps } from './TagInput.types';

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Add tag…',
  maxTags,
  allowDuplicates = false,
  disabled = false,
  className = '',
  label,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (!allowDuplicates && tags.includes(tag)) return;
    if (maxTags !== undefined && tags.length >= maxTags) return;
    onChange([...tags, tag]);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const isAtMax = maxTags !== undefined && tags.length >= maxTags;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-xs font-mono font-medium text-[#9CA3AF] uppercase tracking-widest mb-2">
          {label}
        </label>
      )}
      <div
        role="group"
        aria-label={label ?? 'Tag input'}
        onClick={() => inputRef.current?.focus()}
        className={`flex flex-wrap gap-2 min-h-[44px] px-3 py-2 rounded-xl border transition-colors ${
          disabled
            ? 'bg-[#141618] border-[#22252A] cursor-not-allowed opacity-50'
            : 'bg-[#141618] border-[#2A2D33] hover:border-[#3B82F6]/50 focus-within:border-[#3B82F6] cursor-text'
        }`}
      >
        {tags.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-xs font-mono text-[#93C5FD] whitespace-nowrap"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                aria-label={`Remove tag ${tag}`}
                onClick={(e) => { e.stopPropagation(); removeTag(idx); }}
                className="ml-0.5 rounded text-[#93C5FD]/60 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
        {!isAtMax && !disabled && (
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => addTag(inputValue)}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent text-sm font-mono text-[#F3F4F6] placeholder:text-[#4B5563] focus:outline-none"
          />
        )}
        {isAtMax && (
          <span className="text-xs font-mono text-[#6B7280] self-center">Max tags reached</span>
        )}
      </div>
      <p className="mt-1 text-xs text-[#6B7280] font-mono">
        Press <kbd className="px-1 bg-[#22252A] rounded text-[#9CA3AF]">Enter</kbd> or <kbd className="px-1 bg-[#22252A] rounded text-[#9CA3AF]">,</kbd> to add · <kbd className="px-1 bg-[#22252A] rounded text-[#9CA3AF]">Backspace</kbd> to remove
      </p>
    </div>
  );
};
