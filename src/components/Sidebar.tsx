/**
 * EQUATION 1 — Scientific Laboratory Sidebar Navigation (Dark Theme)
 * Clean, high-contrast module switcher matching dark navy-blue palette.
 */

import React, { useState } from 'react';
import {
  Compass,
  ChevronDown,
  ChevronRight,
  Activity,
  Zap,
  Eye,
  Flame,
  Binary,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowDownCircle,
  Scale,
  Waves,
  Radio,
  Crosshair,
  Volume2,
  Layers,
  ArrowRightLeft,
  RotateCw,
  X,
} from 'lucide-react';

export type LaboratoryModule =
  | 'snell'
  | 'doubleslit'
  | 'diffraction'
  | 'circuits'
  | 'lorentz'
  | 'doppler'
  | 'resonance'
  | 'waves'
  | 'shm'
  | 'projectile'
  | 'freefall'
  | 'newton'
  | 'incline'
  | 'collision'
  | 'circular'
  | 'kinetic'
  | 'carnot'
  | 'bohr'
  | 'photoelectric';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeModule: LaboratoryModule;
  onSelectModule: (module: LaboratoryModule) => void;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
}

interface NavSection {
  title: string;
  icon: React.ReactNode;
  isOpenDefault: boolean;
  items: {
    id: string;
    label: string;
    isLive?: boolean;
    isComingSoon?: boolean;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  activeModule,
  onSelectModule,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    optics: true,
    em: true,
    waves: true,
    mechanics: true,
    thermo: false,
    modern: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections: { key: string; section: NavSection }[] = [
    {
      key: 'optics',
      section: {
        title: 'Optics',
        icon: <Eye className="w-4 h-4 text-[#38BDF8]" />,
        isOpenDefault: true,
        items: [
          { id: 'doubleslit', label: 'Double-Slit Laboratory', isLive: true },
          { id: 'snell', label: "Snell's Law & Refraction", isLive: true },
        ],
      },
    },
    {
      key: 'em',
      section: {
        title: 'Electricity & Magnetism',
        icon: <Zap className="w-4 h-4 text-[#FBBF24]" />,
        isOpenDefault: true,
        items: [
          { id: 'circuits', label: 'RLC Circuits Laboratory', isLive: true },
          { id: 'lorentz', label: 'Lorentz Force Laboratory', isLive: true },
        ],
      },
    },
    {
      key: 'waves',
      section: {
        title: 'Waves & Oscillations',
        icon: <Waves className="w-4 h-4 text-[#38BDF8]" />,
        isOpenDefault: true,
        items: [
          { id: 'doppler', label: 'Doppler Effect', isLive: true },
          { id: 'resonance', label: 'Resonance Laboratory', isLive: true },
          { id: 'waves', label: 'Wave Interference', isLive: true },
          { id: 'shm', label: 'Simple Harmonic Motion', isLive: true },
        ],
      },
    },
    {
      key: 'mechanics',
      section: {
        title: 'Mechanics',
        icon: <Compass className="w-4 h-4 text-[#38BDF8]" />,
        isOpenDefault: true,
        items: [
          { id: 'projectile', label: 'Projectile Motion', isLive: true },
          { id: 'freefall', label: 'Free Fall', isLive: true },
          { id: 'newton', label: "Newton's Laws", isLive: true },
          { id: 'incline', label: 'Inclined Plane', isLive: true },
          { id: 'collision', label: 'Collisions & Momentum', isLive: true },
          { id: 'circular', label: 'Circular Motion', isLive: true },
        ],
      },
    },
    {
      key: 'thermo',
      section: {
        title: 'Thermodynamics',
        icon: <Flame className="w-4 h-4 text-[#FB923C]" />,
        isOpenDefault: true,
        items: [
          { id: 'kinetic', label: 'Kinetic Gas Theory', isLive: true },
          { id: 'carnot', label: 'Carnot Heat Engine', isLive: true },
        ],
      },
    },
    {
      key: 'modern',
      section: {
        title: 'Modern Physics',
        icon: <Binary className="w-4 h-4 text-[#818CF8]" />,
        isOpenDefault: true,
        items: [
          { id: 'bohr', label: 'Bohr Hydrogen Model', isLive: true },
          { id: 'photoelectric', label: 'Photoelectric Effect', isLive: true },
        ],
      },
    },
  ];

  const renderMobileDrawer = () => {
    if (!isMobileDrawerOpen) return null;
    return (
      <div className="fixed inset-0 z-50 lg:hidden flex">
        {/* Backdrop */}
        <div
          onClick={onCloseMobileDrawer}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
        {/* Drawer panel */}
        <div className="relative w-[85vw] max-w-xs h-full bg-[#000000] border-r border-[#1E293B] flex flex-col z-10 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-200">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1E293B] bg-[#050508] sticky top-0 z-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#F8FAFC] font-bold">
                Module Catalog
              </span>
              <div className="text-[10px] text-[#38BDF8] font-mono">18 Live Physics Laboratories</div>
            </div>
            <button
              onClick={onCloseMobileDrawer}
              className="p-2 text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14] rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Close module catalog"
              aria-label="Close module catalog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-3 space-y-2 text-xs flex-1">
            {sections.map(({ key, section }) => {
              const isOpen = openSections[key];
              return (
                <div key={key} className="space-y-1">
                  <button
                    onClick={() => toggleSection(key)}
                    className="w-full flex items-center justify-between px-2.5 py-2.5 text-[#F1F5F9] hover:bg-[#0A0D14] rounded-lg transition-colors cursor-pointer min-h-[44px]"
                  >
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      {section.icon}
                      <span>{section.title}</span>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="pl-3 pr-1 space-y-1 border-l border-[#1E293B] ml-3">
                      {section.items.map((item) => {
                        const isSelected = activeModule === item.id;
                        if (item.isLive) {
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                onSelectModule(item.id as LaboratoryModule);
                                onCloseMobileDrawer?.();
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer text-left min-h-[44px] ${
                                isSelected
                                  ? 'text-[#38BDF8] bg-[#0A0D14] border border-[#38BDF8]/40 font-bold'
                                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
                              }`}
                            >
                              <span className="text-xs">{item.label}</span>
                              <span
                                className={`text-[9px] uppercase tracking-wider font-mono font-bold ${
                                  isSelected ? 'text-[#38BDF8]' : 'text-[#94A3B8]'
                                }`}
                              >
                                Live
                              </span>
                            </button>
                          );
                        }
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between px-3 py-2 text-slate-500 rounded text-xs cursor-not-allowed"
                          >
                            <span className="truncate">{item.label}</span>
                            <span className="text-[9px] font-mono text-slate-600">v2</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-[#1E293B] bg-[#000000] text-[11px] text-[#94A3B8]">
            <span className="font-bold text-[#F1F5F9]">EQUATION 1 Engine</span>
            <p className="mt-0.5 text-slate-400">
              Precision deterministic physics laboratory.
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (isCollapsed) {
    return (
      <>
        <aside className="hidden lg:flex w-14 bg-[#000000] border-r border-[#1E293B] flex-col items-center py-4 gap-4 select-none shrink-0 transition-all">
          <button
            onClick={onToggleCollapse}
            className="p-2 text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14] rounded-lg transition-colors cursor-pointer"
            title="Expand modules sidebar"
            aria-label="Expand modules sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        <div className="w-8 h-[1px] bg-[#1E293B]" />

        <button
          onClick={() => onSelectModule('doubleslit')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeModule === 'doubleslit' || activeModule === 'diffraction'
              ? 'text-[#38BDF8] bg-[#0A0D14] border border-[#38BDF8]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
          title="Module: Double-Slit Experiment Laboratory"
        >
          <Layers className="w-4 h-4 text-[#38BDF8]" />
        </button>

        <button
          onClick={() => onSelectModule('snell')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeModule === 'snell'
              ? 'text-[#38BDF8] bg-[#0A0D14] border border-[#38BDF8]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
          title="Module: Snell's Law & Refraction"
        >
          <Eye className="w-4 h-4 text-[#38BDF8]" />
        </button>

        <button
          onClick={() => onSelectModule('doppler')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeModule === 'doppler'
              ? 'text-[#38BDF8] bg-[#0A0D14] border border-[#38BDF8]/40'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
          title="Module: Doppler Effect"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectModule('resonance')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeModule === 'resonance'
              ? 'text-[#38BDF8] bg-[#0A0D14] border border-[#38BDF8]/40'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
          title="Module: Resonance Laboratory"
        >
          <Radio className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectModule('waves')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeModule === 'waves'
              ? 'text-[#38BDF8] bg-[#0A0D14] border border-[#38BDF8]/40'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
          title="Module: Wave Interference"
        >
          <Waves className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectModule('shm')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeModule === 'shm'
              ? 'text-[#38BDF8] bg-[#0A0D14] border border-[#38BDF8]/40'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
          title="Module: Simple Harmonic Motion"
        >
          <Waves className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectModule('projectile')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeModule === 'projectile'
              ? 'text-[#38BDF8] bg-[#0A0D14] border border-[#38BDF8]/40'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
          title="Module: Projectile Motion"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectModule('freefall')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeModule === 'freefall'
              ? 'text-[#38BDF8] bg-[#0A0D14] border border-[#38BDF8]/40'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
          title="Module: Free Fall"
        >
          <ArrowDownCircle className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectModule('newton')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeModule === 'newton'
              ? 'text-[#38BDF8] bg-[#0A0D14] border border-[#38BDF8]/40'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
          title="Module: Newton's Laws of Motion"
        >
          <Activity className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectModule('incline')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeModule === 'incline'
              ? 'text-[#38BDF8] bg-[#0A0D14] border border-[#38BDF8]/40'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
          title="Module: Inclined Plane"
        >
          <Scale className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectModule('collision')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeModule === 'collision'
              ? 'text-[#38BDF8] bg-[#0A0D14] border border-[#38BDF8]/40'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
          title="Module: Collisions & Momentum"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectModule('circular')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeModule === 'circular'
              ? 'text-[#38BDF8] bg-[#0A0D14] border border-[#38BDF8]/40'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
          }`}
          title="Module: Circular Motion"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </aside>
      {renderMobileDrawer()}
    </>
  );
}

return (
  <>
    <aside className="hidden lg:flex w-64 bg-[#000000] border-r border-[#1E293B] flex-col select-none shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E293B]">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#94A3B8] font-bold">
          Module Catalog
        </span>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0A0D14] rounded-md transition-colors cursor-pointer"
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 space-y-2 text-xs">
        {sections.map(({ key, section }) => {
          const isOpen = openSections[key];
          return (
            <div key={key} className="space-y-1">
              <button
                onClick={() => toggleSection(key)}
                className="w-full flex items-center justify-between px-2.5 py-2 text-[#F1F5F9] hover:bg-[#0A0D14] rounded-md transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 font-semibold">
                  {section.icon}
                  <span>{section.title}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                )}
              </button>

              {isOpen && (
                <div className="pl-4 pr-1 space-y-0.5 border-l border-[#1E293B] ml-3">
                  {section.items.map((item) => {
                    const isSelected = activeModule === item.id;

                    if (item.isLive) {
                      return (
                        <button
                          key={item.id}
                          onClick={() => onSelectModule(item.id as LaboratoryModule)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer text-left ${
                            isSelected
                              ? 'text-[#38BDF8] bg-[#0A0D14] border border-[#38BDF8]/40 font-bold'
                              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0A0D14]'
                          }`}
                        >
                          <span>{item.label}</span>
                          <span
                            className={`text-[9px] uppercase tracking-wider font-mono font-bold ${
                              isSelected ? 'text-[#38BDF8]' : 'text-[#94A3B8]'
                            }`}
                          >
                            Live
                          </span>
                        </button>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-2.5 py-1.5 text-slate-500 rounded transition-colors cursor-not-allowed group"
                        title="Planned module for upcoming Equation 1 release"
                      >
                        <span className="truncate">{item.label}</span>
                        <span className="text-[9px] font-mono text-slate-600">
                          v2
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-auto p-4 border-t border-[#1E293B] bg-[#000000]">
        <div className="text-[11px] text-[#94A3B8] leading-relaxed">
          <span className="font-bold text-[#F1F5F9]">EQUATION 1 Engine</span>
          <p className="mt-1 text-slate-400">
            Precision deterministic kinematic & wave mechanics laboratory.
          </p>
        </div>
      </div>
    </aside>
    {renderMobileDrawer()}
  </>
  );
};
