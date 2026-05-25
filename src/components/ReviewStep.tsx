import React from "react";
import {
  ProfileData,
  FinancialsData,
  PlanBData,
  ConstraintsData,
  PsychologyData,
  ResearchOptions,
} from "../types";
import { validateAnalyzeRequest } from "../utils/validation";
import { PlanBLogo } from "./PlanBStep";
import {
  Check,
  AlertTriangle,
  FileText,
  Briefcase,
  TrendingDown,
  Landmark,
  Brain,
  ArrowLeft,
  Shield,
  Zap,
} from "lucide-react";

interface ReviewStepProps {
  profile: ProfileData;
  financials: FinancialsData;
  planB: PlanBData;
  constraints: ConstraintsData;
  psychology: PsychologyData;
  researchOptions: ResearchOptions;
  resumeFile: File | null;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const PSYCHOLOGY_QUESTION_COPYS: Record<string, string> = {
  uncertaintyTolerance: "Decide with incomplete ambiguity",
  discipline: "Strict self-discipline",
  stressRecovery: "Recover from intense stress",
  validationDependency: "Rely heavily on positive feedback",
  impulsiveness: "Quick trigger on ideas",
  routineAdherence: "Best under repeating schedule",
  setbackRecovery: "Fast rebound from public rejections",
  uncertaintyStamina: "Endure long motivational silence",
  financialResilience: "Tolerate tight budgets",
  selfDirectedMotivation: "Independently self-motivated"
};

export default function ReviewStep({
  profile,
  financials,
  planB,
  constraints,
  psychology,
  researchOptions,
  resumeFile,
  onPrev,
  onSubmit,
  isSubmitting,
}: ReviewStepProps) {
  const payload = {
    profile,
    financials,
    planB,
    constraints,
    psychology,
    researchOptions,
  };

  const validation = validateAnalyzeRequest(payload, !!resumeFile, resumeFile);

  // Format currency
  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Helper for rendering warning/error badges
  const hasErrors = !validation.valid;
  const errorKeys = Object.keys(validation.errors);
  const warningKeys = Object.keys(validation.warnings);

  // Computed runway
  const totalOutflow = (financials.monthlyExpenses || 0) + (financials.debtObligations || 0);
  const rawRunway = totalOutflow > 0 && financials.liquidSavings ? (financials.liquidSavings / totalOutflow).toFixed(1) : "0";

  return (
    <div id="review-step-container" className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-serif text-white flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-[#d4af37]" />
          <span>Review & Confirm Data Validity</span>
        </h2>
        <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">
          Verify every input against our criteria. We block submission on critical missing entries and show warnings on soft risk indicators.
        </p>
      </div>

      {/* Validation Status Block */}
      {hasErrors ? (
        <div className="p-5 bg-rose-950/20 border border-rose-500/30 rounded-lg text-rose-300 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span>Missing or Invalid Fields Detected ({errorKeys.length})</span>
          </div>
          <p className="text-xs text-rose-300/80">
            Please review the highlighted items below or go back to correct them. The Submit button is disabled until your plan data is fully valid.
          </p>
          <ul className="list-disc pl-5 text-xs space-y-1 text-rose-200/90 max-h-[160px] overflow-y-auto">
            {errorKeys.map((key) => (
              <li key={key}>{validation.errors[key]}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-emerald-300">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>All Standard Hard Parameters Validated!</span>
          </div>
          <p className="text-xs text-emerald-300/80 mt-1">
            Excellent! Your inputs are fully filled out and compliant with the backend validation constraints.
          </p>
        </div>
      )}

      {/* Soft Warnings Block */}
      {warningKeys.length > 0 && (
        <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-lg text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
            <span>Strategic Risk Indicators / Cross-checks ({warningKeys.length})</span>
          </div>
          <ul className="list-disc pl-5 text-xs space-y-1 text-amber-300/80 max-h-[160px] overflow-y-auto">
            {warningKeys.map((key) => (
              <li key={key}>{validation.warnings[key]}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Transition Mode Banner */}
      <div className={`p-4 rounded border text-center ${
        planB.iWillQuitMyJob 
          ? "bg-rose-950/10 border-rose-500/20 text-rose-200" 
          : "bg-emerald-950/10 border-emerald-500/20 text-emerald-200"
      }`}>
        <span className="text-[10px] uppercase font-mono tracking-widest block opacity-60">Transition Mode Chosen</span>
        <span className="text-md font-bold block mt-1">
          {planB.iWillQuitMyJob 
            ? "⚠️ Full-time Resignation (Quitting current job for Plan B)" 
            : "✓ Side Hustle Mode (Keeping your current safe job)"}
        </span>
      </div>

      {/* Summary tables grouped by section */}
      <div className="space-y-6">
        
        {/* Section 1: Profile */}
        <section className="bg-white/[0.01] border border-white/5 rounded-lg overflow-hidden">
          <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#d4af37]" />
              <h3 className="text-xs uppercase tracking-widest font-semibold text-white/90">Section 1: Profile</h3>
            </div>
            {resumeFile ? (
              <span className="text-[9px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                Resume attached - Blank inputs allowed
              </span>
            ) : null}
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <tbody>
              <tr className="border-b border-white/5">
                <td className="p-3 w-1/3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Current Profession</td>
                <td className="p-3 font-semibold text-white">
                  {profile.currentProfession || <span className="text-rose-400 italic">No entry (will scan from resume)</span>}
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Industry</td>
                <td className="p-3 text-white">
                  {profile.industry || <span className="text-rose-400 italic">No entry (will scan from resume)</span>}
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Years of Experience</td>
                <td className="p-3 text-white font-mono">
                  {profile.yearsExperience !== undefined ? `${profile.yearsExperience} yrs` : <span className="text-rose-400 italic">No entry</span>}
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Geography (Current)</td>
                <td className="p-3 text-white">
                  {profile.country ? `${profile.city}, ${profile.country}` : <span className="text-rose-400 italic">No entry</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section 2: Proposed Plan B */}
        <section className="bg-white/[0.01] border border-white/5 rounded-lg overflow-hidden">
          <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center gap-2">
            <PlanBLogo className="w-4 h-4" />
            <h3 className="text-xs uppercase tracking-widest font-semibold text-white/90">Section 2: Plan B Strategy</h3>
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <tbody>
              <tr className="border-b border-white/5">
                <td className="p-3 w-1/3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Plan B Title</td>
                <td className="p-3 font-bold text-white font-sans">{planB.title}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Detailed Description</td>
                <td className="p-3 text-white/80 leading-relaxed font-sans max-w-lg truncate block" title={planB.description}>
                  {planB.description}
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Main Motivation</td>
                <td className="p-3 text-white/80 leading-relaxed font-sans">{planB.reason}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Timeline (Months)</td>
                <td className="p-3 text-white font-mono">{planB.timelineMonths} months</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Transition Mode</td>
                <td className="p-3 text-white font-sans">
                  {planB.iWillQuitMyJob ? "⚠️ Full-time Leap — Resigning from current job" : "✓ Side Hustle — Keeping current job"}
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Expected Income Steps</td>
                <td className="p-3 text-white">
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="bg-white/[0.02] p-2 rounded">
                      Month 3: <strong>{formatINR(planB.expectedIncome3Months)}</strong>
                    </div>
                    <div className="bg-white/[0.02] p-2 rounded">
                      Month 6: <strong>{formatINR(planB.expectedIncome6Months)}</strong>
                    </div>
                    <div className="bg-white/[0.02] p-2 rounded">
                      Month 12: <strong>{formatINR(planB.expectedIncome12Months)}</strong>
                    </div>
                  </div>
                </td>
              </tr>
              {planB.targetCountry && (
                <tr>
                  <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Target Destination</td>
                  <td className="p-3 text-[#d4af37]">
                    {planB.targetCity ? `${planB.targetCity}, ` : ""}{planB.targetCountry}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Section 3: Financials & Computed Runway */}
        <section className="bg-white/[0.01] border border-white/5 rounded-lg overflow-hidden">
          <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#d4af37]" />
              <h3 className="text-xs uppercase tracking-widest font-semibold text-white/90">Section 3: Financials</h3>
            </div>
            <div className="text-[10px] text-[#d4af37] font-mono">
              Computed Runway: <strong>{rawRunway} Months</strong>
            </div>
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <tbody>
              <tr className="border-b border-white/5">
                <td className="p-3 w-1/3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Monthly Income (Corporate)</td>
                <td className="p-3 text-white font-mono">{formatINR(financials.monthlyIncome)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Liquid Cash Buffer</td>
                <td className="p-3 text-emerald-400 font-mono font-semibold">{formatINR(financials.liquidSavings)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Monthly Living Costs (Burn)</td>
                <td className="p-3 text-rose-300 font-mono font-semibold">{formatINR(financials.monthlyExpenses)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Dependents</td>
                <td className="p-3 text-white font-mono">{financials.dependents}</td>
              </tr>
              <tr>
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Monthly Debt (EMIs)</td>
                <td className="p-3 text-white font-mono">{formatINR(financials.debtObligations)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section 4: Constraints */}
        <section className="bg-white/[0.01] border border-white/5 rounded-lg overflow-hidden">
          <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[#d4af37]" />
            <h3 className="text-xs uppercase tracking-widest font-semibold text-white/90">Section 4: Boundaries & Downside</h3>
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <tbody>
              <tr className="border-b border-white/5">
                <td className="p-3 w-1/3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Success Definition</td>
                <td className="p-3 text-white leading-relaxed">{constraints.successDefinition}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Biggest Fear</td>
                <td className="p-3 text-white leading-relaxed">{constraints.biggestFear}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Acceptable Downside</td>
                <td className="p-3 text-white leading-relaxed">{constraints.acceptableDownside}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Minimum Acceptable Salary</td>
                <td className="p-3 text-white font-mono font-semibold">{formatINR(constraints.minimumAcceptableSalary)} /mo</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Months without income</td>
                <td className="p-3 text-white font-mono">{constraints.acceptableMonthsWithoutIncome} Months tolerance</td>
              </tr>
              <tr>
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Family Pressure Level</td>
                <td className="p-3 text-white font-mono font-bold">
                  {constraints.familyPressureLevel} / 5 {" "}
                  <span className="text-white/40 font-normal">({["None", "Mild", "Neutral", "Moderate", "Severe"][constraints.familyPressureLevel - 1]})</span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section 5: Psychology Index */}
        <section className="bg-white/[0.01] border border-white/5 rounded-lg overflow-hidden">
          <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#d4af37]" />
            <h3 className="text-xs uppercase tracking-widest font-semibold text-white/90">Section 5: Stress Personality Index</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
            {Object.keys(PSYCHOLOGY_QUESTION_COPYS).map((field) => {
              const score = psychology[field] || 3;
              return (
                <div key={field} className="bg-[#0f0f12] p-3 flex justify-between items-center text-xs">
                  <span className="text-white/60 font-sans">{PSYCHOLOGY_QUESTION_COPYS[field]}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#d4af37] font-mono font-bold text-sm bg-amber-950/25 px-2.5 py-1 rounded">
                      {score}
                    </span>
                    <span className="text-[10px] text-white/30 hidden md:inline">({["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"][score - 1]})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 6: Files & Intelligence Config */}
        <section className="bg-white/[0.01] border border-white/5 rounded-lg overflow-hidden">
          <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#d4af37]" />
            <h3 className="text-xs uppercase tracking-widest font-semibold text-white/90">Section 6: Attachments & Active Search</h3>
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <tbody>
              <tr className="border-b border-white/5">
                <td className="p-3 w-1/3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Uploaded PDF Resume</td>
                <td className="p-3 text-white">
                  {resumeFile ? (
                    <span className="font-semibold text-[#d4af37] flex items-center gap-1.5">
                      <FileText className="w-4.5 h-4.5" />
                      <span>{resumeFile.name} ({(resumeFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    </span>
                  ) : (
                    <span className="text-white/45 italic">No resume attached (Using manual profile fields)</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-3 text-white/40 font-mono uppercase tracking-wider text-[10px]">Upstream Web Research Search</td>
                <td className="p-3 text-white font-semibold">
                  {researchOptions.enableResearch ? (
                    <span className="text-emerald-400">✓ Enabled — Searching web for real salary benchmarks</span>
                  ) : (
                    <span className="text-white/50">Disabled — Processing baseline conditions offline</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      {/* Button Row */}
      <div className="flex justify-between pt-4 border-t border-white/10">
        <button
          id="review-prev-btn"
          type="button"
          disabled={isSubmitting}
          onClick={onPrev}
          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/10 transition-colors flex items-center gap-2 rounded-sm cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Inputs</span>
        </button>

        <button
          id="btn-confirm-review"
          type="button"
          disabled={hasErrors || isSubmitting}
          onClick={onSubmit}
          className="px-8 py-3 bg-[#d4af37] hover:bg-[#d4af37]/90 text-black font-bold uppercase tracking-widest text-xs flex items-center gap-2 rounded-sm duration-150 cursor-pointer disabled:opacity-50 disabled:bg-white/10 disabled:text-white/30"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              <span>Submitting Scenario...</span>
            </>
          ) : (
            <>
              <span>Submit & Stress-Test Plan</span>
              <Zap className="w-4 h-4 text-black font-black" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
