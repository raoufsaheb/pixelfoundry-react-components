import React from 'react';
import type { PropDef } from '../../data/componentSpecs';

interface PropsTableProps {
  props: PropDef[];
}

export const PropsTable: React.FC<PropsTableProps> = ({ props }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#22252A] bg-[#0C0D0E]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#22252A] bg-[#141618]">
            <th className="px-4 py-3 text-left text-xs font-mono font-semibold text-[#6B7280] uppercase tracking-widest">Prop</th>
            <th className="px-4 py-3 text-left text-xs font-mono font-semibold text-[#6B7280] uppercase tracking-widest">Type</th>
            <th className="px-4 py-3 text-left text-xs font-mono font-semibold text-[#6B7280] uppercase tracking-widest">Default</th>
            <th className="px-4 py-3 text-left text-xs font-mono font-semibold text-[#6B7280] uppercase tracking-widest">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1C1F23]">
          {props.map((prop) => (
            <tr key={prop.name} className="hover:bg-[#141618]/60 transition-colors">
              <td className="px-4 py-3 font-mono text-[#93C5FD] whitespace-nowrap">
                {prop.name}
                {prop.required && <span className="ml-1 text-rose-400 text-xs">*</span>}
              </td>
              <td className="px-4 py-3 font-mono text-[#86EFAC] text-xs max-w-[200px]">{prop.type}</td>
              <td className="px-4 py-3 font-mono text-[#FDE68A] text-xs">
                {prop.default ?? <span className="text-[#4B5563]">—</span>}
              </td>
              <td className="px-4 py-3 text-[#9CA3AF] leading-relaxed">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
