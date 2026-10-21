/**
 * EQUATION 1 — Physical Model Assumptions Modal
 * Rigorously explains the mathematical assumptions of the ideal projectile model.
 */

import React from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { MathView } from './MathView';

interface ModelAssumptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelAssumptionsModal: React.FC<ModelAssumptionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-xl bg-[#0b101b] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Physical Model Assumptions
              </h2>
              <p className="text-xs text-slate-400">
                Ideal 2D Ballistic Motion Framework
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close assumptions modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              1. Zero Aerodynamic Drag (Vacuum Trajectory)
            </h3>
            <p className="text-slate-400 pl-5">
              Air resistance is assumed to be zero (<MathView math="F_{\text{drag}} = 0" />).
              Consequently, the horizontal acceleration is identically zero (<MathView math="a_x = 0" />),
              meaning horizontal velocity <MathView math="v_x = u \cos\theta" /> remains strictly constant
              throughout the flight.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              2. Uniform Gravitational Field
            </h3>
            <p className="text-slate-400 pl-5">
              The acceleration due to gravity <MathView math="\vec{g} = -g \hat{j}" /> is constant in magnitude
              and direction across the entire trajectory. Variations with altitude and planetary curvature are
              neglected for short-range ballistic motions.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              3. Point Mass Projectile
            </h3>
            <p className="text-slate-400 pl-5">
              The projectile is modeled as a point mass without rotational inertia, aerodynamic spin
              (Magnus effect), or aerodynamic lift.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              4. Generalized Non-Zero Initial Elevation
            </h3>
            <p className="text-slate-400 pl-5">
              Unlike introductory textbooks that only provide symmetric formulas (<MathView math="h_0 = 0" />),
              Equation 1 accurately solves the generalized quadratic trajectory for arbitrary launch heights
              <MathView math="h_0 \ge 0" />:
            </p>
            <div className="p-2 bg-[#07090e] border border-slate-800 rounded font-mono text-center my-1">
              <MathView math="y(t) = h_0 + u\sin\theta \cdot t - \frac{1}{2}g t^2 = 0" displayMode />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              5. Inclined Plane & Coulomb Friction Mechanics
            </h3>
            <p className="text-slate-400 pl-5">
              The inclined ramp is treated as a rigid, unyielding Euclidean plane at angle <MathView math="\theta" />.
              Dry contact follows the classical Amontons-Coulomb laws: static friction opposes impending motion up to
              threshold <MathView math="f_{s,\max} = \mu_s N" />, and kinetic friction opposes instantaneous relative velocity
              with magnitude <MathView math="f_k = \mu_k N" />, where <MathView math="N = mg\cos\theta" />.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              6. Ideal Simple Harmonic Motion (Hooke's Law & Zero Dissipation)
            </h3>
            <p className="text-slate-400 pl-5">
              The spring obeys Hooke's linear elasticity model (<MathView math="F = -kx" />) with zero mass and infinite fatigue life.
              Mechanical damping, viscous air drag, and internal friction are zero (<MathView math="b = 0" />), guaranteeing strict total mechanical energy conservation (<MathView math="E = K + U = \frac{1}{2}kA^2 = \text{constant}" />).
              For pendulums, the small-angle approximation <MathView math="\sin\theta \approx \theta" /> holds for small deflections (<MathView math="\theta \le 15^\circ" />), yielding true harmonic motion with <MathView math="\omega = \sqrt{g/L}" />.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              7. Coherent Two-Source Wave Interference & Superposition
            </h3>
            <p className="text-slate-400 pl-5">
              Sources S₁ and S₂ are modeled as ideal, monochromatic, continuous point emitters in a linear, isotropic, homogeneous, non-dispersive 2D medium.
              The principle of linear superposition strictly holds (<MathView math="y_R = y_1 + y_2" />).
              Wave velocity <MathView math="v = f\lambda" /> is independent of frequency and amplitude across all radial propagation directions.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              8. Young's Double-Slit Optical Bench & Fraunhofer Wave Diffraction
            </h3>
            <p className="text-slate-400 pl-5">
              Screen distance <MathView math="L \gg d" /> satisfies the Fraunhofer far-field regime (<MathView math="L \gg d^2/\lambda" />), so wavefronts incident on the screen are essentially planar with common ray direction angle <MathView math="\theta" />.
              For central screen positions where <MathView math="y \ll L" />, the paraxial approximation <MathView math="\sin\theta \approx \tan\theta \approx y/L" /> holds with <MathView math="< 0.1\%" /> error.
              Slit width diffraction envelope <MathView math="\beta = \frac{\pi a \sin\theta}{\lambda}" /> modulates the two-slit interference factor <MathView math="\cos^2(\alpha)" />, accounting for finite slit diffraction and missing orders when <MathView math="d/a" /> is an integer ratio.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              9. Kinetic Molecular Theory of Ideal Gases
            </h3>
            <p className="text-slate-400 pl-5">
              Molecules are treated as point masses whose physical volume is negligible relative to the container volume (<MathView math="V_{\text{molecules}} \ll V" />).
              Intermolecular electrostatic potentials and cohesive forces are zero except during instantaneous, frictionless, perfectly elastic collisions conserving total kinetic energy and momentum.
              Collisions with container boundaries transfer momentum (<MathView math="\Delta p = 2mv_x" />), producing macroscopic pressure <MathView math="P = \frac{1}{3}\rho v_{\text{rms}}^2 = \frac{nRT}{V}" />.
              Average translational kinetic energy per molecule depends solely on absolute temperature (<MathView math="\langle E_k \rangle = \frac{3}{2} k_B T" />) independent of molecular species or mass.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              10. Ideal Reversible Carnot Cycle & Thermodynamic Boundaries
            </h3>
            <p className="text-slate-400 pl-5">
              All four stages are quasi-static, internally and externally reversible paths traversed without mechanical friction, turbulence, or viscous dissipation.
              Thermal reservoirs have infinite heat capacity, maintaining strictly invariant temperatures <MathView math="T_H" /> and <MathView math="T_C" /> during isothermal heat exchanges.
              Isothermal heat conduction occurs across infinitesimal temperature gradients (<MathView math="\Delta T \to 0" />).
              Adiabatic expansion and compression stages are perfectly insulated (<MathView math="Q = 0" />) and follow <MathView math="P V^\gamma = \text{constant}" /> and <MathView math="T V^{\gamma - 1} = \text{constant}" /> with constant heat capacity ratio <MathView math="\gamma = C_p / C_v" />.
              The cyclic integral of entropy around the closed loop is exactly zero (<MathView math="\oint \frac{dQ}{T} = 0" />), yielding the maximum theoretical efficiency limit <MathView math="\eta = 1 - T_C / T_H" />.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              11. Bohr Model of the Hydrogen Atom & Quantized Postulates
            </h3>
            <p className="text-slate-400 pl-5">
              Electrons travel in stationary, non-radiating circular orbits with quantized orbital angular momentum <MathView math="L = m_e v r = n \hbar" /> (<MathView math="n \in \{1, 2, \dots, 6\}" />).
              Electrostatic attraction follows Coulomb's law with an infinitely massive stationary proton (<MathView math="M_p \gg m_e" />).
              Relativistic corrections, spin-orbit coupling (fine structure), Lamb shift (QED), and hyperfine nuclear interactions are neglected in the semi-classical approximation.
              Energy levels scale as <MathView math="E_n = -13.60 \text{ eV} / n^2" /> and orbital radii scale as <MathView math="r_n = a_0 n^2" />.
              Transitions satisfy the Einstein-Planck frequency relation <MathView math="\Delta E = h\nu = hc/\lambda" />, perfectly conserving photon energy and momentum.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              12. Einstein's Photoelectric Effect & Quantum Emission Boundaries
            </h3>
            <p className="text-slate-400 pl-5">
              Energy exchange between monochromatic light and metal conduction electrons is strictly one-photon to one-electron (<MathView math="E_{\text{photon}} = hf" />).
              Photoelectric emission occurs without measurable time delay (<MathView math="\Delta t < 10^{-9}\text{ s}" />) if and only if <MathView math="hf \ge \phi" />, where <MathView math="\phi" /> is the characteristic surface work function.
              Maximum kinetic energy obeys Einstein's conservation relation <MathView math="K_{\max} = hf - \phi" />, with stopping potential magnitude <MathView math="e V_{\text{stop}} = K_{\max}" />.
              Light intensity controls the rate of incident photons per second (photon flux) and saturation current, but has strictly zero influence on the kinetic energy of individual electrons.
              Electron speeds are evaluated in the nonrelativistic regime (<MathView math="v_{\max} = \sqrt{2 K_{\max} / m_e}" />), which is accurate to over 99.99% for optical and near-UV photon energies.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#07090e] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
