/**
 * EQUATION 1 — Double-Slit Real-World Applications
 * Part 15: Modern Scientific & Industrial Optical Applications
 *
 * Covers:
 * 1. Measuring Light Wavelength (λ = βd / L)
 * 2. Interferometry (Michelson, Mach-Zehnder, LIGO gravitational waves)
 * 3. Optical Metrology (Nanometer surface profilometry & wafer inspection)
 * 4. Spectroscopy (Diffraction gratings & astronomical elemental analysis)
 * 5. Coherence Experiments (Spatial & temporal coherence, quantum optics)
 * 6. Precision Displacement Measurement (Laser encoders & sub-nanometer stages)
 * 7. Wave Optics Research (Matter-wave duality, fullerene & electron diffraction)
 */

import React from 'react';
import {
  Sparkles,
  Zap,
  Layers,
  Compass,
  Activity,
  Atom,
  CheckCircle2,
  Maximize2,
  Radio,
} from 'lucide-react';

interface ApplicationCard {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  badge: string;
  description: string;
  howItWorks: string;
  svgDiagram: React.ReactNode;
}

export const DoubleSlitApplications: React.FC = () => {
  const cards: ApplicationCard[] = [
    {
      id: 'wavelength',
      title: '1. Measuring Light Wavelength',
      category: 'Optical Standards',
      icon: <Sparkles className="w-4 h-4 text-[#38BDF8]" />,
      color: '#38BDF8',
      badge: 'Metrology Fundamental',
      description: 'Using the inverted Young relation λ = βd / L to measure unknown laser and atomic emission wavelengths with high precision.',
      howItWorks: 'By accurately knowing slit spacing d and screen distance L, measuring macroscopic fringe spacing β directly yields sub-micrometer optical wavelengths without complex spectrometers.',
      svgDiagram: (
        <svg viewBox="0 0 240 100" className="w-full h-24">
          <rect width="240" height="100" fill="#0B1728" rx="6" />
          <line x1="20" y1="50" x2="60" y2="50" stroke="#38BDF8" strokeWidth="3" />
          <circle cx="60" cy="50" r="4" fill="#38BDF8" />
          <line x1="100" y1="20" x2="100" y2="80" stroke="#475569" strokeWidth="3" />
          <line x1="100" y1="40" x2="100" y2="44" stroke="#0B1728" strokeWidth="4" />
          <line x1="100" y1="56" x2="100" y2="60" stroke="#0B1728" strokeWidth="4" />
          {/* Rays */}
          <line x1="100" y1="42" x2="210" y2="35" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />
          <line x1="100" y1="58" x2="210" y2="35" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />
          {/* Screen fringes */}
          <rect x="210" y="15" width="10" height="70" fill="#17263B" stroke="#26364D" />
          <rect x="212" y="25" width="6" height="4" fill="#38BDF8" />
          <rect x="212" y="35" width="6" height="4" fill="#38BDF8" />
          <rect x="212" y="48" width="6" height="6" fill="#38BDF8" />
          <rect x="212" y="61" width="6" height="4" fill="#38BDF8" />
          <rect x="212" y="71" width="6" height="4" fill="#38BDF8" />
          <text x="140" y="90" fill="#38BDF8" fontSize="9" fontFamily="monospace">λ = β · d / L</text>
        </svg>
      ),
    },
    {
      id: 'interferometry',
      title: '2. Interferometry & Gravitational Waves',
      category: 'Astrophysics & Precision',
      icon: <Radio className="w-4 h-4 text-[#A78BFA]" />,
      color: '#A78BFA',
      badge: 'LIGO Detection',
      description: 'LIGO and Michelson interferometers use constructive and destructive interference of split laser beams to detect displacements smaller than 1/10,000th of a proton radius.',
      howItWorks: 'A passing gravitational wave differentially stretches the perpendicular 4-km arms of LIGO, shifting the relative phase Δφ and causing optical fringes to flicker on a photodetector.',
      svgDiagram: (
        <svg viewBox="0 0 240 100" className="w-full h-24">
          <rect width="240" height="100" fill="#0B1728" rx="6" />
          <circle cx="90" cy="50" r="14" fill="#17263B" stroke="#A78BFA" strokeWidth="1.5" />
          <line x1="80" y1="40" x2="100" y2="60" stroke="#A78BFA" strokeWidth="2" />
          {/* Horizontal Arm */}
          <line x1="20" y1="50" x2="80" y2="50" stroke="#38BDF8" strokeWidth="2" />
          <line x1="100" y1="50" x2="180" y2="50" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 2" />
          <rect x="180" y="38" width="6" height="24" fill="#94A3B8" />
          {/* Vertical Arm */}
          <line x1="90" y1="50" x2="90" y2="15" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 2" />
          <rect x="78" y="10" width="24" height="6" fill="#94A3B8" />
          {/* Detector */}
          <line x1="90" y1="60" x2="90" y2="85" stroke="#A78BFA" strokeWidth="2" />
          <circle cx="90" cy="88" r="5" fill="#A78BFA" />
          <text x="140" y="85" fill="#A78BFA" fontSize="9" fontFamily="monospace">ΔL &lt; 10⁻¹⁸ m</text>
        </svg>
      ),
    },
    {
      id: 'metrology',
      title: '3. Optical Surface Metrology',
      category: 'Semiconductor Manufacturing',
      icon: <Layers className="w-4 h-4 text-[#34D399]" />,
      color: '#34D399',
      badge: 'Nanoscale Profilometry',
      description: 'Verifying atomic smoothness of silicon wafers, extreme ultraviolet (EUV) mirrors, and telescope optics using interference contour maps.',
      howItWorks: 'When an optical flat is placed over a test surface, slight variations in air gap thickness δ create Newton-like interference contour fringes where each fringe represents a height change of λ/2 (~250 nm).',
      svgDiagram: (
        <svg viewBox="0 0 240 100" className="w-full h-24">
          <rect width="240" height="100" fill="#0B1728" rx="6" />
          {/* Optical Flat Top */}
          <rect x="30" y="25" width="180" height="15" fill="#17263B" stroke="#34D399" strokeWidth="1" />
          <text x="120" y="36" fill="#94A3B8" fontSize="8" textAnchor="middle">Reference Optical Flat</text>
          {/* Air Gap & Contour Lines */}
          <path d="M 30 75 Q 80 65, 120 70 T 210 75" fill="none" stroke="#FBBF24" strokeWidth="2" />
          <line x1="50" y1="42" x2="50" y2="73" stroke="#34D399" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="120" y1="42" x2="120" y2="70" stroke="#34D399" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="190" y1="42" x2="190" y2="74" stroke="#34D399" strokeWidth="1" strokeDasharray="2 2" />
          <text x="120" y="90" fill="#34D399" fontSize="9" fontFamily="monospace" textAnchor="middle">1 Fringe = λ / 2 ≈ 275 nm</text>
        </svg>
      ),
    },
    {
      id: 'spectroscopy',
      title: '4. High-Resolution Spectroscopy',
      category: 'Astrophysics & Chemistry',
      icon: <Activity className="w-4 h-4 text-[#FBBF24]" />,
      color: '#FBBF24',
      badge: 'Diffraction Gratings',
      description: 'Extending the double-slit principle to thousands of slits (N = 10,000 slits/cm) creates ultra-sharp spectral lines to identify chemical compositions of distant stars.',
      howItWorks: 'As slit count N grows, destructive interference cancels almost all angles, leaving needle-sharp constructive peaks at d sin θ = mλ that easily resolve the yellow sodium D-doublet (589.0 nm vs 589.6 nm).',
      svgDiagram: (
        <svg viewBox="0 0 240 100" className="w-full h-24">
          <rect width="240" height="100" fill="#0B1728" rx="6" />
          {/* Grating lines */}
          {[40, 44, 48, 52, 56, 60, 64, 68].map((x) => (
            <line key={x} x1={x} y1="20" x2={x} y2="80" stroke="#FBBF24" strokeWidth="1.5" />
          ))}
          {/* Dispersed beams */}
          <line x1="68" y1="50" x2="190" y2="30" stroke="#38BDF8" strokeWidth="2" />
          <line x1="68" y1="50" x2="190" y2="50" stroke="#22C55E" strokeWidth="2" />
          <line x1="68" y1="50" x2="190" y2="70" stroke="#EF4444" strokeWidth="2" />
          <text x="195" y="33" fill="#38BDF8" fontSize="8" fontFamily="monospace">400nm</text>
          <text x="195" y="53" fill="#22C55E" fontSize="8" fontFamily="monospace">550nm</text>
          <text x="195" y="73" fill="#EF4444" fontSize="8" fontFamily="monospace">700nm</text>
        </svg>
      ),
    },
    {
      id: 'coherence',
      title: '5. Optical Coherence Tomography (OCT)',
      category: 'Biomedical Imaging',
      icon: <Compass className="w-4 h-4 text-[#FB7185]" />,
      color: '#FB7185',
      badge: 'Medical Diagnostics',
      description: 'Low-coherence interferometry generates non-invasive 3D micrometer-resolution cross-sectional scans of the human retina and living tissue.',
      howItWorks: 'Broadband light with a very short coherence length only produces interference when the reference arm and sample reflection match to within a few micrometers, enabling optical sectioning without radiation.',
      svgDiagram: (
        <svg viewBox="0 0 240 100" className="w-full h-24">
          <rect width="240" height="100" fill="#0B1728" rx="6" />
          {/* Eye model & scan */}
          <path d="M 40 50 Q 80 20, 120 50 Q 80 80, 40 50" fill="#17263B" stroke="#FB7185" strokeWidth="1.5" />
          <circle cx="80" cy="50" r="10" fill="#0B1728" stroke="#38BDF8" strokeWidth="1" />
          {/* Retina scan lines */}
          <path d="M 120 35 C 135 45, 135 55, 120 65" fill="none" stroke="#FB7185" strokeWidth="2" strokeDasharray="2 2" />
          <text x="145" y="45" fill="#FB7185" fontSize="8" fontFamily="monospace">Retinal</text>
          <text x="145" y="58" fill="#FB7185" fontSize="8" fontFamily="monospace">Layers</text>
          <text x="120" y="90" fill="#94A3B8" fontSize="8" textAnchor="middle">Micron-level axial depth resolution</text>
        </svg>
      ),
    },
    {
      id: 'displacement',
      title: '6. Precision Laser Displacement Encoders',
      category: 'Robotics & Nanotech',
      icon: <Zap className="w-4 h-4 text-[#38BDF8]" />,
      color: '#38BDF8',
      badge: 'Nanometer Positioning',
      description: 'Linear optical encoders in CNC machines and semiconductor lithography steppers track motion by counting interference fringe shifts.',
      howItWorks: 'As a grating moves relative to a laser head, each fringe shift corresponds to a linear displacement of exactly d/2. High-speed electronics interpolate fringes to reach sub-nanometer positioning accuracy.',
      svgDiagram: (
        <svg viewBox="0 0 240 100" className="w-full h-24">
          <rect width="240" height="100" fill="#0B1728" rx="6" />
          <rect x="30" y="25" width="180" height="20" fill="#17263B" stroke="#26364D" />
          {[40, 55, 70, 85, 100, 115, 130, 145, 160, 175, 190].map((x) => (
            <line key={x} x1={x} y1="25" x2={x} y2="45" stroke="#38BDF8" strokeWidth="2" />
          ))}
          {/* Read Head */}
          <rect x="90" y="55" width="60" height="30" fill="#07111F" stroke="#38BDF8" strokeWidth="1.5" rx="4" />
          <text x="120" y="73" fill="#38BDF8" fontSize="8" fontFamily="monospace" textAnchor="middle">Read Head</text>
          <line x1="110" y1="55" x2="110" y2="45" stroke="#34D399" strokeWidth="1.5" />
          <line x1="130" y1="55" x2="130" y2="45" stroke="#34D399" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      id: 'quantum',
      title: '7. Matter-Wave Quantum Optics',
      category: 'Fundamental Physics',
      icon: <Atom className="w-4 h-4 text-[#A78BFA]" />,
      color: '#A78BFA',
      badge: 'De Broglie Waves',
      description: "Young's experiment repeated with electrons (Claus Jönsson 1961), neutrons, and massive C₆₀ buckyballs proves wave-particle duality for all matter.",
      howItWorks: 'Even large molecules possess a de Broglie wavelength λ = h / p. When passed through nanoscale silicon nitride slits one by one, they accumulate interference fringes just like photons, confirming quantum probability amplitudes.',
      svgDiagram: (
        <svg viewBox="0 0 240 100" className="w-full h-24">
          <rect width="240" height="100" fill="#0B1728" rx="6" />
          <circle cx="45" cy="50" r="10" fill="#A78BFA" opacity="0.3" />
          <circle cx="45" cy="50" r="5" fill="#A78BFA" />
          <text x="45" y="73" fill="#A78BFA" fontSize="8" textAnchor="middle">C₆₀ Molecule</text>
          <line x1="60" y1="50" x2="100" y2="50" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Nanograting */}
          <line x1="110" y1="20" x2="110" y2="80" stroke="#64748B" strokeWidth="3" />
          <line x1="110" y1="42" x2="110" y2="46" stroke="#0B1728" strokeWidth="4" />
          <line x1="110" y1="54" x2="110" y2="58" stroke="#0B1728" strokeWidth="4" />
          {/* Quantum Hits */}
          <rect x="180" y="20" width="30" height="60" fill="#17263B" stroke="#26364D" />
          <circle cx="195" cy="50" r="2" fill="#A78BFA" />
          <circle cx="192" cy="48" r="1.5" fill="#A78BFA" />
          <circle cx="197" cy="52" r="1.5" fill="#A78BFA" />
          <circle cx="195" cy="35" r="1.5" fill="#A78BFA" />
          <circle cx="195" cy="65" r="1.5" fill="#A78BFA" />
          <text x="145" y="92" fill="#A78BFA" fontSize="8" fontFamily="monospace">λ = h / mv</text>
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header */}
      <div className="border-b border-[#26364D] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9]">Real-World Applications of Wave Interference</h3>
            <p className="text-xs text-[#94A3B8]">
              How Young's double-slit principles drive modern laser metrology, gravitational wave observatories, and nanotechnology.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 7 Application Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-[#0B1728] rounded-xl border border-[#26364D] p-4 flex flex-col justify-between hover:border-[#38BDF8]/50 transition-all hover:shadow-lg space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {card.category}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold border"
                  style={{
                    backgroundColor: `${card.color}15`,
                    borderColor: `${card.color}40`,
                    color: card.color,
                  }}
                >
                  {card.badge}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-[#17263B] border border-[#26364D]">
                  {card.icon}
                </div>
                <h4 className="font-bold text-xs text-white leading-snug">{card.title}</h4>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* SVG Diagram */}
            <div className="rounded-lg overflow-hidden border border-[#26364D] bg-[#07111F]">
              {card.svgDiagram}
            </div>

            <div className="bg-[#101D30] p-2.5 rounded-lg border border-[#26364D] text-[11px] text-slate-400 leading-normal">
              <strong className="text-slate-200">Mechanism: </strong>
              {card.howItWorks}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
