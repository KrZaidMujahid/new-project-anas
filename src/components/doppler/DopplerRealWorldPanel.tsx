import React from 'react';
import { Compass, Radio, Activity, Wind, Eye, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

export const DopplerRealWorldPanel: React.FC = () => {
  const applications = [
    {
      id: 'siren',
      title: '1. Ambulance & Police Sirens',
      type: 'Acoustic Doppler',
      tagColor: 'text-[#FB7185] bg-[#FB7185]/15 border-[#FB7185]/30',
      description:
        'As an emergency vehicle speeds toward you at 30 m/s (~108 km/h), its siren’s wavefronts are compressed, raising the pitch by roughly 10%. As soon as it passes by and recedes, the pitch drops abruptly, creating the classic "wee-woo" pitch-drop phenomenon.',
      formula: 'f_obs = f_s × v / (v ∓ v_s)',
    },
    {
      id: 'vehicles',
      title: '2. Passing Highway Vehicles',
      type: 'Acoustic Doppler',
      tagColor: 'text-[#FBBF24] bg-[#F59E0B]/15 border-[#F59E0B]/30',
      description:
        'When listening to a race car or highway vehicle, the steady roar of its engine and tires sounds noticeably higher in pitch during its approach and immediately lowers into a deeper rumble after passing the observer.',
      formula: 'f_obs = f_s × v / (v - v_s cos θ)',
    },
    {
      id: 'weather',
      title: '3. Doppler Weather Radar (NEXRAD)',
      type: 'Electromagnetic (Microwave)',
      tagColor: 'text-[#38BDF8] bg-[#38BDF8]/15 border-[#38BDF8]/30',
      description:
        'Meteorological radar stations emit pulses of microwave radiation and measure the phase/frequency shift of the echoes bounced back from raindrops and hailstones. This detects rotational wind shear inside supercells, providing critical early warnings for tornadoes.',
      formula: 'Δf = 2 v_radial / λ_radar',
    },
    {
      id: 'medical',
      title: '4. Medical Doppler Ultrasound',
      type: 'Acoustic (Ultrasonic ~2-10 MHz)',
      tagColor: 'text-[#34D399] bg-[#10B981]/15 border-[#10B981]/30',
      description:
        'In cardiology and vascular imaging, ultrasonic waves reflect off circulating red blood cells. By measuring the reflected frequency shift, doctors calculate blood flow velocities in heart valves and detect vascular blockages without invasive surgery.',
      formula: 'v_blood = (Δf · c_tissue) / (2 f_0 · cos θ)',
    },
    {
      id: 'astronomy',
      title: '5. Astronomy: Redshift & Blueshift',
      type: 'Relativistic Electromagnetic',
      tagColor: 'text-[#A78BFA] bg-[#A78BFA]/15 border-[#A78BFA]/30',
      description:
        'Spectral absorption lines of distant galaxies are shifted toward longer wavelengths (redshift), proving that the universe is expanding (Hubble’s Law). Stars orbiting inside binary systems or with exoplanets produce periodic blueshifts and redshifts.',
      formula: '1 + z = √((1 + v/c) / (1 - v/c))',
    },
    {
      id: 'police',
      title: '6. Police Speed Radar & Lidar',
      type: 'Electromagnetic (Radio / Laser)',
      tagColor: 'text-[#F1F5F9] bg-[#17263B] border-[#26364D]',
      description:
        'Traffic radar guns emit a continuous microwave signal (~24 GHz or 35 GHz). The frequency shift of the signal bouncing back from a moving automobile is digitized instantly into a precise speedometer reading in km/h or mph.',
      formula: 'v_target = (Δf · c) / (2 f_radar)',
    },
  ];

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#38BDF8]" />
          <div>
            <h3 className="text-base font-extrabold text-[#F1F5F9] uppercase tracking-wide">
              Doppler Effect in the Real World
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Six transformative applications across acoustics, meteorology, medicine, and cosmology
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 6 Real World Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-[#17263B] border border-[#26364D] hover:border-[#38BDF8]/40 rounded-xl p-4 flex flex-col justify-between transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${app.tagColor}`}>
                  {app.type}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#F1F5F9]">{app.title}</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{app.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#26364D]/60 flex items-center justify-between text-[11px] font-mono text-[#38BDF8]">
              <span className="text-[#94A3B8] text-[10px]">Governing relation:</span>
              <span className="font-bold">{app.formula}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Important Physical Distinction Banner */}
      <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-4 text-xs text-[#94A3B8] flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#F1F5F9] text-sm block">
            Crucial Scientific Distinction: Sound vs Light (Electromagnetic Waves)
          </strong>
          <p className="leading-relaxed">
            Sound requires a physical material medium (air, water, steel). Because the medium defines a preferred rest frame, moving the source through the air is <strong className="text-[#F1F5F9]">not mathematically equivalent</strong> to moving the observer through the air. In contrast, electromagnetic radiation (light, radar) propagates in vacuum at universal speed <code className="font-mono text-[#38BDF8]">c</code> with no medium, so electromagnetic Doppler shift depends strictly on the relative velocity <code className="font-mono text-[#38BDF8]">β = v/c</code> via Special Relativity.
          </p>
        </div>
      </div>
    </div>
  );
};
