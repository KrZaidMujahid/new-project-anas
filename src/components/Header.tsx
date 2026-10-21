/**
 * EQUATION 1 — Top Navigation Bar (Dark Theme)
 * Follows strict 3-zone contract: Brand wordmark — Nav links / Breadcrumb — Primary actions.
 */

import React from 'react';
import { Atom, RotateCcw, Info, Sparkles, Menu } from 'lucide-react';
import { LaboratoryModule } from './Sidebar';

interface HeaderProps {
  activeModule: LaboratoryModule;
  onSelectModule: (module: LaboratoryModule) => void;
  onResetAll: () => void;
  onOpenAssumptions: () => void;
  onOpenPresets: () => void;
  onOpenMobileDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  onResetAll,
  onOpenAssumptions,
  onOpenPresets,
  onOpenMobileDrawer,
}) => {
  return (
    <header className="flex items-center justify-between gap-2 sm:gap-6 px-3 sm:px-6 py-2.5 sm:py-3.5 pt-[max(0.625rem,env(safe-area-inset-top))] bg-[#000000] border-b border-[#1E293B] sticky top-0 z-30 select-none shadow-md">
      {/* Zone 1: Single text element wordmark & mobile menu */}
      <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap shrink-0">
        {onOpenMobileDrawer && (
          <button
            onClick={onOpenMobileDrawer}
            className="lg:hidden p-1.5 text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14] border border-[#1E293B] rounded-lg transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Open Module Catalog Drawer"
            aria-label="Open Module Catalog Drawer"
          >
            <Menu className="w-5 h-5 text-[#38BDF8]" />
          </button>
        )}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
          <Atom className="w-4 h-4 sm:w-5 sm:h-5 animate-[spin_12s_linear_infinite]" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm sm:text-base font-extrabold tracking-wider text-[#F1F5F9]">
            EQUATION <span className="text-[#38BDF8]">1</span>
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-[#94A3B8]">
            PHYSICS LABORATORY
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links & Module Switcher */}
      <nav className="hidden lg:flex items-center gap-3 text-xs font-medium text-[#94A3B8]">
        <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
          <span>Physics</span>
          <span>→</span>
          <span>{activeModule === 'bohr' || activeModule === 'photoelectric' ? 'Modern Physics' : activeModule === 'kinetic' || activeModule === 'carnot' ? 'Thermodynamics' : activeModule === 'doubleslit' || activeModule === 'diffraction' || activeModule === 'snell' ? 'Optics' : activeModule === 'circuits' || activeModule === 'lorentz' ? 'Electromagnetism' : activeModule === 'projectile' || activeModule === 'freefall' || activeModule === 'newton' || activeModule === 'incline' || activeModule === 'collision' || activeModule === 'circular' ? 'Mechanics' : 'Waves'}</span>
          <span>→</span>
        </div>

        <button
          onClick={() => onSelectModule('photoelectric')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'photoelectric'
              ? 'text-[#38BDF8] bg-[#0A0D14] font-bold border border-[#38BDF8]/50 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Photoelectric
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('bohr')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'bohr'
              ? 'text-[#818CF8] bg-[#0A0D14] font-bold border border-[#818CF8]/50 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Bohr Atom
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('carnot')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'carnot'
              ? 'text-[#F97316] bg-[#0A0D14] font-bold border border-[#F97316]/50 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Carnot Engine
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('kinetic')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'kinetic'
              ? 'text-[#FB923C] bg-[#0A0D14] font-bold border border-[#FB923C]/50 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Kinetic Gases
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('doubleslit')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'doubleslit' || activeModule === 'diffraction'
              ? 'text-[#38BDF8] bg-[#0A0D14] font-bold border border-[#38BDF8]/50 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Double Slit
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('snell')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'snell'
              ? 'text-[#38BDF8] bg-[#0A0D14] font-bold border border-[#38BDF8]/50 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Snell's Law
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('circuits')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'circuits'
              ? 'text-[#38BDF8] bg-[#0A0D14] font-bold border border-[#38BDF8]/50 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          RLC Circuits
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('lorentz')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'lorentz'
              ? 'text-[#FBBF24] bg-[#0A0D14] font-bold border border-[#FBBF24]/50 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Lorentz Force
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('doppler')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'doppler'
              ? 'text-[#38BDF8] bg-[#0A0D14] font-bold border border-[#38BDF8]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Doppler Effect
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('resonance')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'resonance'
              ? 'text-[#38BDF8] bg-[#0A0D14] font-bold border border-[#38BDF8]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Resonance
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('waves')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'waves'
              ? 'text-[#38BDF8] bg-[#0A0D14] font-bold border border-[#38BDF8]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Interference
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('shm')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'shm'
              ? 'text-[#38BDF8] bg-[#0A0D14] font-bold border border-[#38BDF8]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          SHM
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('incline')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'incline'
              ? 'text-[#38BDF8] bg-[#0A0D14] font-bold border border-[#38BDF8]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Inclined Plane
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('freefall')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'freefall'
              ? 'text-[#38BDF8] bg-[#0A0D14] font-bold border border-[#38BDF8]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Free Fall
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('newton')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'newton'
              ? 'text-[#38BDF8] bg-[#0A0D14] font-bold border border-[#38BDF8]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Newton&apos;s Laws
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('projectile')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'projectile'
              ? 'text-[#38BDF8] bg-[#0A0D14] font-bold border border-[#38BDF8]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Projectile
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('collision')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'collision'
              ? 'text-[#38BDF8] bg-[#0A0D14] font-bold border border-[#38BDF8]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Collisions
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={() => onSelectModule('circular')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeModule === 'circular'
              ? 'text-[#38BDF8] bg-[#0A0D14] font-bold border border-[#38BDF8]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
        >
          Circular
        </button>

        <span className="text-[#1E293B]">|</span>

        <button
          onClick={onOpenAssumptions}
          className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>Assumptions</span>
        </button>
      </nav>

      {/* Zone 3: Primary action cluster */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <button
          onClick={onOpenPresets}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[#38BDF8] bg-[#0A0D14] hover:bg-[#121722] border border-[#1E293B] hover:border-[#38BDF8]/50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs min-h-[38px]"
          title="Browse preset physics scenarios"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Presets</span>
        </button>

        <button
          onClick={onResetAll}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[#F1F5F9] bg-[#0A0D14] hover:bg-[#121722] border border-[#1E293B] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs min-h-[38px]"
          title="Reset current lab parameters to initial state"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="hidden sm:inline">Reset Lab</span>
        </button>
      </div>
    </header>
  );
};
