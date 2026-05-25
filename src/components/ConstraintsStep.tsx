import React from "react";
import { ConstraintsData } from "../types";
import { ShieldCheck, ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { sayMoneyInIndianWay } from "../utils/currency";

interface ConstraintsStepProps {
  data: ConstraintsData;
  onChange: (data: Partial<ConstraintsData>) => void;
  onNext: () => void;
  onPrev: () => void;
  expectedIncome12Months?: number;
}

export default function ConstraintsStep({
  data,
  onChange,
  onNext,
  onPrev,
  expectedIncome12Months = 0,
}: ConstraintsStepProps) {
  const handleChange = (field: keyof ConstraintsData, value: any) => {
    onChange({ [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.successDefinition || !data.biggestFear || !data.acceptableDownside) {
      alert("Please enter brief text descriptions.");
      return;
    }
    onNext();
  };

  const formatINR = (val: number) => {
    if (isNaN(val)) return "0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const successLen = data.successDefinition?.length || 0;
  const fearLen = data.biggestFear?.length || 0;
  const downsideLen = data.acceptableDownside?.length || 0;

  // Cross check warning
  const isMinimumSalaryMismatch = data.minimumAcceptableSalary > expectedIncome12Months;

  return (
    <form id="constraints-step-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-app-border pb-4">
        <h2 className="text-xl font-serif text-app-main flex items-center gap-2.5 font-semibold">
          <ShieldCheck className="w-5 h-5 text-app-gold" />
          <span>Boundaries & Constraints</span>
        </h2>
        <p className="text-xs text-app-dim mt-1 uppercase tracking-wider">
          Define your risk thresholds, criteria for failure or pivot, and family constraints down the line.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="successDefinition" className="block text-xs uppercase tracking-widest text-app-dim">
              How do you define success for Plan B? *
            </label>
            <span className={`text-[10px] font-mono ${successLen > 1000 ? "text-app-error font-bold" : "text-app-main/35"}`}>
              {successLen}/1000
            </span>
          </div>
          <textarea
            id="successDefinition"
            rows={2}
            required
            maxLength={1000}
            value={data.successDefinition || ""}
            onChange={(e) => handleChange("successDefinition", e.target.value)}
            placeholder="e.g., Making ₹80k/month by month 6, launching the beta roaster with 10 recurring shops"
            className="w-full px-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-sans"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="biggestFear" className="block text-xs uppercase tracking-widest text-app-dim">
              What is your biggest fear or failure scenario? *
            </label>
            <span className={`text-[10px] font-mono ${fearLen > 1000 ? "text-app-error font-bold" : "text-app-main/35"}`}>
              {fearLen}/1000
            </span>
          </div>
          <textarea
            id="biggestFear"
            rows={2}
            required
            maxLength={1000}
            value={data.biggestFear || ""}
            onChange={(e) => handleChange("biggestFear", e.target.value)}
            placeholder="e.g., Depleting all my liquid cash reserve, having to restart job hunting in a panic"
            className="w-full px-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-sans"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="acceptableDownside" className="block text-xs uppercase tracking-widest text-app-dim font-semibold text-app-main">
              What is your acceptable downside / recovery plan? *
            </label>
            <span className={`text-[10px] font-mono ${downsideLen > 1000 ? "text-app-error font-bold" : "text-app-main/35"}`}>
              {downsideLen}/1000
            </span>
          </div>
          <textarea
            id="acceptableDownside"
            rows={2}
            required
            maxLength={1000}
            value={data.acceptableDownside || ""}
            onChange={(e) => handleChange("acceptableDownside", e.target.value)}
            placeholder="e.g., Re-apply for corporate roles, or establish consulting project on weekends"
            className="w-full px-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-sans"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="minimumAcceptableSalary" className="block text-xs uppercase tracking-widest text-app-dim mb-2 font-semibold text-app-main">
              Minimum acceptable monthly salary / cash flow *
            </label>
            <div className="relative rounded">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-app-dim text-xs font-mono">₹</span>
              <input
                id="minimumAcceptableSalary"
                type="number"
                onWheel={(e) => (e.target as HTMLElement).blur()}
                onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
                min="0"
                required
                value={data.minimumAcceptableSalary === undefined || data.minimumAcceptableSalary === null ? "" : data.minimumAcceptableSalary}
                onChange={(e) => handleChange("minimumAcceptableSalary", parseFloat(e.target.value) || 0)}
                placeholder="e.g., 50,000"
                className="w-full pl-8 pr-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
              />
            </div>
            <p className="text-[10px] text-app-dim mt-1 font-mono tracking-widest">
              {formatINR(data.minimumAcceptableSalary)}
              {data.minimumAcceptableSalary > 0 && (
                <span className="text-app-gold ml-2 font-sans font-medium uppercase text-[10px]">
                  ({sayMoneyInIndianWay(data.minimumAcceptableSalary)})
                </span>
              )}
            </p>
          </div>

          <div>
            <label htmlFor="acceptableMonthsWithoutIncome" className="block text-xs uppercase tracking-widest text-app-dim mb-2">
              Max Months comfortable with NO income *
            </label>
            <input
              id="acceptableMonthsWithoutIncome"
              type="number"
              onWheel={(e) => (e.target as HTMLElement).blur()}
              onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
              min="0"
              max="120"
              required
              value={data.acceptableMonthsWithoutIncome === undefined || data.acceptableMonthsWithoutIncome === null ? "" : data.acceptableMonthsWithoutIncome}
              onChange={(e) => {
                const parsed = parseInt(e.target.value);
                handleChange("acceptableMonthsWithoutIncome", isNaN(parsed) ? undefined : parsed);
              }}
              placeholder="e.g., 6"
              className="w-full px-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
            />
          </div>
        </div>

        {/* Rating for Family Pressure Level 1-5 */}
        <div className="bg-app-panel border border-app-border-light rounded-lg p-5 mt-2">
          <label className="block text-sm font-serif text-app-main mb-1 font-semibold">
            External / Family Pressure level (1 to 5) *
          </label>
          <span className="text-xs text-app-dim uppercase tracking-wide block mb-4">
            How much pressure or pushback are you facing from parents, spouse, or dependents regarding this venture?
          </span>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((level) => {
              const ratingLabels = ["None", "Mild", "Neutral", "Moderate", "Severe"];
              return (
                <button
                  key={level}
                  type="button"
                  id={`pressure-level-btn-${level}`}
                  onClick={() => handleChange("familyPressureLevel", level)}
                  className={`flex-1 py-3 text-center rounded transition-all cursor-pointer ${
                    data.familyPressureLevel === level
                      ? "bg-app-gold text-app-base font-bold shadow-md"
                      : "bg-app-subtle border border-app-border text-app-muted hover:bg-app-subtle"
                  }`}
                >
                  <div className="text-lg font-bold font-mono">{level}</div>
                  <div className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-1 hidden sm:block">
                    {ratingLabels[level - 1]}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-xs text-app-gold font-medium mt-3 text-center">
            Selected Support/Friction Level: {["None / Full Support", "Mild Concern", "Neutral Profile", "Moderate Pressure", "Severe Pushback"][data.familyPressureLevel - 1]}
          </div>
        </div>
      </div>

      {isMinimumSalaryMismatch && (
        <div className="bg-amber-950/20 border border-amber-600/30 text-amber-400 p-3 rounded flex gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
          <span>
            <strong>Goal gap warning:</strong> Your minimum acceptable monthly salary target ({formatINR(data.minimumAcceptableSalary)}) is higher than your expected Plan B income at Month 12 ({formatINR(expectedIncome12Months)}). Adjust your targets or raise expectations.
          </span>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t border-app-border">
        <button
          id="constraints-prev-btn"
          type="button"
          onClick={onPrev}
          className="px-6 py-2.5 bg-app-subtle hover:bg-app-subtle-hover text-app-main text-xs font-bold uppercase tracking-widest border border-app-border transition-colors flex items-center gap-2 rounded-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          id="constraints-next-btn"
          type="submit"
          className="px-6 py-2.5 bg-app-main hover:opacity-90 text-app-base text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 rounded-sm cursor-pointer"
        >
          <span>Continue to Psychology</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
