/**
 * EQUATION 1 — Real-World Lorentz Force Demonstrations & Applications
 * 6 Interactive engineering and scientific applications:
 * - Velocity Selector (Wien Filter)
 * - Bainbridge Mass Spectrometer
 * - Lawrence Cyclotron
 * - Aurora Borealis & Geomagnetic Trapping
 * - J.J. Thomson e/m Experiment (1897)
 * - Hall Effect Sensor
 */

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  Atom,
  Flame,
  Layers,
  Cpu,
  Radio,
} from 'lucide-react';
import { LorentzParameters } from '../../physics/lorentz/types';
import {
  ELEMENTARY_CHARGE,
  PROTON_MASS,
  ALPHA_MASS,
} from '../../physics/lorentz/model';

interface LorentzApplicationsPanelProps {
  onApplyConfig: (config: Partial<LorentzParameters>) => void;
  onGoToSimulation: () => void;
}

interface ApplicationItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  icon: React.ReactNode;
  description: string;
  physicsPrinciple: string;
  formula: string;
  config: Partial<LorentzParameters>;
}

export const LorentzApplicationsPanel: React.FC<LorentzApplicationsPanelProps> = ({
  onApplyConfig,
  onGoToSimulation,
}) => {
  const applications: ApplicationItem[] = [
    {
      id: 'velocity-selector',
      title: 'Velocity Selector (Wien Filter)',
      subtitle: 'Particle Accelerator Beam Filtering',
      tag: 'Crossed E ⊥ B Fields',
      tagColor: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30',
      icon: <Target className="w-5 h-5 text-[#38BDF8]" />,
      description:
        'Employs perpendicular electric and magnetic fields to allow only particles with the exact selected velocity v = E/B to travel straight through an exit slit. Particles with speeds too fast or too slow are deflected into the collimator walls.',
      physicsPrinciple:
        'At v = E/B, the upward electric force qE exactly balances the downward magnetic force qvB, yielding zero net acceleration.',
      formula: 'v = E / B = (1.0 × 10⁶ N/C) / (0.5 T) = 2.0 × 10⁶ m/s',
      config: {
        charge: ELEMENTARY_CHARGE,
        chargeNumber: 1,
        mass: PROTON_MASS,
        speed: 2.0e6,
        bFieldStrength: 0.5,
        bFieldDirection: 'out-of-screen',
        angleThetaDeg: 90,
        electricFieldEnabled: true,
        eFieldStrength: 1.0e6,
        eFieldDirection: 'up',
        initialVelocityAngleDeg: 0,
        mode: 'crossed-fields',
      },
    },
    {
      id: 'mass-spectrometer',
      title: 'Bainbridge Mass Spectrometer',
      subtitle: 'Isotopic Separation & Forensics',
      tag: 'Radius Mass Dependence',
      tagColor: 'text-[#FBBF24] bg-[#FBBF24]/10 border-[#FBBF24]/30',
      icon: <Atom className="w-5 h-5 text-[#FBBF24]" />,
      description:
        'Ions emerge from a velocity selector with uniform speed and enter a uniform magnetic field chamber. Because the orbit radius r = mv/(qB) depends directly on mass, isotopes of different masses (such as Uranium-235 vs 238 or Carbon-12 vs 14) curve into distinct semicircular paths to strike different detector coordinates.',
      physicsPrinciple:
        'Comparing singly charged alpha particles (4 u) against protons (1 u): the heavier alpha ion exhibits a much wider circular radius.',
      formula: 'r = (m · v) / (q · B)  ⇒  m/q = (r · B) / v',
      config: {
        charge: 2 * ELEMENTARY_CHARGE,
        chargeNumber: 2,
        mass: ALPHA_MASS,
        speed: 2.0e6,
        bFieldStrength: 0.5,
        bFieldDirection: 'out-of-screen',
        angleThetaDeg: 90,
        electricFieldEnabled: false,
        mode: 'perpendicular',
      },
    },
    {
      id: 'cyclotron',
      title: 'Lawrence Cyclotron Particle Accelerator',
      subtitle: 'High-Energy Nuclear Bombardment',
      tag: 'Isochronous Resonance',
      tagColor: 'text-[#34D399] bg-[#34D399]/10 border-[#34D399]/30',
      icon: <Layers className="w-5 h-5 text-[#34D399]" />,
      description:
        'Invented by Ernest O. Lawrence in 1932. Uses a constant magnetic field to bend charged particles into circular orbits while an alternating radiofrequency electric field across the gap between two D-shaped hollow chambers ("Dees") accelerates them on every half-turn.',
      physicsPrinciple:
        'Because the period T = 2πm / (qB) is completely independent of radius and speed, the RF accelerating frequency remains constant as the particle spirals outward.',
      formula: 'f_cyclotron = (q · B) / (2π · m) ≈ 7.63 MHz for proton in 0.5 T',
      config: {
        charge: ELEMENTARY_CHARGE,
        chargeNumber: 1,
        mass: PROTON_MASS,
        speed: 2.5e6,
        bFieldStrength: 0.8,
        bFieldDirection: 'out-of-screen',
        angleThetaDeg: 90,
        electricFieldEnabled: false,
        mode: 'perpendicular',
      },
    },
    {
      id: 'aurora-borealis',
      title: 'Aurora Borealis & Geomagnetic Trapping',
      subtitle: 'Solar Wind & Cosmic Ray Helices',
      tag: 'Helical Magnetic Bottle',
      tagColor: 'text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/30',
      icon: <Flame className="w-5 h-5 text-[#A78BFA]" />,
      description:
        'Solar wind electrons and protons striking Earth’s magnetosphere possess velocity components both along and across the geomagnetic field lines. The Lorentz force constrains these charges to spiral in tight helical trajectories along magnetic field lines down into the Arctic and Antarctic ionosphere, ionizing nitrogen and oxygen to emit dazzling curtains of green and purple light.',
      physicsPrinciple:
        'Helical pitch p = v_∥ · (2πm / qB) controls the forward drift while v_⊥ sustains circular confinement.',
      formula: 'p = v · cos(θ) · (2π · m) / (q · B)',
      config: {
        charge: ELEMENTARY_CHARGE,
        chargeNumber: 1,
        mass: PROTON_MASS,
        speed: 2.0e6,
        bFieldStrength: 0.5,
        bFieldDirection: 'out-of-screen',
        angleThetaDeg: 45,
        electricFieldEnabled: false,
        mode: 'helical',
      },
    },
    {
      id: 'thomson-experiment',
      title: 'J.J. Thomson e/m Experiment (1897)',
      subtitle: 'Discovery of the Electron',
      tag: 'Cathode Ray Deflection',
      tagColor: 'text-[#FB7185] bg-[#FB7185]/10 border-[#FB7185]/30',
      icon: <Radio className="w-5 h-5 text-[#FB7185]" />,
      description:
        'Sir J.J. Thomson determined the specific charge (charge-to-mass ratio e/m) of cathode rays by applying crossed electric and magnetic fields. By balancing the deflection to zero (v = E/B) and then observing the magnetic deflection alone, Thomson proved cathode rays were subatomic particles 1,800 times lighter than hydrogen.',
      physicsPrinciple:
        'Combining the crossed-field balance with electric deflection reveals e/m directly from measurable macro voltages and magnetic currents.',
      formula: 'e / m = E / (r · B²)',
      config: {
        charge: -ELEMENTARY_CHARGE,
        chargeNumber: -1,
        mass: PROTON_MASS,
        speed: 1.5e6,
        bFieldStrength: 0.3,
        bFieldDirection: 'out-of-screen',
        angleThetaDeg: 90,
        electricFieldEnabled: true,
        eFieldStrength: 4.5e5,
        eFieldDirection: 'down',
        mode: 'crossed-fields',
      },
    },
    {
      id: 'hall-effect',
      title: 'Solid-State Hall Effect Sensors',
      subtitle: 'Modern Automotive & Smartphone Compasses',
      tag: 'Charge Carrier Deflection',
      tagColor: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30',
      icon: <Cpu className="w-5 h-5 text-[#38BDF8]" />,
      description:
        'When a current-carrying semiconductor strip is placed in a magnetic field, the Lorentz force pushes mobile charge carriers toward one lateral edge, building up a transverse electric potential difference known as the Hall Voltage (V_H). This solid-state effect powers smartphone 3-axis magnetometers, brushless motor commutators, and ABS wheel speed sensors.',
      physicsPrinciple:
        'Charge accumulation ceases when the internal transverse electric force qE_H exactly equals the magnetic Lorentz force qv_d B.',
      formula: 'V_H = (I · B) / (n · q · t) where n is carrier density, t is thickness',
      config: {
        charge: ELEMENTARY_CHARGE,
        chargeNumber: 1,
        mass: PROTON_MASS,
        speed: 1.2e6,
        bFieldStrength: 0.6,
        bFieldDirection: 'out-of-screen',
        angleThetaDeg: 90,
        electricFieldEnabled: false,
        mode: 'perpendicular',
      },
    },
  ];

  return (
    <div className="space-y-6 text-[#F1F5F9]">
      {/* Overview Banner */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/30 flex items-center justify-center text-[#FBBF24] shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wide text-[#F1F5F9]">
            Real-World Technologies Powered by Lorentz Force
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
            The magnetic force <code className="text-[#38BDF8] font-mono">F = q(v × B)</code> is not merely textbook mathematics; it is the physical engine behind particle colliders, isotope dating, atomic discovery, geomagnetic atmospheric shielding, and solid-state sensors. Click any application below to load its configuration into the interactive simulator.
          </p>
        </div>
      </div>

      {/* Grid of 6 Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-[#101D30] rounded-xl border border-[#26364D] hover:border-[#38BDF8]/40 p-5 shadow-xl transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#17263B] border border-[#26364D] flex items-center justify-center shrink-0">
                    {app.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#F1F5F9]">
                      {app.title}
                    </h3>
                    <div className="text-[11px] text-[#94A3B8]">
                      {app.subtitle}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${app.tagColor}`}>
                  {app.tag}
                </span>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {app.description}
              </p>

              <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D] space-y-1.5 text-xs">
                <div className="text-[11px] font-semibold text-[#F1F5F9]">
                  Governing Principle:
                </div>
                <div className="text-[11px] text-[#94A3B8] leading-relaxed">
                  {app.physicsPrinciple}
                </div>
                <div className="font-mono text-[11px] font-bold text-[#38BDF8] pt-1">
                  {app.formula}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onApplyConfig(app.config);
                onGoToSimulation();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#17263B] hover:bg-[#38BDF8] text-[#38BDF8] hover:text-[#07111F] border border-[#26364D] hover:border-[#38BDF8] text-xs font-bold transition-all cursor-pointer shadow-xs group"
            >
              <span>Load Into Interactive Simulation</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
