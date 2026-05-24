import React, { useState, useEffect } from "react";
import { FinancialsData } from "../types";
import { Landmark, ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";
import { sayMoneyInIndianWay } from "../utils/currency";
import { getUserId } from "../utils/userId";

interface FinancialsStepProps {
  data: FinancialsData;
  onChange: (data: Partial<FinancialsData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function FinancialsStep({ data, onChange, onNext, onPrev }: FinancialsStepProps) {
  const [liveRunway, setLiveRunway] = useState<number | null>(null);
  const [loadingRunway, setLoadingRunway] = useState<boolean>(false);

  // Parse standard inputs cleanly
  const handleChange = (field: keyof FinancialsData, value: number | undefined) => {
    onChange({ [field]: value });
  };

  // Safe client-side mathematical fallback
  const calculateLocalRunway = () => {
    const totalOutflow = (data.monthlyExpenses || 0) + (data.debtObligations || 0);
    if (!totalOutflow || !data.liquidSavings) return 0;
    // Survival formula matching Rule 5 exactly
    const baseRunway = data.liquidSavings / totalOutflow;
    return parseFloat(baseRunway.toFixed(1));
  };

  // Debounced API runway calculation
  useEffect(() => {
    const totalOutflow = (data.monthlyExpenses || 0) + (data.debtObligations || 0);
    if (!data.liquidSavings || totalOutflow <= 0) {
      setLiveRunway(0);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingRunway(true);
      try {
        const response = await fetch("/api/runway/calculate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": getUserId(),
          },
          body: JSON.stringify({
            liquidSavings: data.liquidSavings,
            monthlyExpenses: data.monthlyExpenses,
            debtObligations: data.debtObligations,
            dependents: data.dependents,
          }),
        });

        if (response.ok) {
          const resJson = await response.json();
          // API returns runwayMonths or similar
          const months = resJson.runwayMonths ?? resJson.months ?? calculateLocalRunway();
          setLiveRunway(months);
          onChange({ emergencyFundMonths: months });
        } else {
          setLiveRunway(calculateLocalRunway());
        }
      } catch (err) {
        setLiveRunway(calculateLocalRunway());
      } finally {
        setLoadingRunway(false);
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(timer);
  }, [data.liquidSavings, data.monthlyExpenses, data.debtObligations, data.dependents]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  // Format currency in Indian Style (INR) or international fallback
  const formatINR = (val?: number) => {
    if (val === undefined || val === null || isNaN(val)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getRunwayColor = (val: number) => {
    if (val < 4) return "text-rose-400";
    if (val < 9) return "text-orange-400";
    if (val <= 14) return "text-yellow-400";
    return "text-emerald-400";
  };

  const runwayValue = liveRunway !== null ? liveRunway : calculateLocalRunway();

  return (
    <form id="financials-step-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-serif text-white flex items-center gap-2.5">
          <Landmark className="w-5 h-5 text-[#d4af37]" />
          <span>Financial Position & Resilience</span>
        </h2>
        <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">
          To validate if you can take a career risk, we need to stress-test your current cash reserve.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="monthlyIncome" className="block text-xs uppercase tracking-widest text-white/40 mb-2">
            Current Monthly Income * <span className="text-[10px] text-white/30 italic font-light font-serif">(post-tax)</span>
          </label>
          <div className="relative rounded">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-white/40 text-sm">₹</span>
            </div>
            <input
              id="monthlyIncome"
              type="number"
              min="0"
              required
              value={data.monthlyIncome || ""}
              onChange={(e) => handleChange("monthlyIncome", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 1,50,050"
              className="w-full pl-8 pr-4 py-3 rounded bg-white/[0.03] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
            />
          </div>
          <p className="text-[10px] text-white/40 mt-1 font-mono tracking-widest">
            {formatINR(data.monthlyIncome)}
            {data.monthlyIncome > 0 && (
              <span className="text-[#d4af37] ml-2 font-sans font-medium uppercase text-[10px]">
                ({sayMoneyInIndianWay(data.monthlyIncome)})
              </span>
            )}
          </p>
        </div>

        <div>
          <label htmlFor="liquidSavings" className="block text-xs uppercase tracking-widest text-white/40 mb-2">
            Total Liquid Cash/Savings * <span className="text-[10px] text-white/30 italic font-light font-serif">(accessible now)</span>
          </label>
          <div className="relative rounded">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-white/40 text-sm">₹</span>
            </div>
            <input
              id="liquidSavings"
              type="number"
              min="0"
              required
              value={data.liquidSavings || ""}
              onChange={(e) => handleChange("liquidSavings", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 6,00,000"
              className="w-full pl-8 pr-4 py-3 rounded bg-white/[0.03] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
            />
          </div>
          <p className="text-[10px] text-[#d4af37] mt-1 font-mono tracking-widest font-semibold">
            {formatINR(data.liquidSavings)} Available
            {data.liquidSavings > 0 && (
              <span className="text-white/60 ml-2 font-sans font-medium uppercase text-[10px]">
                ({sayMoneyInIndianWay(data.liquidSavings)})
              </span>
            )}
          </p>
        </div>

        <div>
          <label htmlFor="monthlyExpenses" className="block text-xs uppercase tracking-widest text-white/40 mb-2">
            Current Monthly Expenses * <span className="text-[10px] text-white/30 italic font-light font-serif">(rent, bills, pantry)</span>
          </label>
          <div className="relative rounded">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-white/40 text-sm">₹</span>
            </div>
            <input
              id="monthlyExpenses"
              type="number"
              min="0"
              required
              value={data.monthlyExpenses || ""}
              onChange={(e) => handleChange("monthlyExpenses", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 60,000"
              className="w-full pl-8 pr-4 py-3 rounded bg-white/[0.03] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
            />
          </div>
          <p className="text-[10px] text-white/40 mt-1 font-mono tracking-widest">
            {formatINR(data.monthlyExpenses)}
            {data.monthlyExpenses > 0 && (
              <span className="text-[#d4af37] ml-2 font-sans font-medium uppercase text-[10px]">
                ({sayMoneyInIndianWay(data.monthlyExpenses)})
              </span>
            )}
          </p>
        </div>

        <div>
          <label htmlFor="dependents" className="block text-xs uppercase tracking-widest text-white/40 mb-2">
            Number of Financial Dependents *
          </label>
          <input
            id="dependents"
            type="number"
            min="0"
            max="20"
            required
            value={data.dependents === undefined || data.dependents === null ? "" : data.dependents}
            onChange={(e) => {
              const val = e.target.value;
              handleChange("dependents", val === "" ? undefined : (parseInt(val, 10) >= 0 ? parseInt(val, 10) : 0));
            }}
            placeholder="e.g., 0, 1, 2"
            className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
          />
        </div>

        <div>
          <label htmlFor="debtObligations" className="block text-xs uppercase tracking-widest text-white/40 mb-2">
            Monthly Debt Obligations / EMIs *
          </label>
          <div className="relative rounded">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-white/40 text-sm">₹</span>
            </div>
            <input
              id="debtObligations"
              type="number"
              min="0"
              required
              value={data.debtObligations === undefined || data.debtObligations === null ? "" : data.debtObligations}
              onChange={(e) => {
                const val = e.target.value;
                handleChange("debtObligations", val === "" ? undefined : (parseFloat(val) >= 0 ? parseFloat(val) : 0));
              }}
              placeholder="e.g., 0 or 15,000"
              className="w-full pl-8 pr-4 py-3 rounded bg-white/[0.03] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
            />
          </div>
          <p className="text-[10px] text-white/40 mt-1 font-mono tracking-widest">
            {formatINR(data.debtObligations)}
            {data.debtObligations !== undefined && data.debtObligations !== null && data.debtObligations > 0 && (
              <span className="text-[#d4af37] ml-2 font-sans font-medium uppercase text-[10px]">
                ({sayMoneyInIndianWay(data.debtObligations)})
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Runway Indicator HUD */}
      <div className="bg-[#0d0d10] border border-white/5 rounded-lg p-5 mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif text-white flex items-center text-sm md:text-base">
            <span>Dynamic Runway Analysis</span>
          </h4>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">
            How many months you can maintain your current standard of living with zero primary income.
          </p>
        </div>

         <div className="flex items-center gap-4 bg-white/[0.03] px-5 py-3 rounded border border-white/10 shadow-md self-start md:self-auto min-w-[180px]">
          <div className="text-center w-full">
            <div className={`text-2xl font-bold font-serif ${getRunwayColor(runwayValue)} flex justify-center items-center gap-1`}>
              {loadingRunway ? (
                <span className="h-6 w-6 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              ) : (
                runwayValue
              )}
              <span className="text-xs font-normal text-white/50 italic font-sans ml-1">Months</span>
            </div>
            <div className={`text-[9px] uppercase tracking-[0.15em] font-bold mt-1 ${getRunwayColor(runwayValue)}`}>
              Active cash survival
            </div>
          </div>
        </div>
      </div>

      {runwayValue > 0 && runwayValue < 3 && (
        <div className="bg-amber-950/20 border border-amber-600/30 text-amber-400 p-3 rounded flex gap-2 text-xs">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
          <span>
            <strong>Resilience warning:</strong> An estimated career runway below 3 months stands at highly critical risk.
          </span>
        </div>
      )}

      {data.monthlyExpenses > data.monthlyIncome && (
        <div className="bg-amber-950/20 border border-amber-600/30 text-amber-500 p-3 rounded flex gap-2 text-xs">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
          <span>
            <strong>Burn warning:</strong> Monthly expenses today ({formatINR(data.monthlyExpenses)}) exceeds reported monthly income ({formatINR(data.monthlyIncome)}). Your burn rate exceeds your income!
          </span>
        </div>
      )}

      {data.liquidSavings === 0 && (
        <div className="bg-amber-950/20 border border-amber-600/30 text-amber-400 p-3 rounded flex gap-2 text-xs">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
          <span>
            <strong>Reserve warning:</strong> You reported 0 liquid cash. Having no runway buffer is highly vulnerable and risky for a career transition.
          </span>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t border-white/10">
        <button
          id="financials-prev-btn"
          type="button"
          onClick={onPrev}
          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/10 transition-colors flex items-center gap-2 rounded-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          id="financials-next-btn"
          type="submit"
          className="px-6 py-2.5 bg-white hover:bg-white/90 text-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 rounded-sm cursor-pointer"
        >
          <span>Continue to Plan B</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>
      </div>
    </form>
  );
}
