import React from "react";
import { PlanBData } from "../types";
import { ArrowLeft, ArrowRight, ToggleLeft, ToggleRight, RefreshCw, AlertTriangle, MapPin } from "lucide-react";
import { sayMoneyInIndianWay } from "../utils/currency";

export const PlanBLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" className="stroke-[#d4af37]" strokeWidth="2.2" fill="none" />
    <path
      d="M8 7h4.5a2.5 2.5 0 0 1 0 5H8h4.5a2.5 2.5 0 0 1 0 5H8V7Z"
      className="stroke-[#d4af37]"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M16.5 6.5l2 2-2 2"
      className="stroke-[#d4af37]"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface PlanBStepProps {
  data: PlanBData;
  onChange: (data: Partial<PlanBData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function PlanBStep({ data, onChange, onNext, onPrev }: PlanBStepProps) {
  const handleChange = (field: keyof PlanBData, value: any) => {
    onChange({ [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.title || !data.description || !data.reason) {
      alert("Please fill in all core text fields.");
      return;
    }
    onNext();
  };

  const formatINR = (val?: number) => {
    if (val === undefined || val === null || isNaN(val)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const titleLen = data.title?.length || 0;
  const descriptionLen = data.description?.length || 0;
  const reasonLen = data.reason?.length || 0;
  const targetCountryLen = data.targetCountry?.length || 0;
  const targetCityLen = data.targetCity?.length || 0;

  // Warning checks on-the-fly
  const inc3 = data.expectedIncome3Months || 0;
  const inc6 = data.expectedIncome6Months || 0;
  const inc12 = data.expectedIncome12Months || 0;

  const isIncomeNonSequential =
    inc12 < inc6 ||
    inc6 < inc3;

  const isQuittingWithNoIncome =
    data.iWillQuitMyJob &&
    inc3 === 0 &&
    inc6 === 0 &&
    inc12 === 0;

  const isAggressiveTimeline =
    data.iWillQuitMyJob &&
    (data.timelineMonths || 0) <= 3;

  return (
    <form id="planb-step-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-app-border pb-4">
        <h2 className="text-xl font-serif text-app-main flex items-center gap-2.5 font-semibold">
          <PlanBLogo className="w-5 h-5" />
          <span>The Proposed Plan B</span>
        </h2>
        <p className="text-xs text-app-dim mt-1 uppercase tracking-wider">
          Describe the alternative career option, product launch, startup role, or study plan you wish to evaluate.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="planBTitle" className="block text-xs uppercase tracking-widest text-app-dim">
              Plan B Title *
            </label>
            <span className={`text-[10px] font-mono ${titleLen > 150 ? "text-app-error font-bold" : "text-app-main/35"}`}>
              {titleLen}/150
            </span>
          </div>
          <input
            id="planBTitle"
            type="text"
            required
            maxLength={150}
            value={data.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g., Launching an independent Coffee Roastery, switching to freelance design"
            className="w-full px-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-sans"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="planBDescription" className="block text-xs uppercase tracking-widest text-app-dim">
              Detailed Description / Pitch *
            </label>
            <span className={`text-[10px] font-mono ${descriptionLen > 2000 ? "text-app-error font-bold" : "text-app-main/35"}`}>
              {descriptionLen}/2000
            </span>
          </div>
          <textarea
            id="planBDescription"
            rows={3}
            required
            maxLength={2000}
            value={data.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="How does it work? Who are the clients/employers? What will you do day-to-day?"
            className="w-full px-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-sans"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="planBReason" className="block text-xs uppercase tracking-widest text-app-dim font-semibold text-app-main">
              Main Reason / Motivation for validation *
            </label>
            <span className={`text-[10px] font-mono ${reasonLen > 1000 ? "text-app-error font-bold" : "text-app-main/35"}`}>
              {reasonLen}/1000
            </span>
          </div>
          <textarea
            id="planBReason"
            rows={2}
            required
            maxLength={1000}
            value={data.reason || ""}
            onChange={(e) => handleChange("reason", e.target.value)}
            placeholder="e.g., Burnout, career flatness, regional expansion, or pursuing a dream"
            className="w-full px-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-sans"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 pt-2">
          {/* Quit Job Checklist */}
          <div>
            <div
              id="quit-job-card"
              onClick={() => {
                const nextVal = !data.iWillQuitMyJob;
                onChange({ iWillQuitMyJob: nextVal });
              }}
              className={`p-5 rounded-lg border transition-all cursor-pointer flex gap-4 ${
                data.iWillQuitMyJob
                  ? "bg-amber-950/20 border-app-gold/40 text-app-main"
                  : "bg-app-subtle border-app-border-light hover:bg-app-input text-app-muted"
              }`}
            >
              <div className="pt-0.5">
                {data.iWillQuitMyJob ? (
                  <ToggleRight className="w-6 h-6 text-app-gold flex-shrink-0" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-app-dim flex-shrink-0" />
                )}
              </div>
              <div>
                <div className="font-semibold text-sm tracking-wide text-app-main">I will quit my current job</div>
                <div className="text-xs text-app-dim mt-1 leading-relaxed">
                  Check this if you plan to completely resign or commit full-time to Plan B immediately.
                </div>
              </div>
            </div>
            
            {!data.iWillQuitMyJob && (
              <div className="mt-3 px-3 py-1.5 bg-emerald-950/20 border border-emerald-500/20 text-app-success font-semibold font-mono text-[10px] uppercase rounded tracking-widest text-center">
                Side hustle mode — keeping current job.
              </div>
            )}
            
            {data.iWillQuitMyJob && (
              <div className="mt-3 px-3 py-1.5 bg-rose-950/20 border border-app-error-border text-app-error font-semibold font-mono text-[10px] uppercase rounded tracking-widest text-center">
                Full-time leap mode — resigning from job.
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-app-border pt-5">
          <h3 className="font-serif text-app-main text-md mb-3 flex items-center gap-2 font-semibold text-app-main/90">
            <span>Income Generation Roadmap & Timeline *</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 col-span-1">
            <div>
              <label htmlFor="timelineMonths" className="block text-xs uppercase tracking-wider text-app-dim mb-2 font-semibold">
                Timeline (Months)
              </label>
              <div className="flex items-center bg-app-input border border-app-border rounded overflow-hidden h-[46px]">
                <button
                  id="timeline-decrease-btn"
                  type="button"
                  onClick={() => handleChange("timelineMonths", Math.max(1, (data.timelineMonths || 1) - 1))}
                  className="px-3.5 h-full bg-app-subtle hover:bg-app-subtle-hover active:bg-white/15 text-app-main transition-colors font-mono text-base font-bold select-none border-r border-app-border cursor-pointer"
                >
                  -
                </button>
                <input
                  id="timelineMonths"
                  type="number"
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
                  min="1"
                  max="120"
                  required
                  value={data.timelineMonths || ""}
                  onChange={(e) => handleChange("timelineMonths", Math.max(1, parseInt(e.target.value) || 1))}
                  placeholder="e.g., 6"
                  className="w-full bg-transparent text-center border-none text-app-main focus:outline-none placeholder-white/20 text-sm font-mono focus:ring-0 focus:border-none"
                />
                <button
                  id="timeline-increase-btn"
                  type="button"
                  onClick={() => handleChange("timelineMonths", Math.min(120, (data.timelineMonths || 0) + 1))}
                  className="px-3.5 h-full bg-app-subtle hover:bg-app-subtle-hover active:bg-white/15 text-app-main transition-colors font-mono text-base font-bold select-none border-l border-app-border cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="expectedIncome3Months" className="block text-xs uppercase tracking-wider text-app-dim mb-2">
                Income (Month 3)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-app-dim text-xs font-mono">₹</span>
                <input
                  id="expectedIncome3Months"
                  type="number"
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
                  min="0"
                  required
                  value={data.expectedIncome3Months === undefined || data.expectedIncome3Months === null ? "" : data.expectedIncome3Months}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("expectedIncome3Months", val === "" ? undefined : (parseFloat(val) >= 0 ? parseFloat(val) : 0));
                  }}
                  className="w-full pl-6 pr-3 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
                />
              </div>
              <p className="text-[10px] text-app-dim mt-1 font-mono tracking-widest">
                {formatINR(data.expectedIncome3Months)}
                {data.expectedIncome3Months !== undefined && data.expectedIncome3Months > 0 && (
                  <span className="text-app-gold ml-1.5 font-sans font-medium uppercase text-[9px]">
                    ({sayMoneyInIndianWay(data.expectedIncome3Months)})
                  </span>
                )}
              </p>
            </div>

            <div>
              <label htmlFor="expectedIncome6Months" className="block text-xs uppercase tracking-wider text-app-dim mb-2">
                Income (Month 6)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-app-dim text-xs font-mono">₹</span>
                <input
                  id="expectedIncome6Months"
                  type="number"
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
                  min="0"
                  required
                  value={data.expectedIncome6Months === undefined || data.expectedIncome6Months === null ? "" : data.expectedIncome6Months}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("expectedIncome6Months", val === "" ? undefined : (parseFloat(val) >= 0 ? parseFloat(val) : 0));
                  }}
                  className="w-full pl-6 pr-3 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
                />
              </div>
              <p className="text-[10px] text-app-dim mt-1 font-mono tracking-widest">
                {formatINR(data.expectedIncome6Months)}
                {data.expectedIncome6Months !== undefined && data.expectedIncome6Months > 0 && (
                  <span className="text-app-gold ml-1.5 font-sans font-medium uppercase text-[9px]">
                    ({sayMoneyInIndianWay(data.expectedIncome6Months)})
                  </span>
                )}
              </p>
            </div>

            <div>
              <label htmlFor="expectedIncome12Months" className="block text-xs uppercase tracking-wider text-app-dim mb-2">
                Income (Month 12)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-app-dim text-xs font-mono">₹</span>
                <input
                  id="expectedIncome12Months"
                  type="number"
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
                  min="0"
                  required
                  value={data.expectedIncome12Months === undefined || data.expectedIncome12Months === null ? "" : data.expectedIncome12Months}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("expectedIncome12Months", val === "" ? undefined : (parseFloat(val) >= 0 ? parseFloat(val) : 0));
                  }}
                  className="w-full pl-6 pr-3 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
                />
              </div>
              <p className="text-[10px] text-app-dim mt-1 font-mono tracking-widest">
                {formatINR(data.expectedIncome12Months)}
                {data.expectedIncome12Months !== undefined && data.expectedIncome12Months > 0 && (
                  <span className="text-app-gold ml-1.5 font-sans font-medium uppercase text-[9px]">
                    ({sayMoneyInIndianWay(data.expectedIncome12Months)})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-app-border pt-5 mt-4">
          <h3 className="text-md font-serif text-app-main flex items-center gap-2 mb-3 font-semibold text-app-main/90">
            <MapPin className="w-4 h-4 text-app-gold" />
            <span>Target Geographies <span className="text-xs text-app-dim font-serif font-light font-normal italic">(Optional)</span></span>
          </h3>
          <p className="text-xs text-app-dim mb-4 uppercase tracking-wider">
            Optional. Specify if your Plan B targets an international or distinct regional market.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="targetCountry" className="block text-xs uppercase tracking-widest text-app-dim">
                  Target Country
                </label>
                <span className={`text-[10px] font-mono ${targetCountryLen > 80 ? "text-app-error font-bold" : "text-app-main/35"}`}>
                  {targetCountryLen}/80
                </span>
              </div>
              <input
                id="targetCountry"
                type="text"
                maxLength={80}
                value={data.targetCountry || ""}
                onChange={(e) => onChange({ targetCountry: e.target.value })}
                placeholder="e.g., Singapore"
                className="w-full px-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="targetCity" className="block text-xs uppercase tracking-widest text-app-dim">
                  Target City
                </label>
                <span className={`text-[10px] font-mono ${targetCityLen > 80 ? "text-app-error font-bold" : "text-app-main/35"}`}>
                  {targetCityLen}/80
                </span>
              </div>
              <input
                id="targetCity"
                type="text"
                maxLength={80}
                value={data.targetCity || ""}
                onChange={(e) => onChange({ targetCity: e.target.value })}
                placeholder="e.g., Singapore"
                className="w-full px-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Warnings area */}
      {isIncomeNonSequential && (
        <div className="bg-amber-950/20 border border-amber-600/30 text-amber-400 p-3 rounded flex gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
          <span>
            <strong>Income trend warning:</strong> Your projected Plan B income is not non-decreasing over time. Expected returns in Month 12 should ideally be greater than or equal to Month 6 and Month 3.
          </span>
        </div>
      )}

      {isQuittingWithNoIncome && (
        <div className="bg-app-error-bg border border-rose-600/35 text-app-error-muted p-3 rounded flex gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-app-error mt-0.5" />
          <span>
            <strong>No income plan warning:</strong> You marked you will quit your job, but expected Plan B incomes are zero.
          </span>
        </div>
      )}

      {isAggressiveTimeline && (
        <div className="bg-amber-950/20 border border-amber-600/30 text-amber-400 p-3 rounded flex gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
          <span>
            <strong>Aggressive timeline warning:</strong> Resigning full-time with a transition timeline of under 3 months is extremely aggressive and offers low margin for preparation errors.
          </span>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t border-app-border">
        <button
          id="planb-prev-btn"
          type="button"
          onClick={onPrev}
          className="px-6 py-2.5 bg-app-subtle hover:bg-app-subtle-hover text-app-main text-xs font-bold uppercase tracking-widest border border-app-border transition-colors flex items-center gap-2 rounded-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          id="planb-next-btn"
          type="submit"
          className="px-6 py-2.5 bg-app-main hover:opacity-90 text-app-base text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 rounded-sm cursor-pointer"
        >
          <span>Continue to Financials</span>
          <ArrowRight className="w-4 h-4 text-app-base" />
        </button>
      </div>
    </form>
  );
}
