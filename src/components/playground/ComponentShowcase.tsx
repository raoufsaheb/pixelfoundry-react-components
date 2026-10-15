import React, { useState } from 'react';
import { CodeSnippet } from './CodeSnippet';
import { PropsTable } from './PropsTable';
import type { ComponentSpec } from '../../data/componentSpecs';

interface ComponentShowcaseProps {
  spec: ComponentSpec;
  preview: React.ReactNode;
}

type Tab = 'preview' | 'code' | 'props';

export const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ spec, preview }) => {
  const [activeTab, setActiveTab] = useState<Tab>('preview');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'preview', label: 'Preview' },
    { id: 'code', label: 'Code' },
    { id: 'props', label: 'Props' },
  ];

  return (
    <section
      id={spec.id}
      aria-label={`${spec.title} component showcase`}
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-2 py-0.5 rounded-full">
              {spec.category}
            </span>
          </div>
          <h2 className="text-xl font-mono font-bold text-white tracking-tight">{spec.title}</h2>
          <p className="text-sm text-[#9CA3AF] mt-1 leading-relaxed max-w-prose">{spec.description}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-[#22252A]" role="tablist" aria-label={`${spec.title} tabs`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${spec.id}-tabpanel`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
            className={`px-4 py-2.5 text-sm font-mono font-medium border-b-2 -mb-px transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] ${
              activeTab === tab.id
                ? 'border-[#3B82F6] text-[#3B82F6]'
                : 'border-transparent text-[#6B7280] hover:text-[#D1D5DB]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panel */}
      <div id={`${spec.id}-tabpanel`} role="tabpanel" aria-label={activeTab}>
        {activeTab === 'preview' && (
          <div className="rounded-xl border border-[#22252A] bg-[#141618] p-8 flex items-center justify-center min-h-[200px]">
            {preview}
          </div>
        )}
        {activeTab === 'code' && <CodeSnippet code={spec.codeSnippet} />}
        {activeTab === 'props' && <PropsTable props={spec.props} />}
      </div>
    </section>
  );
};
