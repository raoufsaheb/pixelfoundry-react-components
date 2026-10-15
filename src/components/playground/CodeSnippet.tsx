import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeSnippetProps {
  code: string;
  language?: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, language = 'tsx' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl border border-[#22252A] bg-[#0C0D0E] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#22252A] bg-[#141618]">
        <span className="text-xs font-mono text-[#4B5563] uppercase tracking-widest">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono text-[#9CA3AF] hover:text-white hover:bg-[#22252A] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm font-mono text-[#D1D5DB] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};
