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
      icon: <Coins className="w-5 h-5 text-app-gold" />,
      title: "Runway Stress Mapping",
      desc: "Simulate cash-reserve runway depletion based on actual current burn rate, monthly liabilities, and emergency buffers.",
    },
    {
      icon: <img src="/favicon.svg" alt="Validator" className="w-5 h-5 opacity-90" />,
      title: "Stepwise Income Verification",
      desc: "Model sequential revenue milestones at Months 3, 6, and 12, mapping progress directly against your downside targets.",
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-app-success" />,
      title: "Decision Reversibility Index",
      desc: "Evaluate the downstream career cost of returning to your current field or industry if Plan B requires a fallback pivot.",
    },
    {
      icon: <BrainCircuit className="w-5 h-5 text-indigo-400" />,
      title: "Psychological Pressure Profiling",
      desc: "Analyze your internal coping safety margins, real downside tolerances, and family expectation variables.",
    },
    {
      icon: <MapPin className="w-5 h-5 text-app-gold" />,
      title: "Target Market Geographies",
      desc: "Assess financial targets under country-specific cost-of-living differences and distinct regional demand parameters.",
    },
    {
      icon: <FileSearch className="w-5 h-5 text-app-success-muted" />,
      title: "CV / Resume Wage Alignment",
      desc: "Upload credentials voluntarily to parse skillsets and cross-check expected wages against active industry data.",
    },
  ];

  return (
    <div id="landing-page-wrapper" className="space-y-12 py-4 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto pt-6">


        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-app-main tracking-tight leading-tight">
          Validate your <span className=" text-app-gold">Plan&nbsp;B</span> before you start
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-app-muted leading-relaxed max-w-2xl mx-auto font-sans">
          Contemplating a high-risk career pivot, new venture, or sabbatical? The Plan B Validator is a rigorous, scenario-based transition stress tester designed to cross-examine your financials, psychological buffers, and market parameters.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="start-validator-btn"
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded bg-app-gold hover:brightness-90 text-app-base font-semibold text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Start Analysis</span>
            <ArrowRight className="w-4 h-4 text-app-base" />
          </button>
          
          <div className="text-[11px] font-mono tracking-widest text-app-dim uppercase">
            ESTIMATED RUN TIME: 4-5 MIN
          </div>
        </div>
      </div>

      {/* Decorative Blueprint Line Divider */}
      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-app-border-light"></div>
        <span className="flex-shrink mx-4 text-[9px] font-mono tracking-[0.25em] text-app-dim uppercase select-none">
          SYSTEM PILLARS
        </span>
        <div className="flex-grow border-t border-app-border-light"></div>
      </div>

      {/* Bento-style Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {pillars.map((pillar, idx) => (
          <div 
            key={idx}
            className="bg-app-subtle border border-app-border-light rounded-lg p-5 space-y-3.5 hover:bg-app-subtle hover:border-app-border transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-sm bg-app-input flex items-center justify-center border border-app-border-light">
              {pillar.icon}
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-app-main tracking-wide font-serif">
                {pillar.title}
              </h3>
              <p className="text-xs text-app-muted leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional value block / Trust parameters */}
      <div className="bg-app-subtle border border-app-border-light rounded-lg p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <h3 className="text-base font-serif font-bold text-app-main tracking-wide">
            Scenario Modeling & Secure Storage
          </h3>
          <p className="text-xs text-app-muted leading-relaxed">
            All details remain local inside your physical browser session draft. Upon validation, the engine performs stress test calculations, live regional database searches, and simulated scenario stresses to deliver an impartial Transition Feasibility Report.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 text-app-success/90 text-xs font-semibold px-3 py-2 bg-emerald-950/20 border border-app-success-border rounded-md w-full sm:w-auto justify-center">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Local Draft Autosave</span>
          </div>
          <div className="flex items-center gap-2 text-app-gold/90 text-xs font-semibold px-3 py-2 bg-app-gold/10 border border-app-gold/10 rounded-md w-full sm:w-auto justify-center">
            <Compass className="w-4 h-4 flex-shrink-0" />
            <span>AI Simulation Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
