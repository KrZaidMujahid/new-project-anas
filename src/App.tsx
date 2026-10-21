/**
 * EQUATION 1 — Scientific Interactive Mathematics & Physics Laboratory
 * "Write it. Transform it. Graph it. Simulate it. Understand it."
 *
 * Modules:
 * - Doppler Effect Laboratory (Acoustic Wavefronts & Relative Motion)
 * - Resonance Laboratory (Driven Damped Harmonic Oscillators)
 * - Wave Interference Laboratory
 * - Simple Harmonic Motion (SHM)
 * - Inclined Plane Laboratory
 * - Newton's Laws of Motion
 * - Free Fall Laboratory
 * - Projectile Motion Laboratory
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, LaboratoryModule } from './components/Sidebar';
import { MobileModuleSelector } from './components/MobileModuleSelector';
import { DoubleSlitLaboratory } from './components/doubleslit/DoubleSlitLaboratory';
import { OpticsLaboratory } from './components/optics/OpticsLaboratory';
import { CircuitsLaboratory } from './components/circuits/CircuitsLaboratory';
import { LorentzLaboratory } from './components/lorentz/LorentzLaboratory';
import { DopplerLaboratory } from './components/doppler/DopplerLaboratory';
import { ResonanceLab } from './components/resonance/ResonanceLab';
import { WaveInterferenceLab } from './components/waves/WaveInterferenceLab';
import { SHMLaboratory } from './components/shm/SHMLaboratory';
import { NewtonLaboratory } from './components/newton/NewtonLaboratory';
import { FreeFallLaboratory } from './components/freeFall/FreeFallLaboratory';
import { ProjectileLaboratory } from './components/projectile/ProjectileLaboratory';
import { InclineLaboratory } from './components/incline/InclineLaboratory';
import { KineticLaboratory } from './components/kinetic/KineticLaboratory';
import { CarnotLaboratory } from './components/carnot/CarnotLaboratory';
import { BohrLaboratory } from './components/bohr/BohrLaboratory';
import { PhotoelectricLaboratory } from './components/photoelectric/PhotoelectricLaboratory';
import { CollisionLaboratory } from './components/collision/CollisionLaboratory';
import { CircularLaboratory } from './components/circular/CircularLaboratory';
import { ModelAssumptionsModal } from './components/ModelAssumptionsModal';
import { FreeFallPresetsModal } from './components/freeFall/FreeFallPresetsModal';
import { PresetsModal as ProjectilePresetsModal } from './components/PresetsModal';
import { NewtonPresetsModal } from './components/newton/NewtonPresetsModal';
import { InclinePresetsModal } from './components/incline/InclinePresetsModal';
import { SHMPresetsModal } from './components/shm/SHMPresetsModal';

export default function App() {
  const [activeModule, setActiveModule] = useState<LaboratoryModule>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#photoelectric' || window.location.hash === '#einstein') return 'photoelectric';
      if (
        window.location.hash === '#collision' ||
        window.location.hash === '#momentum' ||
        window.location.hash === '#collisions' ||
        (typeof window !== 'undefined' && window.location.pathname.includes('/simulations/momentum-collisions'))
      ) return 'collision';
      if (
        window.location.hash === '#circular' ||
        window.location.hash === '#circularmotion' ||
        (typeof window !== 'undefined' && window.location.pathname.includes('/simulations/circular-motion'))
      ) return 'circular';
      if (window.location.hash === '#bohr' || window.location.hash === '#hydrogen' || window.location.hash === '#atom') return 'bohr';
      if (window.location.hash === '#carnot' || window.location.hash === '#heatengine') return 'carnot';
      if (window.location.hash === '#kinetic' || window.location.hash === '#gases' || window.location.hash === '#thermo') return 'kinetic';
      if (window.location.hash === '#doubleslit' || window.location.hash === '#diffraction' || window.location.hash === '#young') return 'doubleslit';
      if (window.location.hash === '#snell' || window.location.hash === '#refraction' || window.location.hash === '#optics') return 'snell';
      if (window.location.hash === '#circuits' || window.location.hash === '#rlc') return 'circuits';
      if (window.location.hash === '#lorentz') return 'lorentz';
      if (window.location.hash === '#doppler') return 'doppler';
      if (window.location.hash === '#resonance') return 'resonance';
      if (window.location.hash === '#waves' || window.location.hash === '#interference') return 'waves';
      if (window.location.hash === '#shm') return 'shm';
      if (window.location.hash === '#projectile') return 'projectile';
      if (window.location.hash === '#freefall') return 'freefall';
      if (window.location.hash === '#newton') return 'newton';
      if (window.location.hash === '#incline') return 'incline';
    }
    // Default to Double-Slit Experiment Laboratory
    return 'doubleslit';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState(false);
  const [isGlobalPresetsOpen, setIsGlobalPresetsOpen] = useState(false);
  const [labKey, setLabKey] = useState(0);

  // Sync with browser hash
  useEffect(() => {
    const handleHashChange = () => {
      if (
        window.location.hash === '#collision' ||
        window.location.hash === '#momentum' ||
        window.location.hash === '#collisions' ||
        window.location.pathname.includes('/simulations/momentum-collisions')
      ) {
        setActiveModule('collision');
      } else if (
        window.location.hash === '#circular' ||
        window.location.hash === '#circularmotion' ||
        window.location.pathname.includes('/simulations/circular-motion')
      ) {
        setActiveModule('circular');
      } else if (window.location.hash === '#photoelectric' || window.location.hash === '#einstein') {
        setActiveModule('photoelectric');
      } else if (window.location.hash === '#bohr' || window.location.hash === '#hydrogen') {
        setActiveModule('bohr');
      } else if (window.location.hash === '#carnot' || window.location.hash === '#heatengine') {
        setActiveModule('carnot');
      } else if (window.location.hash === '#kinetic' || window.location.hash === '#gases' || window.location.hash === '#thermo') {
        setActiveModule('kinetic');
      } else if (window.location.hash === '#doubleslit' || window.location.hash === '#diffraction' || window.location.hash === '#young') {
        setActiveModule('doubleslit');
      } else if (window.location.hash === '#snell' || window.location.hash === '#refraction' || window.location.hash === '#optics') {
        setActiveModule('snell');
      } else if (window.location.hash === '#circuits' || window.location.hash === '#rlc') {
        setActiveModule('circuits');
      } else if (window.location.hash === '#lorentz') {
        setActiveModule('lorentz');
      } else if (window.location.hash === '#doppler') {
        setActiveModule('doppler');
      } else if (window.location.hash === '#resonance') {
        setActiveModule('resonance');
      } else if (window.location.hash === '#waves' || window.location.hash === '#interference') {
        setActiveModule('waves');
      } else if (window.location.hash === '#shm') {
        setActiveModule('shm');
      } else if (window.location.hash === '#projectile') {
        setActiveModule('projectile');
      } else if (window.location.hash === '#freefall') {
        setActiveModule('freefall');
      } else if (window.location.hash === '#newton') {
        setActiveModule('newton');
      } else if (window.location.hash === '#incline') {
        setActiveModule('incline');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleSelectModule = (module: LaboratoryModule) => {
    setActiveModule(module);
    if (module === 'collision') {
      window.location.hash = '#collision';
      try {
        window.history.pushState(null, '', '/simulations/momentum-collisions#collision');
      } catch (_) {}
    } else if (module === 'circular') {
      window.location.hash = '#circular';
      try {
        window.history.pushState(null, '', '/simulations/circular-motion#circular');
      } catch (_) {}
    } else {
      window.location.hash = `#${module}`;
    }
  };

  const handleResetLab = () => {
    setLabKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#38BDF8]/30 selection:text-[#38BDF8]">
      {/* Top Header Navigation */}
      <Header
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        onResetAll={handleResetLab}
        onOpenAssumptions={() => setIsAssumptionsOpen(true)}
        onOpenPresets={() => setIsGlobalPresetsOpen(true)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Sidebar Module Catalog (Desktop) & Slide-Over Drawer (Mobile) */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          activeModule={activeModule}
          onSelectModule={handleSelectModule}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
        />

        {/* Central Stage */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-6 py-4 sm:py-6 max-w-[1750px] mx-auto w-full min-w-0">
          {/* Mobile Module Selector Bar (< 1024px) */}
          <MobileModuleSelector
            activeModule={activeModule}
            onSelectModule={handleSelectModule}
            onOpenCatalog={() => setIsMobileDrawerOpen(true)}
          />

          {activeModule === 'photoelectric' && (
            <PhotoelectricLaboratory
              key={`photoelectric-${labKey}`}
              onBackToPhysics={() => handleSelectModule('doubleslit')}
              isPresetsOpenExternal={isGlobalPresetsOpen}
              onClosePresetsExternal={() => setIsGlobalPresetsOpen(false)}
            />
          )}

          {activeModule === 'bohr' && (
            <BohrLaboratory
              key={`bohr-${labKey}`}
              onBackToPhysics={() => handleSelectModule('doubleslit')}
              isPresetsOpenExternal={isGlobalPresetsOpen}
              onClosePresetsExternal={() => setIsGlobalPresetsOpen(false)}
            />
          )}

          {activeModule === 'carnot' && (
            <CarnotLaboratory
              key={`carnot-${labKey}`}
              onBackToPhysics={() => handleSelectModule('doubleslit')}
              isPresetsOpenExternal={isGlobalPresetsOpen}
              onClosePresetsExternal={() => setIsGlobalPresetsOpen(false)}
            />
          )}

          {activeModule === 'kinetic' && (
            <KineticLaboratory
              key={`kinetic-${labKey}`}
              onBackToPhysics={() => handleSelectModule('doubleslit')}
            />
          )}

          {(activeModule === 'doubleslit' || activeModule === 'diffraction') && (
            <DoubleSlitLaboratory
              key={`doubleslit-${labKey}`}
              isPresetsOpenExternal={isGlobalPresetsOpen}
              onClosePresetsExternal={() => setIsGlobalPresetsOpen(false)}
            />
          )}

          {activeModule === 'snell' && (
            <OpticsLaboratory key={`snell-${labKey}`} />
          )}

          {activeModule === 'circuits' && (
            <CircuitsLaboratory key={`circuits-${labKey}`} />
          )}

          {activeModule === 'lorentz' && (
            <LorentzLaboratory key={`lorentz-${labKey}`} />
          )}

          {activeModule === 'doppler' && (
            <DopplerLaboratory key={`doppler-${labKey}`} />
          )}

          {activeModule === 'resonance' && (
            <ResonanceLab key={`resonance-${labKey}`} />
          )}

          {activeModule === 'waves' && (
            <WaveInterferenceLab key={`waves-${labKey}`} />
          )}

          {activeModule === 'shm' && (
            <SHMLaboratory key={`shm-${labKey}`} />
          )}

          {activeModule === 'incline' && (
            <InclineLaboratory key={`incline-${labKey}`} />
          )}

          {activeModule === 'newton' && (
            <NewtonLaboratory key={`newton-${labKey}`} />
          )}

          {activeModule === 'freefall' && (
            <FreeFallLaboratory key={`freefall-${labKey}`} />
          )}

          {activeModule === 'projectile' && (
            <ProjectileLaboratory key={`projectile-${labKey}`} />
          )}

          {activeModule === 'collision' && (
            <CollisionLaboratory
              key={`collision-${labKey}`}
              onBackToPhysics={() => handleSelectModule('doubleslit')}
              isPresetsOpenExternal={isGlobalPresetsOpen}
              onClosePresetsExternal={() => setIsGlobalPresetsOpen(false)}
            />
          )}

          {activeModule === 'circular' && (
            <CircularLaboratory
              key={`circular-${labKey}`}
              onBackToPhysics={() => handleSelectModule('doubleslit')}
              isPresetsOpenExternal={isGlobalPresetsOpen}
              onClosePresetsExternal={() => setIsGlobalPresetsOpen(false)}
            />
          )}
        </main>
      </div>

      {/* Global Assumptions Modal */}
      <ModelAssumptionsModal
        isOpen={isAssumptionsOpen}
        onClose={() => setIsAssumptionsOpen(false)}
      />

      {/* Global Presets Modal for other modules */}
      {activeModule === 'shm' && (
        <SHMPresetsModal
          isOpen={isGlobalPresetsOpen}
          onClose={() => setIsGlobalPresetsOpen(false)}
          onSelectPreset={() => {
            setIsGlobalPresetsOpen(false);
          }}
        />
      )}

      {activeModule === 'incline' && (
        <InclinePresetsModal
          isOpen={isGlobalPresetsOpen}
          onClose={() => setIsGlobalPresetsOpen(false)}
          onSelectPreset={() => {
            setIsGlobalPresetsOpen(false);
          }}
        />
      )}

      {activeModule === 'newton' && (
        <NewtonPresetsModal
          isOpen={isGlobalPresetsOpen}
          onClose={() => setIsGlobalPresetsOpen(false)}
          onSelectPreset={() => {
            setIsGlobalPresetsOpen(false);
          }}
        />
      )}

      {activeModule === 'freefall' && (
        <FreeFallPresetsModal
          isOpen={isGlobalPresetsOpen}
          onClose={() => setIsGlobalPresetsOpen(false)}
          onSelectPreset={() => {
            setIsGlobalPresetsOpen(false);
          }}
          currentParams={{ initialHeight: 20, initialVelocity: 0, gravity: 9.8 }}
        />
      )}

      {activeModule === 'projectile' && (
        <ProjectilePresetsModal
          isOpen={isGlobalPresetsOpen}
          onClose={() => setIsGlobalPresetsOpen(false)}
          onSelectPreset={() => {
            setIsGlobalPresetsOpen(false);
          }}
          currentParams={{ initialSpeed: 20, launchAngleDeg: 45, initialHeight: 0, gravity: 9.81 }}
        />
      )}
    </div>
  );
}
