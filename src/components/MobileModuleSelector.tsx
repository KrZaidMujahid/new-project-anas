/**
 * EQUATION 1 — Mobile Module Selector
 * Sits directly between Header and Simulation on Mobile/Tablet viewports (< 1024px).
 * Satisfies the mobile hierarchy contract:
 * HEADER -> MODULE SELECTOR -> SIMULATION -> CONTROLS -> RESULTS / INFORMATION
 */

import React, { useState } from 'react';
import { LaboratoryModule } from './Sidebar';
import {
  Compass,
  Eye,
  Zap,
  Waves,
  Flame,
  Binary,
  Layers,
  ChevronDown,
  LayoutGrid,
} from 'lucide-react';

interface MobileModuleSelectorProps {
  activeModule: LaboratoryModule;
  onSelectModule: (module: LaboratoryModule) => void;
  onOpenCatalog: () => void;
}

interface ModuleOption {
  id: LaboratoryModule;
  label: string;
  category: 'mechanics' | 'optics' | 'em' | 'waves' | 'thermo' | 'modern';
  categoryLabel: string;
}

const ALL_MODULES: ModuleOption[] = [
  // Optics
  { id: 'doubleslit', label: 'Double-Slit Interference', category: 'optics', categoryLabel: 'Optics' },
  { id: 'snell', label: "Snell's Law & Refraction", category: 'optics', categoryLabel: 'Optics' },
  // EM
  { id: 'circuits', label: 'RLC AC Circuits', category: 'em', categoryLabel: 'Electromagnetism' },
  { id: 'lorentz', label: 'Lorentz Magnetic Force', category: 'em', categoryLabel: 'Electromagnetism' },
  // Waves
  { id: 'doppler', label: 'Doppler Effect', category: 'waves', categoryLabel: 'Waves' },
  { id: 'resonance', label: 'Resonance Laboratory', category: 'waves', categoryLabel: 'Waves' },
  { id: 'waves', label: 'Wave Superposition', category: 'waves', categoryLabel: 'Waves' },
  { id: 'shm', label: 'Simple Harmonic Motion', category: 'waves', categoryLabel: 'Waves' },
  // Mechanics
  { id: 'collision', label: 'Collisions & Momentum', category: 'mechanics', categoryLabel: 'Mechanics' },
  { id: 'circular', label: 'Circular Motion', category: 'mechanics', categoryLabel: 'Mechanics' },
  { id: 'projectile', label: 'Projectile Motion', category: 'mechanics', categoryLabel: 'Mechanics' },
  { id: 'freefall', label: 'Free Fall Kinematics', category: 'mechanics', categoryLabel: 'Mechanics' },
  { id: 'newton', label: "Newton's Three Laws", category: 'mechanics', categoryLabel: 'Mechanics' },
  { id: 'incline', label: 'Inclined Plane & Friction', category: 'mechanics', categoryLabel: 'Mechanics' },
  // Thermodynamics
  { id: 'kinetic', label: 'Kinetic Gas Theory', category: 'thermo', categoryLabel: 'Thermodynamics' },
  { id: 'carnot', label: 'Carnot Heat Engine', category: 'thermo', categoryLabel: 'Thermodynamics' },
  // Modern Physics
  { id: 'bohr', label: 'Bohr Hydrogen Model', category: 'modern', categoryLabel: 'Modern' },
  { id: 'photoelectric', label: 'Photoelectric Effect', category: 'modern', categoryLabel: 'Modern' },
];

export const MobileModuleSelector: React.FC<MobileModuleSelectorProps> = ({
  activeModule,
  onSelectModule,
  onOpenCatalog,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentMod = ALL_MODULES.find((m) => m.id === activeModule) || ALL_MODULES[0];

  const filteredModules = selectedCategory === 'all'
    ? ALL_MODULES
    : ALL_MODULES.filter((m) => m.category === selectedCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'optics': return <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />;
      case 'em': return <Zap className="w-3.5 h-3.5 text-[#FBBF24]" />;
      case 'waves': return <Waves className="w-3.5 h-3.5 text-[#38BDF8]" />;
      case 'mechanics': return <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />;
      case 'thermo': return <Flame className="w-3.5 h-3.5 text-[#FB923C]" />;
      case 'modern': return <Binary className="w-3.5 h-3.5 text-[#818CF8]" />;
      default: return <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />;
    }
  };

  return (
    <div className="lg:hidden mb-4 space-y-2 select-none">
      {/* Active Lab Card + Dropdown Trigger */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-2.5 shadow-md flex items-center justify-between gap-2">
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex-1 flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-left transition-colors cursor-pointer min-w-0"
          aria-expanded={isDropdownOpen}
          aria-label="Select Physics Laboratory Module"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-[#000000] border border-[#1E293B] flex items-center justify-center shrink-0">
              {getCategoryIcon(currentMod.category)}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8] truncate">
                {currentMod.categoryLabel}
              </div>
              <div className="text-xs font-bold text-[#F8FAFC] truncate">
                {currentMod.label}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#94A3B8] shrink-0 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180 text-[#38BDF8]' : ''
            }`}
          />
        </button>

        <button
          onClick={onOpenCatalog}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] hover:border-[#38BDF8]/40 text-xs font-semibold text-[#38BDF8] shrink-0 transition-colors cursor-pointer min-h-[40px]"
          title="Open Full Module Catalog Drawer"
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="hidden sm:inline">Catalog</span>
        </button>
      </div>

      {/* Dropdown Module List */}
      {isDropdownOpen && (
        <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-3 shadow-2xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] font-medium">
            {[
              { id: 'all', label: 'All 18 Labs' },
              { id: 'mechanics', label: 'Mechanics' },
              { id: 'optics', label: 'Optics' },
              { id: 'em', label: 'Electromagnetism' },
              { id: 'waves', label: 'Waves' },
              { id: 'thermo', label: 'Thermodynamics' },
              { id: 'modern', label: 'Modern' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#38BDF8] text-[#000000] font-bold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0A0D14]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Module Grid in Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-1">
            {filteredModules.map((item) => {
              const isSelected = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectModule(item.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A0D14] text-[#38BDF8] border border-[#38BDF8]/50 shadow-xs'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0A0D14]'
                  }`}
                >
                  <div className="shrink-0">{getCategoryIcon(item.category)}</div>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Horizontal Quick-Scroll Strip for Instant 1-Tap Switching */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
        {ALL_MODULES.map((item) => {
          const isSelected = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#38BDF8] text-[#07111F] font-bold shadow-xs'
                  : 'bg-[#0B1728] text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#101D30] border border-[#26364D]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
