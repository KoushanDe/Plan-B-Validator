import React, { useState } from "react";
import { ValidationResults, Verdict } from "../types";
import {
  ShieldAlert,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Briefcase,
  AlertOctagon,
  Printer,
  ChevronRight,
  HelpCircle,
  TrendingDown,
  DollarSign,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  FileText,
  User,
  LayoutDashboard,
  Coins
} from "lucide-react";

interface ResultsDisplayProps {
  results: ValidationResults;
  userMonthlyIncome?: number;
  onReset: () => void;
}

// Format currency depending on country
function formatCurrency(val: any, country?: string) {
  if (val === undefined || val === null || isNaN(Number(val))) return "N/A";
  const num = Number(val);
  const countryStr = String(country || "").toLowerCase();
  const isIndia = countryStr.includes("india") || countryStr.includes("bengaluru") || countryStr.includes("mumbai") || countryStr.includes("delhi");
  const isUAE = countryStr.includes("uae") || countryStr.includes("dubai") || countryStr.includes("abu dhabi");
  
  if (isIndia) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  }
  
  if (isUAE) {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0
    }).format(num);
  }

  // fallback to standard currency or represent beautifully
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(num);
}

// Render dynamic, detailed Market Value assessment
function renderMarketValueAssessment(assessment: any) {
  if (!assessment) {
    return (
      <span className="text-white/45 italic">
        No explicit market intelligence returned. The target is listed under steady conditions.
      </span>
    );
  }

  if (typeof assessment === "string") {
    return <span className="whitespace-pre-line text-white/80">{assessment}</span>;
  }

  if (typeof assessment === "object") {
    const {
      credential_tier,
      market_value_score,
      inferred_salary_range_preliminary,
      corporate_opportunity_summary,
      plan_b_roi_summary,
      opportunity_cost_risk,
      key_signals,
      recent_employers,
      recent_job_titles,
      comp_search_queries,
      estimated_salary_range,
      assumptions
    } = assessment;

    const formatValue = (val: any) => {
      if (!val) return null;
      if (Array.isArray(val)) {
        return val.join(", ");
      }
      if (typeof val === "object") {
        return JSON.stringify(val);
      }
      return String(val);
    };

    return (
      <div className="space-y-4 text-xs text-white/80">
        {(market_value_score !== undefined || credential_tier) && (
          <div className="flex flex-wrap items-center gap-3 bg-white/[0.02] p-2.5 rounded border border-white/5">
            {market_value_score !== undefined && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase font-mono text-white/40">Market Score:</span>
                <span className="font-mono font-bold text-[#d4af37] text-xs">{formatValue(market_value_score)}/100</span>
              </div>
            )}
            {credential_tier && (
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-[9px] uppercase font-mono text-white/40">Tier:</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/10 text-[#d4af37] font-semibold border border-[#d4af37]/20">
                  {formatValue(credential_tier)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {corporate_opportunity_summary && (
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/40 block">Corporate Opportunity</span>
              <p className="mt-0.5 text-white/90 leading-relaxed font-sans">{formatValue(corporate_opportunity_summary)}</p>
            </div>
          )}

          {plan_b_roi_summary && (
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#d4af37] block">Plan B ROI Summary</span>
              <p className="mt-0.5 text-white/90 leading-relaxed font-sans">{formatValue(plan_b_roi_summary)}</p>
            </div>
          )}

          {opportunity_cost_risk && (
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-rose-400/80 block">Opportunity Cost Risk</span>
              <p className="mt-0.5 text-rose-200/90 leading-relaxed font-sans">{formatValue(opportunity_cost_risk)}</p>
            </div>
          )}

          {inferred_salary_range_preliminary && (
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/40 block">Preliminary Inferred Salary</span>
              <p className="mt-0.5 text-[#d4af37] font-mono font-semibold">{formatValue(inferred_salary_range_preliminary)}</p>
            </div>
          )}

          {estimated_salary_range && (
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/40 block">Estimated Salary Range</span>
              <p className="mt-0.5 text-[#d4af37] font-mono font-semibold">{formatValue(estimated_salary_range)}</p>
            </div>
          )}
        </div>

        {(recent_job_titles || recent_employers) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-white/5 pt-3">
            {recent_job_titles && (
              <div>
                <span className="text-[9px] font-mono text-white/40 block uppercase">Target Job Titles</span>
                <p className="text-white/85 leading-relaxed font-sans">{formatValue(recent_job_titles)}</p>
              </div>
            )}
            {recent_employers && (
              <div>
                <span className="text-[9px] font-mono text-white/40 block uppercase">Benchmark Employers</span>
                <p className="text-white/85 leading-relaxed font-sans">{formatValue(recent_employers)}</p>
              </div>
            )}
          </div>
        )}

        {(key_signals || assumptions || comp_search_queries) && (
          <div className="border-t border-white/5 pt-3 space-y-2">
            {key_signals && (
              <div>
                <span className="text-[9px] font-mono text-white/40 block uppercase">Key Performance Signals</span>
                <p className="text-white/70 leading-relaxed">{formatValue(key_signals)}</p>
              </div>
            )}
            {assumptions && (
              <div>
                <span className="text-[9px] font-mono text-white/40 block uppercase">Model Assumptions</span>
                <p className="text-white/60 text-[10px] leading-relaxed italic">{formatValue(assumptions)}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return <span className="text-white/80">{String(assessment)}</span>;
}

export default function ResultsDisplay({ results, userMonthlyIncome, onReset }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "financials" | "market" | "profile">("summary");

  // Custom Verdict configurations
  const getVerdictDetails = (verdict: Verdict) => {
    switch (verdict) {
      case "take_the_leap":
        return {
          label: "Take the Leap",
          color: "bg-emerald-950/20 border-emerald-500/30 text-emerald-200",
          badge: "bg-emerald-500 text-black font-bold",
          summary: "Highly validated scenario. Your financials and personality index align with the proposed strategy.",
        };
      case "take_with_caution":
        return {
          label: "Proceed raising Shields (Take with Caution)",
          color: "bg-amber-950/20 border-[#d4af37]/30 text-[#d4af37]",
          badge: "bg-[#d4af37] text-black font-bold",
          summary: "Feasible idea, but significant risks or high family dependency exist. Raise cushions.",
        };
      case "delay":
        return {
          label: "Delay Launch & Accumulate Reserves",
          color: "bg-orange-950/20 border-orange-500/20 text-orange-200",
          badge: "bg-orange-500 text-black font-bold",
          summary: "Market context is average or financials are tight. Accumulate more months of living reserves first.",
        };
      case "do_not_take_now":
        return {
          label: "Do Not Initiate Now",
          color: "bg-rose-950/20 border-rose-500/20 text-rose-200",
          badge: "bg-rose-500 text-white font-bold",
          summary: "High capital constraints or severe market mismatched curves. Strengthen fallback positions first.",
        };
      default:
        return {
          label: "Unknown Decision",
          color: "bg-white/[0.01] border-white/5 text-white/60",
          badge: "bg-white/10 text-white",
          summary: "Validation details did not resolve completely.",
        };
    }
  };

  const verdictConfig = getVerdictDetails(results.verdict);

  const getScoreColor = (score: number, inverse = false) => {
    if (inverse) {
      if (score < 40) return "text-emerald-400 bg-emerald-950/10 border border-emerald-500/20";
      if (score < 70) return "text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/20";
      return "text-rose-450 bg-rose-950/10 border border-rose-500/20";
    } else {
      if (score >= 70) return "text-emerald-400 bg-emerald-950/10 border border-emerald-500/20";
      if (score >= 40) return "text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/20";
      return "text-rose-450 bg-rose-950/10 border border-rose-500/20";
    }
  };

  const handlePrint = () => {
    try {
      window.focus();
      setTimeout(() => {
        try {
          window.print();
        } catch (err) {
          try {
            document.execCommand('print', false, undefined);
          } catch (e2) {
            window.print();
          }
        }
      }, 150);
    } catch (e) {
      console.warn("Direct window.print error, attempting browser standard print:", e);
      try {
        window.print();
      } catch (err2) {
        // failed safely
      }
    }
  };

  const hasUserIncome = userMonthlyIncome !== undefined && userMonthlyIncome !== null && userMonthlyIncome > 0;
  
  const userIncomeToUse = hasUserIncome
    ? userMonthlyIncome!
    : (results.opportunityCost?.monthly_corporate_baseline || 0);

  const planBHorizonIncome = results.opportunityCost?.monthly_plan_b_at_horizon || results.resolvedPlanB?.expectedIncome12Months || 0;
  
  const userIncomeSacrifice = Math.max(0, userIncomeToUse - planBHorizonIncome);
  const userIncomeSacrificePercent = userIncomeToUse > 0
    ? Math.round((userIncomeSacrifice / userIncomeToUse) * 100)
    : 0;

  // Safe parsing of confidence metric
  const cleanConfidence = String(results.confidence || "").trim();
  let confidenceNumeric = parseFloat(cleanConfidence);
  if (isNaN(confidenceNumeric)) {
    const lower = cleanConfidence.toLowerCase();
    if (lower.includes("high")) confidenceNumeric = 85;
    else if (lower.includes("medium")) confidenceNumeric = 60;
    else if (lower.includes("low")) confidenceNumeric = 30;
    else confidenceNumeric = 70; // safe fallback
  }

  // Only append % if the confidence value is purely a numeric integer
  const isNumericReg = /^\d+$/.test(cleanConfidence.replace("%", ""));
  const confidenceDisplayText = isNumericReg 
    ? (cleanConfidence.endsWith("%") ? cleanConfidence : `${cleanConfidence}%`)
    : (cleanConfidence.charAt(0).toUpperCase() + cleanConfidence.slice(1)); // e.g. "Medium"

  // Compile short description values to go underneath the top grid cards
  // Card 1: Risk Level Desc
  const riskCardDescription = results.expectedFailureMode 
    ? `Main vulnerability: ${results.expectedFailureMode.split(/\. |\n/)[0]}.`
    : `Aggregated vulnerability rating compiled from savings, liabilities, and transition pressure.`;

  // Card 2: Runway Desc
  const runwayCardDescription = results.runwayMonths 
    ? `Sustains you for ~${results.runwayMonths} months at current expenses without any Plan B revenue.`
    : `Self-preservation limit computed based on your liquid assets and active debt obligations.`;

  // Card 3: Confidence Desc
  const confidenceCardDescription = results.personalitySummary
    ? `Confidence index driven by professional credential strength and behavioral profile alignment.`
    : `Certainty rating derived from regional compensation data, density and profile completeness.`;

  // Card 4: Opportunity Cost Desc
  // Take only the first sentence of opportunity cost summary to fix squishing / truncation
  const rawDesc = results.opportunityCost?.summary || "Foretaken salary and trajectory shift cost.";
  const opportunityCostCardDescription = `${rawDesc.split(/\. |\n/)[0]}.`;

  // Currency extraction helper
  const localizedCountry = results.resolvedProfile?.country || results.profileFieldSources?.country || "india";

  return (
    <div id="results-display-wrapper" className="space-y-8 animate-fade-in print:bg-white print:text-black">
      
      {/* Header Print Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5 print:border-black/20">
        <div>
          <span className="text-[10px] text-[#d4af37] uppercase tracking-widest font-black font-mono">
            Plan B Assessment Complete
          </span>
          <h1 className="text-2xl font-serif text-white print:text-black mt-1">
            Transition Feasibility Report
          </h1>
          {results.requestId && (
            <span className="text-[9px] font-mono text-white/30 print:text-black/50 block mt-0.5">
              ID: {results.requestId} • Computed in {results.processingMs ? (results.processingMs / 1000).toFixed(1) : "N/A"}s
            </span>
          )}
        </div>
        
        <div className="flex gap-2 print:hidden">
          <button
            id="print-report-btn"
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border border-white/10 text-white/85 hover:bg-white/5 rounded-sm transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Full Report</span>
          </button>
          
          <button
            id="restart-validator-btn"
            type="button"
            onClick={onReset}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 bg-[#d4af37] hover:bg-[#c5a12e] text-black rounded-sm transition-colors cursor-pointer font-semibold"
          >
            <span>Analyze Another Scenario</span>
          </button>
        </div>
      </div>

      {/* Primary Transition Verdict Card */}
      <div className={`p-6 rounded border ${verdictConfig.color} shadow-lg print:border-black/25 print:bg-gray-100 print:text-black`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className={`inline-flex items-center px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider ${verdictConfig.badge}`}>
              {verdictConfig.label}
            </div>
            <p className="mt-4 text-xs tracking-wide uppercase text-white/40 print:text-black/55 font-mono">Transition Feasibility Verdict</p>
            <p className="mt-1 text-sm font-sans text-white/90 print:text-black leading-relaxed font-semibold">
              {results.recommendationSummary || verdictConfig.summary}
            </p>
          </div>

          <div className="text-center bg-white/[0.01] border border-white/5 print:border-black/10 px-5 py-3 rounded min-w-[130px] self-start sm:self-auto">
            <span className="text-[9px] uppercase tracking-wider text-white/40 print:text-black/50 block">Feasibility</span>
            <span className="text-3xl font-bold font-mono text-[#d4af37] print:text-[#c5a12e]">
              {results.feasibilityScore}
              <span className="text-xs font-normal text-white/30 print:text-black/40">/100</span>
            </span>
          </div>
        </div>
      </div>

      {/* KPI TOP LEVEL GRID (Shows everywhere, with beautiful small descriptions below) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-3">
        {/* Risk Score */}
        <div className={`p-4 rounded border flex flex-col justify-between ${getScoreColor(results.riskScore, true)} print:bg-white print:border-black/20`}>
          <div>
            <div className="text-[9px] uppercase tracking-widest opacity-85 font-mono flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-450" />
              <span>Risk Score</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold font-mono">{results.riskScore}%</span>
            </div>
          </div>
          <p className="text-[10px] opacity-75 mt-2 leading-relaxed font-sans border-t border-white/5 pt-2 print:border-black/10">
            {riskCardDescription}
          </p>
        </div>

        {/* Capital Runway Months */}
        <div className="p-4 rounded border border-white/5 bg-white/[0.01] flex flex-col justify-between text-white/90 print:bg-white print:border-black/20 print:text-black">
          <div>
            <div className="text-[9px] uppercase tracking-widest text-[#d4af37] font-mono flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#d4af37]" />
              <span>Capital Runway</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold font-mono text-white print:text-black">{results.runwayMonths}</span>
              <span className="text-xs font-semibold text-white/40 print:text-black/50">months</span>
            </div>
          </div>
          <p className="text-[10px] text-white/40 print:text-black/60 mt-2 leading-relaxed font-sans border-t border-white/5 pt-2 print:border-black/10">
            {runwayCardDescription}
          </p>
        </div>

        {/* Confidence rating */}
        <div className={`p-4 rounded border flex flex-col justify-between ${getScoreColor(confidenceNumeric)} print:bg-white print:border-black/20`}>
          <div>
            <div className="text-[9px] uppercase tracking-widest opacity-85 font-mono flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>Confidence</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold font-mono">{confidenceDisplayText}</span>
            </div>
          </div>
          <p className="text-[10px] opacity-75 mt-2 leading-relaxed font-sans border-t border-white/5 pt-2 print:border-black/10">
            {confidenceCardDescription}
          </p>
        </div>

        {/* Opportunity Cost */}
        <div className="p-4 rounded border border-white/5 bg-white/[0.01] flex flex-col justify-between text-white/90 print:bg-white print:border-black/20 print:text-black">
          <div>
            <div className="text-[9px] uppercase tracking-widest text-[#d4af37] font-mono flex items-center gap-1">
              <Award className="w-3 h-3 text-[#d4af37]" />
              <span>Opportunity Cost</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-white print:text-black">
                {results.opportunityCost?.score || 0}
              </span>
              <span className="text-xs font-semibold text-[#d4af37]">
                /{results.opportunityCost?.band || "Medium"} Band
              </span>
            </div>
          </div>
          <p className="text-[10px] text-white/70 print:text-black/60 mt-2 leading-relaxed font-sans border-t border-white/5 pt-2 print:border-black/10">
            {results.opportunityCost?.summary || opportunityCostCardDescription}
          </p>
        </div>
      </div>

      {/* STICKY TAB SELECTION (Hides entirely in print mode) */}
      <div className="flex border-b border-white/10 overflow-x-auto gap-1 print:hidden pt-2 scrollbar-none">
        <button
          onClick={() => setActiveTab("summary")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 ${
            activeTab === "summary"
              ? "border-[#d4af37] text-white bg-white/[0.02]"
              : "border-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.01]"
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Feasibility Metrics</span>
        </button>
        <button
          onClick={() => setActiveTab("financials")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 ${
            activeTab === "financials"
              ? "border-[#d4af37] text-white bg-white/[0.02]"
              : "border-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.01]"
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Transition Financials</span>
        </button>
        <button
          onClick={() => setActiveTab("market")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 ${
            activeTab === "market"
              ? "border-[#d4af37] text-white bg-white/[0.02]"
              : "border-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.01]"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Market Intel & Salary</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 ${
            activeTab === "profile"
              ? "border-[#d4af37] text-white bg-white/[0.02]"
              : "border-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.01]"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile & Persona</span>
        </button>
      </div>


      {/* ==================== TAB 1: EXECUTIVE FEASIBILITY METRICS ==================== */}
      <div className={`${activeTab === "summary" ? "block" : "hidden print:block"} space-y-6 print:mt-6`}>
        {/* Printable section title */}
        <div className="hidden print:block border-b border-black/10 pb-1 mb-4 mt-6">
          <h2 className="text-sm font-bold font-mono text-black uppercase">Diagnostics Part I: Core Feasibility Indicators</h2>
        </div>

        {/* Breakdown progress bar items */}
        {results.scoreBreakdown && (
          <div className="bg-white/[0.01] border border-white/5 rounded-lg p-5 space-y-4 print:border-black/10 print:bg-white">
            <h3 className="font-serif text-white print:text-black text-md flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Diagnostic Pillar Slices</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {Object.entries(results.scoreBreakdown).map(([key, rawValue]) => {
                const value = Number(rawValue) || 0;
                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .replace(/^\w/, (c) => c.toUpperCase());
                
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="font-mono text-[10px] text-white/55 print:text-black/65 uppercase">{label}</span>
                      <span className="font-mono font-bold text-[#d4af37]">{value}/100</span>
                    </div>
                    <div className="w-full bg-white/5 print:bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#d4af37] to-[#f3e3a9] print:bg-gradient-to-r print:from-[#c5a12e] print:to-[#f3e3a9] h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Strategic Strengths */}
          <div className="bg-white/[0.01] border border-white/5 print:border-black/10 print:bg-white rounded-lg p-5 space-y-4">
            <h3 className="font-serif text-white print:text-black text-md flex items-center gap-2.5 border-b border-white/10 print:border-black/10 pb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Key Strategic Strengths</span>
            </h3>
            {results.majorReasons && results.majorReasons.length > 0 ? (
              <ul className="space-y-3">
                {results.majorReasons.map((reason, i) => (
                  <li key={i} className="flex gap-2 text-xs text-white/70 print:text-black/85 leading-relaxed items-start">
                    <ChevronRight className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/40 italic">No major strengths analyzed.</p>
            )}
          </div>

          {/* Warning Flags & Friction Curves */}
          <div className="bg-white/[0.01] border border-white/5 print:border-black/10 print:bg-white rounded-lg p-5 space-y-4">
            <h3 className="font-serif text-white print:text-black text-md flex items-center gap-2.5 border-b border-white/10 print:border-black/10 pb-3">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Warning Flags & Friction Curves</span>
            </h3>
            {results.redFlags && results.redFlags.length > 0 ? (
              <ul className="space-y-3">
                {results.redFlags.map((flag, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-white/70 print:text-black/85 leading-relaxed items-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-2 animate-pulse"></span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/40 italic bg-white/[0.02] border border-white/5 p-3 rounded flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>Pristine structure. No high-level friction flags detected!</span>
              </p>
            )}
          </div>
        </div>
      </div>


      {/* ==================== TAB 2: TRANSITION FINANCIALS & ROI DEEP DIVE ==================== */}
      <div className={`${activeTab === "financials" ? "block" : "hidden print:block"} space-y-6 print:mt-6`}>
        {/* Printable section title */}
        <div className="hidden print:block border-b border-black/10 pb-1 mb-4 mt-6">
          <h2 className="text-sm font-bold font-mono text-black uppercase">Diagnostics Part II: Opportunity Costs & Runway</h2>
        </div>

        {/* Corporate Baseline vs Plan B Horizon */}
        <div className="bg-[#0b0b0d] border border-white/5 print:border-black/10 print:bg-white rounded p-6 space-y-6">
          <div>
            <h3 className="font-serif text-white print:text-black text-md flex items-center gap-2">
              <Coins className="w-4.5 h-4.5 text-[#d4af37]" />
              <span>“How much am I giving up?” — Score: {results.opportunityCost?.score || 0}/100 ({results.opportunityCost?.band || "Medium"})</span>
            </h3>
            {results.opportunityCost?.summary && (
              <p className="mt-2 text-xs text-[#d4af37] print:text-[#c5a12e] font-medium italic border-l-2 border-[#d4af37]/30 pl-3 leading-relaxed font-sans py-1 bg-white/[0.01]">
                "{results.opportunityCost.summary}"
              </p>
            )}
            <p className="text-[11px] text-white/45 print:text-black/60 mt-2 leading-relaxed">
              Evaluating your corporate baseline earning capacity directly against month-by-month targets of your prospective Plan B venture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-white/5 print:border-black/10 pb-4">
            <div className="bg-white/[0.02] print:bg-gray-150 p-4 rounded border border-white/5 print:border-black/5">
              <span className="text-[9px] uppercase tracking-widest text-white/40 print:text-black/50 block font-mono">Monthly Corporate Baseline</span>
              <span className="text-lg font-bold font-mono text-white print:text-black mt-1 block">
                {formatCurrency(userIncomeToUse, localizedCountry)}
              </span>
              <span className="text-[9px] text-[#d4af37] block mt-1 font-mono">
                Source: {hasUserIncome ? "User Entered Income" : (results.opportunityCost?.corporate_baseline_source || "Web Research")}
              </span>
            </div>

            <div className="bg-white/[0.02] print:bg-gray-150 p-4 rounded border border-white/5 print:border-black/5">
              <span className="text-[9px] uppercase tracking-widest text-white/40 print:text-black/50 block font-mono">Plan B Revenue Horizon</span>
              <span className="text-lg font-bold font-mono text-emerald-400 print:text-emerald-700 mt-1 block">
                {formatCurrency(planBHorizonIncome, localizedCountry)}
              </span>
              <span className="text-[9px] text-white/40 block mt-1 font-mono">
                At projected mature phase
              </span>
            </div>

            <div className="bg-rose-955/10 print:bg-red-50 p-4 rounded border border-rose-500/10 print:border-red-200">
              <span className="text-[9px] uppercase tracking-widest text-rose-400 block font-mono">Net Monthly Sacrifice</span>
              <span className="text-lg font-bold font-mono text-rose-400 print:text-rose-700 mt-1 block">
                -{formatCurrency(userIncomeSacrifice, localizedCountry)}
              </span>
              <span className="text-[9px] text-rose-400/70 block mt-1 font-semibold font-sans">
                ≈ {userIncomeSacrificePercent}% income reduction during launch
              </span>
            </div>
          </div>

          {/* Opportunity Cost component values */}
          {results.opportunityCost?.components && (
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/40 print:text-black/50 font-mono font-semibold block mb-3">
                Corporate Trajectory Gaps & Friction Drivers (Component Scoring)
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(results.opportunityCost.components).map(([compName, compVal]) => {
                  const title = compName
                    .replace(/_/g, " ")
                    .replace(/^\w/, (c) => c.toUpperCase());
                  return (
                    <div key={compName} className="bg-white/[0.01] print:bg-gray-50 border border-white/5 print:border-black/5 p-3 rounded">
                      <span className="text-[9px] font-mono uppercase text-white/40 print:text-black/50 block">{title}</span>
                      <span className="text-sm font-bold font-mono text-white print:text-black mt-1 block">
                        {compVal}/100
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Long form Plan B ROI summary */}
          <div className="border-t border-white/5 print:border-black/10 pt-4">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#d4af37] block mb-1">
              Consolidated ROI Verdict & Return Potential
            </span>
            <p className="text-xs text-white/80 print:text-black leading-relaxed font-sans">
              {results.planBRoiSummary || results.opportunityCost?.summary || "Direct transition sacrifice indicates reasonable return potential but is subject to client acquisition schedules."}
            </p>
          </div>
        </div>

      </div>


      {/* ==================== TAB 3: WEB MARKET INTELLIGENCE & BENCHMARKS ==================== */}
      <div className={`${activeTab === "market" ? "block" : "hidden print:block"} space-y-6`}>
        {/* Printable section title */}
        <div className="hidden print:block border-b border-black/10 pb-1 mb-4 mt-6">
          <h2 className="text-sm font-bold font-mono text-black uppercase">Diagnostics Part III: Web Search Grounding & Regional Context</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Sentiment & Summary */}
          <div className="lg:col-span-2 bg-white/[0.01] border border-white/5 print:border-black/10 print:bg-white rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-white print:text-black text-md flex items-center gap-2">
                <Briefcase className="w-4.5 h-4.5 text-[#d4af37]" />
                <span>Geographic Market Sentiment Summary</span>
              </h3>
              
              {results.researchContext?.market_sentiment && (
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-widest ${
                  results.researchContext.market_sentiment === "positive"
                    ? "bg-emerald-950/35 border border-emerald-500/20 text-emerald-400"
                    : "bg-amber-950/35 border border-[#d4af37]/20 text-[#d4af37]"
                }`}>
                  {results.researchContext.market_sentiment}
                </span>
              )}
            </div>

            <p className="text-xs text-white/80 print:text-black leading-relaxed font-sans">
              {results.researchContext?.market_summary || "Steady regional corporate conditions mapped. High credential alignment ensures resilient secondary career backup capabilities."}
            </p>

            {/* High level plan b notes */}
            {results.researchContext?.plan_b_market_notes && (
              <div className="bg-white/[0.01] print:bg-gray-50 border border-white/5 print:border-black/5 p-4 rounded text-xs space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wide text-[#d4af37] block">Regional Venture Grounding & Viability</span>
                <p className="text-white/70 print:text-black/85 leading-relaxed">{results.researchContext.plan_b_market_notes}</p>
              </div>
            )}
          </div>

          {/* Dials & Compensation Ranges */}
          <div className="bg-white/[0.01] border border-white/5 print:border-black/10 print:bg-white rounded-lg p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-serif text-white print:text-black text-md">Compensation Benchmarks</h3>
              
              <div className="p-4 bg-white/[0.02] print:bg-gray-100 border border-white/5 p-3.5 rounded space-y-1">
                <span className="text-[9px] uppercase font-mono tracking-wider text-white/40 print:text-black/50">Benchmarked Salary Range</span>
                <span className="text-lg font-bold font-mono text-[#d4af37] block mt-1">
                  {results.researchContext?.corporate_salary_range || results.marketValueAssessment?.estimated_salary_range || "N/A"}
                </span>
                <span className="text-[10px] text-white/30 block">Based on live index listings for software engineering and relevant disciplines.</span>
              </div>

              {results.researchContext?.web_competitiveness_score !== undefined && (
                <div className="p-4 bg-white/[0.02] print:bg-gray-100 border border-white/5 p-3.5 rounded space-y-1">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-white/40 print:text-black/50">Market Competitiveness Index</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-bold font-mono text-white print:text-black">{results.researchContext.web_competitiveness_score}</span>
                    <span className="text-xs font-mono text-white/30">/100</span>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[9px] font-sans text-white/30 italic block mt-3 leading-tight print:hidden">
              Ground truth statistics sourced live from corporate salary matrices, regional compensation consensus and job databases.
            </p>
          </div>
        </div>

        {/* Resume & Market Value Profile */}
        {(results.marketValueAssessment || results.researchContext?.marketValueAssessment || results.opportunity_cost_risk) && (
          <div className="bg-white/[0.01] border border-white/5 print:border-black/10 print:bg-white rounded-lg p-6 space-y-4">
            <h3 className="font-serif text-white print:text-black text-md flex items-center gap-2 border-b border-white/10 print:border-black/10 pb-3">
              <FileText className="w-4.5 h-4.5 text-[#d4af37]" />
              <span>Resume & Market Value Assessment</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* How strong is my corporate path? sub-signal */}
              <div className="space-y-3 bg-white/[0.02] p-4.5 rounded border border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] block">
                  How strong is my corporate path?
                </span>
                <p className="text-xs text-white/90 leading-relaxed font-sans font-semibold">
                  {results.marketValueAssessment?.opportunity_cost_risk || 
                   results.researchContext?.marketValueAssessment?.opportunity_cost_risk || 
                   results.opportunity_cost_risk ||
                   "No severe pathways friction or opportunity cost risk flagged on your corporate pathway."}
                </p>
                {(results.marketValueAssessment?.corporate_opportunity_summary || results.researchContext?.marketValueAssessment?.corporate_opportunity_summary) && (
                  <div className="border-t border-white/5 pt-3 mt-3">
                    <span className="text-[9px] font-mono text-white/40 uppercase block">Corporate Opportunity Summary</span>
                    <p className="text-xs text-white/70 leading-relaxed font-sans mt-1">
                      {results.marketValueAssessment?.corporate_opportunity_summary || results.researchContext?.marketValueAssessment?.corporate_opportunity_summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Resume Attributes */}
              <div className="space-y-4 bg-white/[0.02] p-4.5 rounded border border-white/5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                    Credential Quality Matches
                  </span>
                  <div className="flex gap-4 mt-3">
                    {(results.marketValueAssessment?.market_value_score !== undefined || results.researchContext?.marketValueAssessment?.market_value_score !== undefined) && (
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded min-w-[90px] text-center">
                        <span className="text-[9px] uppercase tracking-wider text-white/45 block">Market Score</span>
                        <span className="text-xl font-bold font-mono text-[#d4af37] block mt-0.5">
                          {results.marketValueAssessment?.market_value_score ?? results.researchContext?.marketValueAssessment?.market_value_score}/100
                        </span>
                      </div>
                    )}
                    {(results.marketValueAssessment?.credential_tier || results.researchContext?.marketValueAssessment?.credential_tier) && (
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded min-w-[90px] text-center">
                        <span className="text-[9px] uppercase tracking-wider text-white/45 block font-mono">Credential Tier</span>
                        <span className="text-sm font-bold font-mono text-white block mt-2 px-2 py-0.5 rounded bg-white/10 text-[#d4af37] border border-[#d4af37]/20">
                          {results.marketValueAssessment?.credential_tier ?? results.researchContext?.marketValueAssessment?.credential_tier}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {(results.marketValueAssessment?.recent_employers || results.researchContext?.marketValueAssessment?.recent_employers) && (
                  <div className="border-t border-white/5 pt-3 mt-3">
                    <span className="text-[9px] font-mono text-white/40 uppercase block">Benchmark Employers</span>
                    <p className="text-xs text-white/80 leading-relaxed mt-0.5 font-sans">
                      {results.marketValueAssessment?.recent_employers ?? results.researchContext?.marketValueAssessment?.recent_employers}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Detailed market notes & salary context */}
        {results.researchContext?.salary_notes && (
          <div className="bg-white/[0.01] border border-white/5 print:border-black/10 print:bg-white rounded p-6 space-y-2">
            <span className="text-[10px] uppercase font-mono text-white/40 print:text-black/50 tracking-wider">Salary Benchmarking Insights</span>
            <p className="text-xs text-white/80 print:text-black font-sans leading-relaxed">{results.researchContext.salary_notes}</p>
          </div>
        )}

        {/* Risk factors side grid */}
        {results.researchContext?.risk_factors && results.researchContext.risk_factors.length > 0 && (
          <div className="bg-white/[0.01] border border-white/5 print:border-black/10 print:bg-white rounded p-6 space-y-3">
            <span className="text-[10px] uppercase font-mono text-rose-450 tracking-wider font-semibold">Granular Regional Risk Exposures</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.researchContext.risk_factors.map((factor: string, idx: number) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs text-white/70 print:text-black/85 leading-relaxed">
                  <span className="text-rose-400 font-mono mt-0.5">[{idx + 1}]</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sourced consulting queries */}
        {((results.researchContext?.salary_sources && results.researchContext.salary_sources.length > 0) || 
          (results.marketValueAssessment?.comp_search_queries && results.marketValueAssessment.comp_search_queries.length > 0)) && (
          <div className="bg-[#08080a] border border-white/5 p-5 rounded space-y-3">
            <span className="text-[10px] font-mono uppercase text-white/40 block">Web Sources Consulted & Engine Searches</span>
            
            {results.marketValueAssessment?.comp_search_queries && (
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase tracking-wider text-white/30 block">Search Groundings:</span>
                <div className="flex flex-wrap gap-2">
                  {results.marketValueAssessment.comp_search_queries.map((q: string, idx: number) => (
                    <code key={idx} className="bg-white/[0.03] text-[#d4af37] text-[10px] px-2 py-0.5 rounded font-mono border border-white/5">
                      {q}
                    </code>
                  ))}
                </div>
              </div>
            )}

            {results.researchContext?.salary_sources && (
              <div className="space-y-1 pt-1">
                <span className="text-[9px] uppercase tracking-wider text-white/30 block">Reference APIs:</span>
                <p className="text-[10px] text-white/60 font-mono">
                  {results.researchContext.salary_sources.join(", ")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>


      {/* ==================== TAB 4: PROFILE & BEHAVIORAL DIAGNOSTICS ==================== */}
      <div className={`${activeTab === "profile" ? "block" : "hidden print:block"} space-y-6`}>
        {/* Printable section title */}
        <div className="hidden print:block border-b border-black/10 pb-1 mb-4 mt-6">
          <h2 className="text-sm font-bold font-mono text-black uppercase">Diagnostics Part TIV: Profile Resolutions & Stress Psychology</h2>
        </div>

        {/* Psychology of stress alignment */}
        <div className="bg-[#0b0b0e] border border-white/5 print:border-black/10 print:bg-white rounded p-6 space-y-5">
          <h3 className="font-serif text-white print:text-black text-md flex items-center gap-2.5">
            <BookOpen className="w-4.5 h-4.5 text-[#d4af37]" />
            <span>Stress Resilience & Psychology Alignment</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="bg-white/[0.01] print:bg-gray-100 border border-white/5 p-4 rounded">
              <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 print:text-black/50 block mb-1 font-mono">Psychology & Trait Metrics</span>
              <p className="text-xs text-white/85 print:text-black leading-relaxed font-sans mt-2">
                {results.personalitySummary || "Evaluation details pending profile parameters mapping."}
              </p>
            </div>

            <div className="bg-rose-955/15 print:bg-red-50 border border-rose-500/10 p-4 rounded">
              <span className="text-[9px] font-bold uppercase tracking-wider text-rose-400 block mb-1 flex items-center gap-1 font-mono">
                <AlertOctagon className="w-3.5 h-3.5" /> Predicted Venturing Threat/Failure Frame
              </span>
              <p className="text-xs text-rose-300 print:text-rose-900 leading-relaxed font-semibold font-sans mt-2">
                {results.expectedFailureMode || "Not sufficiently mapped by constraints thresholds. Verify acceptable budget offsets."}
              </p>
            </div>

            <div className="bg-emerald-955/15 print:bg-emerald-50 border border-emerald-500/10 p-4 rounded">
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block mb-1 flex items-center gap-1 font-mono">
                <Activity className="w-3.5 h-3.5" /> Prudent Strategic Next Actions
              </span>
              <p className="text-xs text-emerald-300 print:text-emerald-900 leading-relaxed font-semibold font-sans mt-2">
                {results.safestNextMove || "Operate side contracts to lock down baseline customers."}
              </p>
            </div>
          </div>
        </div>

        {/* Transition Fallback Actions Timeline */}
        <div className="bg-[#0f0f12] border border-[#d4af37]/20 text-white rounded p-6 space-y-5 print:border-black/10 print:bg-white print:text-black">
          <div className="flex gap-2 items-center">
            <Award className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-serif text-md text-white print:text-black">Recommended Transition Fallback Plan</h3>
          </div>

          <p className="text-xs text-white/70 print:text-black/85 leading-relaxed font-medium">
            {results.suggestedFallbackPlan || "Launch as a structured side-project initially, preserving your principal day job structure as a margin cushion."}
          </p>

          <div className="border-t border-white/15 print:border-black/10 pt-4 space-y-3">
            <h4 className="font-mono text-[9px] text-[#d4af37] print:text-[#c5a12e] uppercase tracking-widest font-bold">Chronological Transition Milestones</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {results.nextSteps && results.nextSteps.length > 0 ? (
                results.nextSteps.map((step, idx) => (
                  <div key={idx} className="bg-white/[0.01] print:bg-gray-100 p-4 rounded border border-white/5 print:border-black/5">
                    <div className="font-mono text-[10px] text-[#d4af37]/80 print:text-[#c5a12e] font-bold mb-1">PHASE 0{idx + 1}</div>
                    <p className="text-xs text-white/80 print:text-black/85 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/40">Acquire primary user feedback before releasing code.</p>
              )}
            </div>
          </div>
        </div>

        {/* Side-by-Side Resolution Verification Table / Map sources */}
        <div className="bg-white/[0.01] border border-white/5 print:border-black/10 print:bg-white rounded p-5 space-y-4">
          <div className="flex gap-2 items-center border-b border-white/5 print:border-black/10 pb-2">
            <Layers className="w-4 h-4 text-[#d4af37]" />
            <span className="font-serif text-sm text-white print:text-black">System Resolution Verification Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-white/70">
            {/* Resolved Profile Parameters */}
            {results.resolvedProfile && (
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-white/40 uppercase block">Inferred Career Dimensions</span>
                <table className="w-full text-xs border border-white/5 print:border-black/5">
                  <thead className="bg-white/5 print:bg-gray-100 uppercase tracking-wider text-[9px]">
                    <tr>
                      <th className="p-2 text-left border-b border-white/5">Property</th>
                      <th className="p-2 text-left border-b border-white/5">Computed Profile Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(results.resolvedProfile).map(([k, v]) => (
                      <tr key={k} className="border-b border-white/5">
                        <td className="p-2 font-mono text-[10px] text-white/40 uppercase">{k}</td>
                        <td className="p-2 font-mono text-white font-bold">{String(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Target Plan B Parameters */}
            {results.resolvedPlanB && (
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-white/40 uppercase block">Target Venture Directives</span>
                <table className="w-full text-xs border border-white/5 print:border-black/5">
                  <thead className="bg-white/5 print:bg-gray-100 uppercase tracking-wider text-[9px]">
                    <tr>
                      <th className="p-2 text-left border-b border-white/5">Directive</th>
                      <th className="p-2 text-left border-b border-white/5">Target Plan Setting</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(results.resolvedPlanB).map(([k, v]) => (
                      <tr key={k} className="border-b border-white/5">
                        <td className="p-2 font-mono text-[10px] text-white/40 uppercase">{k}</td>
                        <td className="p-2 font-mono text-white font-bold">
                          {typeof v === "boolean" ? (v ? "TRUE" : "FALSE") : String(v)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>



          {/* Core assumptions & data gaps lists */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 print:border-black/10 pt-4">
            {/* Core analysis assumptions */}
            {results.assumptions && results.assumptions.length > 0 && (
              <div className="space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#d4af37] block">Underlying Formula Assumptions</span>
                <ul className="space-y-1.5 text-[11px] text-white/55 list-disc pl-4 leading-normal">
                  {results.assumptions.map((ass: string, idx: number) => (
                    <li key={idx}>{ass}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Profile gaps parsed */}
            {results.dataGaps && results.dataGaps.length > 0 && (
              <div className="space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">Unverified Parameters / Data Gaps</span>
                <ul className="space-y-1.5 text-[11px] text-white/55 list-disc pl-4 leading-normal">
                  {results.dataGaps.map((gap: string, idx: number) => (
                    <li key={idx}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* ==================== BOTTOM PAGE: DISCLAIMERS & VERIFICATIONS ==================== */}
      <div className="border-t border-white/10 print:border-black/20 pt-5 space-y-2">
        <h4 className="text-[9px] uppercase tracking-wider font-bold text-white/40 print:text-black/50 flex items-center gap-1 font-mono">
          <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" /> Core Simulator Disclaimer
        </h4>
        <p className="text-[9.5px] text-white/35 print:text-black/50 leading-relaxed font-sans">
          The Plan B Transition Validator acts as automated decision support based on numerical models of financial runway constraints, live regional compensation matrices, and heuristic algorithms mapping stress psychology profiles. This is an informational system and is not certified as registered legal, tax, or investment advice. The final choice to execute pivot operations, transition careers, or adjust income assets belongs entirely to you. Validate external variables independently before taking action.
        </p>
      </div>

      <div className="flex justify-center print:hidden border-t border-white/10 pt-5">
        <button
          id="btn-return-start"
          type="button"
          onClick={onReset}
          className="px-6 py-2.5 border border-white/10 hover:bg-white/5 text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer rounded-sm"
        >
          Reset and Start Over
        </button>
      </div>
    </div>
  );
}
