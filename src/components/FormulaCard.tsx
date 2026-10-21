/**
 * EQUATION 1 — Minimalist Formula & Physics Law Card
 * Displays the core mathematical equation, concise law description, and parameter definitions.
 * Follows the Obsidian Pure Black minimalist design guidelines.
 */

import React from 'react';
import { MathView } from './MathView';

export interface ParameterDefinition {
  symbol: string;
  name: string;
  unit: string;
  description?: string;
}

interface FormulaCardProps {
  title: string;
  formula: string;
  description: string;
  parameters?: ParameterDefinition[];
  additionalFormula?: string;
  className?: string;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({
  title,
  formula,
  description,
  parameters = [],
  additionalFormula,
  className = '',
}) => {
  return (
    <div
      className={`bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 text-[#F8FAFC] shadow-sm select-none ${className}`}
    >
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-3 border-b border-[#1E293B]">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
          {title}
        </h3>
        <span className="text-[11px] font-mono text-[#64748B]">Governing Mathematical Relation</span>
      </div>

      {/* Main Equations */}
      <div className="py-4 flex flex-col md:flex-row items-center justify-center gap-6 overflow-x-auto text-base sm:text-lg">
        <div className="px-4 py-2 bg-[#050508] border border-[#1E293B] rounded-lg">
          <MathView math={formula} displayMode={true} />
        </div>
        {additionalFormula && (
          <div className="px-4 py-2 bg-[#050508] border border-[#1E293B] rounded-lg">
            <MathView math={additionalFormula} displayMode={true} />
          </div>
        )}
      </div>

      {/* Concise Description */}
      <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed text-center sm:text-left pt-1">
        {description}
      </p>

      {/* Parameter Definitions */}
      {parameters.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#1E293B]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] mb-2 font-semibold">
            Parameters &amp; SI Units
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
            {parameters.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-[#050508] border border-[#1E293B]/70"
              >
                <span className="text-[#38BDF8] font-bold">
                  <MathView math={p.symbol} />
                </span>
                <span className="text-[#F8FAFC] truncate">{p.name}</span>
                <span className="text-[#64748B] text-[10px] ml-auto">[{p.unit}]</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
