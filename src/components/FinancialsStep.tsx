import React, { useState, useEffect } from "react";
import { FinancialsData } from "../types";
import { Landmark, ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";
import { sayMoneyInIndianWay } from "../utils/currency";
import { getUserId } from "../utils/userId";

interface FinancialsStepProps {
  data: FinancialsData;
  iWillQuitMyJob: boolean;
  onChange: (data: Partial<FinancialsData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function FinancialsStep({ data, iWillQuitMyJob, onChange, onNext, onPrev }: FinancialsStepProps) {
  const [liveRunway, setLiveRunway] = useState<number | null>(null);
  const [loadingRunway, setLoadingRunway] = useState<boolean>(false);
  const [riskClassification, setRiskClassification] = useState<string | null>(null);
  const [netBurn, setNetBurn] = useState<number | null>(null);
  const [runwayMode, setRunwayMode] = useState<string | null>(null);

  // Parse standard inputs cleanly
  const handleChange = (field: keyof FinancialsData, value: number | undefined) => {
    onChange({ [field]: value });
  };

  // Safe client-side mathematical fallback
  const calculateLocalRunway = () => {
    const totalOutflow = (data.monthlyExpenses || 0) + (data.debtObligations || 0);
    const netBurn = iWillQuitMyJob ? totalOutflow : totalOutflow - (data.monthlyIncome || 0);
    if (!data.liquidSavings) return 0;
    if (netBurn <= 0) return 999;
    
    // Survival formula matching Rule 5 exactly
    const baseRunway = data.liquidSavings / netBurn;
    return parseFloat(baseRunway.toFixed(1));
  };

  // Debounced API runway calculation
  useEffect(() => {
    const totalOutflow = (data.monthlyExpenses || 0) + (data.debtObligations || 0);
    const netBurn = iWillQuitMyJob ? totalOutflow : totalOutflow - (data.monthlyIncome || 0);
    
    if (!data.liquidSavings) {
      setLiveRunway(0);
      setRiskClassification(null);
      setNetBurn(null);
      setRunwayMode(null);
      return;
    }
    
    if (netBurn <= 0) {
      setLiveRunway(999);
      setRiskClassification("STABLE");
      setNetBurn(0);
      setRunwayMode("SIDE_HUSTLE");
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingRunway(true);
      try {
        const reqBody = {
          liquidSavings: data.liquidSavings,
          monthlyExpenses: data.monthlyExpenses,
          debtObligations: data.debtObligations,
          dependents: data.dependents,
          ...(!iWillQuitMyJob ? {
            sideHustle: true,
            monthlyIncome: data.monthlyIncome || 0
          } : {
            sideHustle: false
          })
        };

        const response = await fetch("/api/runway/calculate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": getUserId(),
          },
          body: JSON.stringify(reqBody),
        });

        if (response.ok) {
          const resJson = await response.json();
          // API returns runwayMonths or similar
          const months = resJson.runwayMonths ?? resJson.months ?? calculateLocalRunway();
          setLiveRunway(months);
          setRiskClassification(resJson.riskClassification || null);
          setNetBurn(resJson.netBurn !== undefined ? resJson.netBurn : null);
          setRunwayMode(resJson.runwayMode || null);
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
  }, [data.liquidSavings, data.monthlyExpenses, data.debtObligations, data.dependents, data.monthlyIncome, iWillQuitMyJob]);

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
    if (val < 4) return "text-app-error";
    if (val < 9) return "text-orange-400";
    if (val <= 14) return "text-yellow-400";
    return "text-app-success";
  };

  const runwayValue = liveRunway !== null ? liveRunway : calculateLocalRunway();

  return (
    <form id="financials-step-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-app-border pb-4">
        <h2 className="text-xl font-serif text-app-main flex items-center gap-2.5">
          <Landmark className="w-5 h-5 text-app-gold" />
          <span>Financial Position & Resilience</span>
        </h2>
        <p className="text-xs text-app-dim mt-1 uppercase tracking-wider">
          To validate if you can take a career risk, we need to stress-test your current cash reserve.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="monthlyIncome" className="block text-xs uppercase tracking-widest text-app-dim mb-2">
            Current Monthly Income * <span className="text-[10px] text-app-dim italic font-light font-serif">(post-tax)</span>
          </label>
          <div className="relative rounded">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-app-dim text-sm">₹</span>
            </div>
            <input
              id="monthlyIncome"
              type="number"
              onWheel={(e) => (e.target as HTMLElement).blur()}
              onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
              min="0"
              required
              value={data.monthlyIncome || ""}
              onChange={(e) => handleChange("monthlyIncome", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 1,50,050"
              className="w-full pl-8 pr-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
            />
          </div>
          <p className="text-[10px] text-app-dim mt-1 font-mono tracking-widest">
            {formatINR(data.monthlyIncome)}
            {data.monthlyIncome > 0 && (
              <span className="text-app-gold ml-2 font-sans font-medium uppercase text-[10px]">
                ({sayMoneyInIndianWay(data.monthlyIncome)})
              </span>
            )}
          </p>
        </div>

        <div>
          <label htmlFor="liquidSavings" className="block text-xs uppercase tracking-widest text-app-dim mb-2">
            Total Liquid Cash/Savings * <span className="text-[10px] text-app-dim italic font-light font-serif">(accessible now)</span>
          </label>
          <div className="relative rounded">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-app-dim text-sm">₹</span>
            </div>
            <input
              id="liquidSavings"
              type="number"
              onWheel={(e) => (e.target as HTMLElement).blur()}
              onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
              min="0"
              required
              value={data.liquidSavings || ""}
              onChange={(e) => handleChange("liquidSavings", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 6,00,000"
              className="w-full pl-8 pr-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
            />
          </div>
          <p className="text-[10px] text-app-gold mt-1 font-mono tracking-widest font-semibold">
            {formatINR(data.liquidSavings)} Available
            {data.liquidSavings > 0 && (
              <span className="text-app-muted ml-2 font-sans font-medium uppercase text-[10px]">
                ({sayMoneyInIndianWay(data.liquidSavings)})
              </span>
            )}
          </p>
        </div>

        <div>
          <label htmlFor="monthlyExpenses" className="block text-xs uppercase tracking-widest text-app-dim mb-2">
            Current Monthly Expenses * <span className="text-[10px] text-app-dim italic font-light font-serif">(rent, bills, pantry)</span>
          </label>
          <div className="relative rounded">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-app-dim text-sm">₹</span>
            </div>
            <input
              id="monthlyExpenses"
              type="number"
              onWheel={(e) => (e.target as HTMLElement).blur()}
              onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
              min="0"
              required
              value={data.monthlyExpenses || ""}
              onChange={(e) => handleChange("monthlyExpenses", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 60,000"
              className="w-full pl-8 pr-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
            />
          </div>
          <p className="text-[10px] text-app-dim mt-1 font-mono tracking-widest">
            {formatINR(data.monthlyExpenses)}
            {data.monthlyExpenses > 0 && (
              <span className="text-app-gold ml-2 font-sans font-medium uppercase text-[10px]">
                ({sayMoneyInIndianWay(data.monthlyExpenses)})
              </span>
            )}
          </p>
        </div>

        <div>
          <label htmlFor="dependents" className="block text-xs uppercase tracking-widest text-app-dim mb-2">
            Number of Financial Dependents *
          </label>
          <input
            id="dependents"
            type="number"
            onWheel={(e) => (e.target as HTMLElement).blur()}
            onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
            min="0"
            max="20"
            required
            value={data.dependents === undefined || data.dependents === null ? "" : data.dependents}
            onChange={(e) => {
              const val = e.target.value;
              handleChange("dependents", val === "" ? undefined : (parseInt(val, 10) >= 0 ? parseInt(val, 10) : 0));
            }}
            placeholder="e.g., 0, 1, 2"
            className="w-full px-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
          />
        </div>

        <div>
          <label htmlFor="debtObligations" className="block text-xs uppercase tracking-widest text-app-dim mb-2">
            Monthly Debt Obligations / EMIs *
          </label>
          <div className="relative rounded">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-app-dim text-sm">₹</span>
            </div>
            <input
              id="debtObligations"
              type="number"
              onWheel={(e) => (e.target as HTMLElement).blur()}
              onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
              min="0"
              required
              value={data.debtObligations === undefined || data.debtObligations === null ? "" : data.debtObligations}
              onChange={(e) => {
                const val = e.target.value;
                handleChange("debtObligations", val === "" ? undefined : (parseFloat(val) >= 0 ? parseFloat(val) : 0));
              }}
              placeholder="e.g., 0 or 15,000"
              className="w-full pl-8 pr-4 py-3 rounded bg-app-input border border-app-border text-app-main placeholder-white/20 focus:outline-none focus:border-app-gold focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm font-mono"
            />
          </div>
          <p className="text-[10px] text-app-dim mt-1 font-mono tracking-widest">
            {formatINR(data.debtObligations)}
            {data.debtObligations !== undefined && data.debtObligations !== null && data.debtObligations > 0 && (
              <span className="text-app-gold ml-2 font-sans font-medium uppercase text-[10px]">
                ({sayMoneyInIndianWay(data.debtObligations)})
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Runway Indicator HUD */}
      <div className="bg-app-panel border border-app-border-light rounded-lg p-5 mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif text-app-main flex items-center text-sm md:text-base">
            <span>Dynamic Runway Analysis</span>
          </h4>
          <p className="text-xs text-app-dim mt-1 leading-relaxed">
            {!iWillQuitMyJob ? (
              <span>Calculated with side hustle mode active (including current primary income source).</span>
            ) : (
              <span>How many months you can maintain your current standard of living with zero primary income.</span>
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-app-input px-5 py-3 rounded border border-app-border shadow-md self-start md:self-auto min-w-[200px]">
          <div className="text-center w-full">
            {(netBurn !== null && netBurn <= 0 && (!iWillQuitMyJob)) ? (
               <div className={`text-lg font-bold font-serif text-app-success flex justify-center items-center gap-1 min-h-[32px]`}>
                 Not measurable
               </div>
            ) : (
              <div className={`text-2xl font-bold font-serif ${getRunwayColor(runwayValue)} flex justify-center items-center gap-1`}>
                {loadingRunway ? (
                  <span className="h-6 w-6 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  runwayValue >= 999 ? "∞" : runwayValue
                )}
                <span className="text-xs font-normal text-app-muted italic font-sans ml-1">Months</span>
              </div>
            )}
            <div className={`text-[9px] uppercase tracking-[0.15em] font-bold mt-1 ${(netBurn !== null && netBurn <= 0 && (!iWillQuitMyJob)) ? 'text-app-success' : getRunwayColor(runwayValue)}`}>
              Active cash survival
            </div>
          </div>

          {(riskClassification || (netBurn !== null && runwayMode === "side_hustle_net_burn")) && (
            <div className="border-t sm:border-t-0 sm:border-l border-app-border pt-2 sm:pt-0 sm:pl-4 text-center sm:text-left space-y-1.5 min-w-[120px]">
              {riskClassification && (
                <div className="text-xs font-mono">
                  <span className="text-app-dim block text-[9px] uppercase tracking-wider">Risk Level</span>
                  <span className={`font-bold uppercase ${
                    riskClassification.toLowerCase().includes("critical") || riskClassification.toLowerCase().includes("high")
                      ? "text-app-error"
                      : riskClassification.toLowerCase().includes("medium")
                      ? "text-amber-400"
                      : "text-app-success"
                  }`}>
                    {riskClassification}
                  </span>
                </div>
              )}
              {netBurn !== null && runwayMode === "side_hustle_net_burn" && (
                <div className="text-xs font-mono">
                  <span className="text-app-dim block text-[9px] uppercase tracking-wider">Net Monthly Burn</span>
                  <span className={`font-bold ${netBurn > 0 ? "text-app-error" : "text-app-success"}`}>
                    {netBurn > 0 ? formatINR(netBurn) : "Break-even / Surplus"}
                  </span>
                </div>
              )}
            </div>
          )}
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

      <div className="flex justify-between pt-4 border-t border-app-border">
        <button
          id="financials-prev-btn"
          type="button"
          onClick={onPrev}
          className="px-6 py-2.5 bg-app-subtle hover:bg-app-subtle-hover text-app-main text-xs font-bold uppercase tracking-widest border border-app-border transition-colors flex items-center gap-2 rounded-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          id="financials-next-btn"
          type="submit"
          className="px-6 py-2.5 bg-app-main hover:opacity-90 text-app-base text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 rounded-sm cursor-pointer"
        >
          <span>Continue to Constraints</span>
          <ArrowRight className="w-4 h-4 text-app-base" />
        </button>
      </div>
    </form>
  );
}
