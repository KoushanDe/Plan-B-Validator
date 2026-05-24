import React from "react";
import { 
  ArrowRight, 
  Coins, 
  ShieldAlert, 
  RefreshCw, 
  BrainCircuit, 
  FileSearch, 
  MapPin, 
  Compass,
  CheckCircle2
} from "lucide-react";
import { PlanBLogo } from "./PlanBStep";

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const pillars = [
    {
      icon: <Coins className="w-5 h-5 text-[#d4af37]" />,
      title: "Runway Stress Mapping",
      desc: "Simulate cash-reserve runway depletion based on actual current burn rate, monthly liabilities, and emergency buffers.",
    },
    {
      icon: <PlanBLogo className="w-5 h-5" />,
      title: "Stepwise Income Verification",
      desc: "Model sequential revenue milestones at Months 3, 6, and 12, mapping progress directly against your downside targets.",
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-emerald-400" />,
      title: "Decision Reversibility Index",
      desc: "Evaluate the downstream career cost of returning to your current field or industry if Plan B requires a fallback pivot.",
    },
    {
      icon: <BrainCircuit className="w-5 h-5 text-indigo-400" />,
      title: "Psychological Pressure Profiling",
      desc: "Analyze your internal coping safety margins, real downside tolerances, and family expectation variables.",
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#d4af37]" />,
      title: "Target Market Geographies",
      desc: "Assess financial targets under country-specific cost-of-living differences and distinct regional demand parameters.",
    },
    {
      icon: <FileSearch className="w-5 h-5 text-emerald-300" />,
      title: "CV / Resume Wage Alignment",
      desc: "Upload credentials voluntarily to parse skillsets and cross-check expected wages against active industry data.",
    },
  ];

  return (
    <div id="landing-page-wrapper" className="space-y-12 py-4 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto pt-6">


        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
          Validate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e3a9] to-[#d4af37]">Plan&nbsp;B</span> before you start
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-white/60 leading-relaxed max-w-2xl mx-auto font-sans">
          Contemplating a high-risk career pivot, new venture, or sabbatical? The Plan B Validator is a rigorous, scenario-based transition stress tester designed to cross-examine your financials, psychological buffers, and market parameters.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="start-validator-btn"
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded bg-[#d4af37] hover:bg-[#c29e2f] text-black font-semibold text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Initiate Stress Test</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
          
          <div className="text-[11px] font-mono tracking-widest text-white/30 uppercase">
            ESTIMATED RUN TIME: 4-5 MIN
          </div>
        </div>
      </div>

      {/* Decorative Blueprint Line Divider */}
      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-white/5"></div>
        <span className="flex-shrink mx-4 text-[9px] font-mono tracking-[0.25em] text-white/20 uppercase select-none">
          SYSTEM PILLARS
        </span>
        <div className="flex-grow border-t border-white/5"></div>
      </div>

      {/* Bento-style Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {pillars.map((pillar, idx) => (
          <div 
            key={idx}
            className="bg-white/[0.01] border border-white/5 rounded-lg p-5 space-y-3.5 hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-sm bg-white/[0.03] flex items-center justify-center border border-white/5">
              {pillar.icon}
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-white/95 tracking-wide font-serif">
                {pillar.title}
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional value block / Trust parameters */}
      <div className="bg-[#white]/[0.01] border border-white/5 rounded-lg p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <h3 className="text-base font-serif font-bold text-white tracking-wide">
            Scenario Modeling & Secure Storage
          </h3>
          <p className="text-xs text-white/70 leading-relaxed">
            All details remain local inside your physical browser session draft. Upon validation, the engine performs stress test calculations, live regional database searches, and simulated scenario stresses to deliver an impartial Transition Feasibility Report.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 text-emerald-400/90 text-xs font-semibold px-3 py-2 bg-emerald-950/20 border border-emerald-500/10 rounded-md w-full sm:w-auto justify-center">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Local Draft Autosave</span>
          </div>
          <div className="flex items-center gap-2 text-[#d4af37]/90 text-xs font-semibold px-3 py-2 bg-[#d4af37]/10 border border-[#d4af37]/10 rounded-md w-full sm:w-auto justify-center">
            <Compass className="w-4 h-4 flex-shrink-0" />
            <span>AI Simulation Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
