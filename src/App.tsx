import React, { useState, useEffect } from "react";
import {
  ProfileData,
  FinancialsData,
  PlanBData,
  ConstraintsData,
  PsychologyData,
  ResearchOptions,
  ValidationResults,
  SSEStage,
  SSEMessage,
} from "./types";

import ProfileStep from "./components/ProfileStep";
import FinancialsStep from "./components/FinancialsStep";
import PlanBStep from "./components/PlanBStep";
import ConstraintsStep from "./components/ConstraintsStep";
import PsychologyStep from "./components/PsychologyStep";
import ResumeStep from "./components/ResumeStep";
import ReviewStep from "./components/ReviewStep";
import ResultsDisplay from "./components/ResultsDisplay";
import { getUserId } from "./utils/userId";
import LandingPage from "./components/LandingPage";

import {
  Sparkles,
  ClipboardList,
  Compass,
  ArrowRight,
  RefreshCw,
  Gauge,
  UserCheck,
  Check,
  Cpu,
  Loader2,
  Trash2
} from "lucide-react";

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // 1. Core form states with clean defaults
  const [profile, setProfile] = useState<ProfileData>({
    currentProfession: "",
    industry: "",
    yearsExperience: undefined,
    country: "",
    city: "",
  });

  const [financials, setFinancials] = useState<FinancialsData>({
    monthlyIncome: 0,
    liquidSavings: 0,
    monthlyExpenses: 0,
    dependents: undefined,
    debtObligations: undefined,
    emergencyFundMonths: 0,
  });

  const [planB, setPlanB] = useState<PlanBData>({
    title: "",
    description: "",
    reason: "",
    timelineMonths: 6,
    iWillQuitMyJob: false,
    expectedIncome3Months: undefined,
    expectedIncome6Months: undefined,
    expectedIncome12Months: undefined,
    reversible: true,
    targetCountry: "",
    targetCity: "",
  });

  const [constraints, setConstraints] = useState<ConstraintsData>({
    successDefinition: "",
    biggestFear: "",
    acceptableDownside: "",
    minimumAcceptableSalary: undefined,
    acceptableMonthsWithoutIncome: undefined,
    familyPressureLevel: 1,
  });

  const [psychology, setPsychology] = useState<PsychologyData>({});
  const [researchOptions, setResearchOptions] = useState<ResearchOptions>({
    enableResearch: true,
  });

  // Loading, Analysis and Event States
  const [validationResult, setValidationResult] = useState<ValidationResults | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sseStage, setSseStage] = useState<SSEStage>("SANITIZE");
  const [sseMessages, setSseMessages] = useState<Array<{ stage: SSEStage; message: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ message: string; code?: string; requestId?: string | null } | null>(null);
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  // Load from Drafts (localStorage Persistence)
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("planb_draft_profile");
      const savedFinancials = localStorage.getItem("planb_draft_financials");
      const savedPlanB = localStorage.getItem("planb_draft_planB");
      const savedConstraints = localStorage.getItem("planb_draft_constraints");
      const savedPsychology = localStorage.getItem("planb_draft_psychology");

      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedFinancials) setFinancials(JSON.parse(savedFinancials));
      if (savedPlanB) setPlanB(JSON.parse(savedPlanB));
      if (savedConstraints) setConstraints(JSON.parse(savedConstraints));
      if (savedPsychology) setPsychology(JSON.parse(savedPsychology));
    } catch (e) {
      console.warn("Could not retrieve localStorage draft statistics:", e);
    }
  }, []);

  // Save to Drafts on Changes
  useEffect(() => {
    localStorage.setItem("planb_draft_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("planb_draft_financials", JSON.stringify(financials));
  }, [financials]);

  useEffect(() => {
    localStorage.setItem("planb_draft_planB", JSON.stringify(planB));
  }, [planB]);

  useEffect(() => {
    localStorage.setItem("planb_draft_constraints", JSON.stringify(constraints));
  }, [constraints]);

  useEffect(() => {
    localStorage.setItem("planb_draft_psychology", JSON.stringify(psychology));
  }, [psychology]);

  // Clear Form Draft
  const handleClearDraft = () => {
    localStorage.removeItem("planb_draft_profile");
    localStorage.removeItem("planb_draft_financials");
    localStorage.removeItem("planb_draft_planB");
    localStorage.removeItem("planb_draft_constraints");
    localStorage.removeItem("planb_draft_psychology");

    setProfile({
      currentProfession: "",
      industry: "",
      yearsExperience: undefined,
      country: "",
      city: "",
    });

    setFinancials({
      monthlyIncome: 0,
      liquidSavings: 0,
      monthlyExpenses: 0,
      dependents: undefined,
      debtObligations: undefined,
      emergencyFundMonths: 0,
    });

    setPlanB({
      title: "",
      description: "",
      reason: "",
      timelineMonths: 6,
      iWillQuitMyJob: false,
      expectedIncome3Months: undefined,
      expectedIncome6Months: undefined,
      expectedIncome12Months: undefined,
      reversible: true,
      targetCountry: "",
      targetCity: "",
    });

    setConstraints({
      successDefinition: "",
      biggestFear: "",
      acceptableDownside: "",
      minimumAcceptableSalary: undefined,
      acceptableMonthsWithoutIncome: undefined,
      familyPressureLevel: 1,
    });

    setPsychology({});
    setResumeFile(null);
    setStep(1);
    setShowLanding(true);
    setConfirmClear(false);
  };

  // Automated pipeline simulation timer during analysis submission
  useEffect(() => {
    let timer: any;
    if (isSubmitting) {
      const stages: SSEStage[] = [
        "SANITIZE",
        "RESUME_PROFILE",
        "RUNWAY",
        "PSYCHOLOGY",
        "RESUME_MARKET_VALUE",
        "RESEARCH",
        "SCORING",
        "OPENAI_CORE",
        "GEMINI_DEEP"
      ];
      setSseStage("SANITIZE");
      setSseMessages([{ stage: "SANITIZE", message: "Reviewing profile metrics and target configurations..." }]);
      
      let index = 0;
      timer = setInterval(() => {
        if (index < stages.length - 1) {
          index++;
          const nextStage = stages[index];
          setSseStage(nextStage);
          
          let msg = "Processing step...";
          if (nextStage === "RESUME_PROFILE") msg = "Extracting resume parameters and training landmarks...";
          if (nextStage === "RUNWAY") msg = "Matching savings reserve boundaries against absolute cost curves...";
          if (nextStage === "PSYCHOLOGY") msg = "Evaluating risk tolerance, routine adherence, and stress recovery scores...";
          if (nextStage === "RESUME_MARKET_VALUE") msg = "Aligning years of experience against live country salaries...";
          if (nextStage === "RESEARCH") msg = "Accessing live regional demand profiles and price indices...";
          if (nextStage === "SCORING") msg = "Computing alternative opportunity costs and calibration offsets...";
          if (nextStage === "OPENAI_CORE") msg = "Running complex career transition threat simulation engines...";
          if (nextStage === "GEMINI_DEEP") msg = "Synthesizing full-scale feedback dossiers and strategic guidelines...";
          
          setSseMessages((prev) => [
            ...prev,
            { stage: nextStage, message: msg }
          ]);
        }
      }, 5000); // changes stage indicator every 5 seconds
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSubmitting]);

  // Combined single submit handler conforming to the exact specification
  const handleValidateSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setErrorDetails(null);
    setSseMessages([]);
    setSseStage("SANITIZE");
    setSseMessages([{ stage: "SANITIZE", message: "Reviewing core credentials..." }]);

    const sanitizedPayload = {
      profile: { ...profile },
      financials: { ...financials },
      planB: { ...planB },
      constraints: { ...constraints },
      psychology: { ...psychology },
      researchOptions: { ...researchOptions },
    };

    // Rule 4: Removed fields — never send
    delete (sanitizedPayload.financials as any).emergencyFundMonths;
    delete (sanitizedPayload.financials as any).monthlySavings;
    delete (sanitizedPayload.planB as any).engagementMode;
    delete (sanitizedPayload.planB as any).continueCurrentJob;
    delete (sanitizedPayload.planB as any).canStartAsSideProject;

    try {
      let response;
      const headersMap: Record<string, string> = {
        "ngrok-skip-browser-warning": "true",
        "X-User-Id": getUserId(),
      };

      // Safe AbortSignal.timeout browser helper fallback preventing TypeScript definitions compile conflicts
      const signal = (AbortSignal as any).timeout ? (AbortSignal as any).timeout(240000) : undefined;

      if (resumeFile) {
        const formData = new FormData();
        formData.append("request", new Blob([JSON.stringify(sanitizedPayload)], { type: "application/json" }));
        formData.append("resume", resumeFile, resumeFile.name);

        response = await fetch("/api/analyze", {
          method: "POST",
          headers: headersMap,
          body: formData,
          signal,
        });
      } else {
        response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            ...headersMap,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sanitizedPayload),
          signal,
        });
      }

      if (!response.ok) {
        let errData: any = {};
        try {
          errData = await response.json();
        } catch (e) {
          try {
            const rawText = await response.text();
            errData = { error: { message: rawText || "Failed to analyze Plan B options." } };
          } catch (inner) {
            errData = { error: { message: "Internal server error." } };
          }
        }

        const errObj = errData.error || errData;
        const errMsg = errObj.message || "An upstream error occurred during analysis.";
        const errCode = errObj.code || "INTERNAL_ERROR";
        const reqId = errObj.requestId || null;

        setErrorDetails({
          message: errMsg,
          code: errCode,
          requestId: reqId
        });
        setError(errMsg);
        setIsSubmitting(false);
        return;
      }

      const report = await response.json();
      const finalReport = report?.result || report;

      if (finalReport) {
        // Normalize overallVerdict support
        if (!finalReport.verdict && finalReport.overallVerdict) {
          finalReport.verdict = finalReport.overallVerdict;
        }

        if (finalReport.verdict) {
          setSseStage("COMPLETE");
          setValidationResult(finalReport);
          setStep(8); // Show Results Display Dashboard
          setIsSubmitting(false);
          return;
        }
      }

      throw new Error("Analysis completed but did not yield verdict statistics.");
    } catch (err: any) {
      console.error("Submission error:", err);
      const msg = err.message || "Failed to finalize calculation parameters. Please verify your variables.";
      setError(msg);
      setErrorDetails({
        message: msg,
        code: "INTERNAL_ERROR",
        requestId: null
      });
      setIsSubmitting(false);
    }
  };

  const stepsConfig = [
    { num: 1, name: "Profile" },
    { num: 2, name: "Financials" },
    { num: 3, name: "Plan B" },
    { num: 4, name: "Constraints" },
    { num: 5, name: "Psychology" },
    { num: 6, name: "Resume & Research" },
    { num: 7, name: "Review & Confirm" },
  ];

  // Stage details for loader screen
  const sseStagesConfig: Array<{ stage: SSEStage; label: string }> = [
    { stage: "SANITIZE", label: "Inputs Sanitization Check" },
    { stage: "RESUME_PROFILE", label: "Parsing Resume Qualifications" },
    { stage: "RUNWAY", label: "Financial Runway Extraction" },
    { stage: "PSYCHOLOGY", label: "Stress Psychology Profiling" },
    { stage: "RESUME_MARKET_VALUE", label: "Resume Wage Benchmark Mapping" },
    { stage: "RESEARCH", label: "Regional Web Pricing Research" },
    { stage: "SCORING", label: "Confidence Metric Allocation" },
    { stage: "OPENAI_CORE", label: "Deep Scenario Simulation (OpenAI)" },
    { stage: "GEMINI_DEEP", label: "Deep Reasoning Valuation (Gemini)" },
    { stage: "COMPLETE", label: "Decision Report Assembly" },
  ];

  const activeStageIndex = sseStagesConfig.findIndex((item) => item.stage === sseStage);

  return (
    <div id="app-root-container" className="min-h-screen flex flex-col bg-[#0a0a0c] text-[#e0e0e0]">
      
      {/* Upper navigation header */}
      <header className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/10 bg-[#0f0f12] print:hidden">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={() => setShowLanding(true)}
          title="Return to Landing Page"
        >
          <div className="w-8 h-8 bg-[#d4af37] group-hover:bg-[#f3e3a9] rounded-sm rotate-45 flex items-center justify-center shadow-md transition-colors duration-200">
            <span className="text-black font-bold -rotate-45 text-xs font-serif">B</span>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-medium tracking-widest uppercase text-white/95 flex flex-wrap items-center gap-2 group-hover:text-white transition-colors duration-200">
              Plan B <span className="font-light text-white/40">Validator</span>
            </h1>
            <span className="text-[10px] text-white/30 tracking-wider font-light block">Scenario-based transition stress tester</span>
          </div>
        </div>

        {!showLanding && (
          <div className="flex items-center gap-4">
            {confirmClear ? (
              <div className="flex items-center gap-2 animate-pulse bg-red-950/40 border border-red-500/30 px-3 py-1 rounded">
                <button
                  id="clear-draft-confirm-btn"
                  type="button"
                  onClick={handleClearDraft}
                  className="text-[10px] tracking-widest uppercase text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer"
                >
                  Confirm Clear
                </button>
                <span className="text-white/20 text-xs">|</span>
                <button
                  id="clear-draft-cancel-btn"
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="text-[10px] tracking-widest uppercase text-white/50 hover:text-white font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                id="clear-draft-btn"
                type="button"
                onClick={() => setConfirmClear(true)}
                className="text-[10px] tracking-widest uppercase text-white/40 hover:text-red-400 font-semibold px-2 py-1 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Clear draft inputs"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500/80" />
                <span className="hidden sm:inline">Clear draft</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Container core */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8">
        
        {/* Dynamic Multi-Step Navigator Dots */}
        {step <= 7 && !showLanding && !isSubmitting && (
          <div id="navigator-dots-wrapper" className="mb-10 print:hidden border-b border-white/5 pb-4">
            <nav className="flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-3 text-[11px] font-semibold tracking-widest text-white/40">
              {stepsConfig.map((item) => {
                const isActive = step === item.num;
                const isCompleted = step > item.num;
                return (
                  <button
                    key={item.num}
                    type="button"
                    disabled={item.num > step && !isCompleted}
                    onClick={() => setStep(item.num)}
                    className={`transition-all duration-200 cursor-pointer text-left uppercase flex items-center gap-2 pb-1 ${
                      isActive
                        ? "text-[#d4af37] border-b-2 border-[#d4af37] font-bold"
                        : isCompleted
                        ? "text-white/80 hover:text-white border-b-2 border-transparent"
                        : "text-white/30 hover:text-white/50 border-b-2 border-transparent"
                    }`}
                  >
                    <span className="font-mono text-[9px] opacity-60">0{item.num}</span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Validation Execution Stages Screener */}
        {isSubmitting && (
          <div id="submitting-stages-screener" className="bg-[#0f0f12] border border-white/10 rounded-xl p-8 space-y-8 animate-fade-in text-center my-6 max-w-2xl mx-auto shadow-xl">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
              <h2 className="text-xl font-serif font-light text-white uppercase tracking-wider">
                Simulating Scenario Risk Drivers
              </h2>
              <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
                Please wait while we stress-test your financials against target regional demand, compute the psychological risk curve, and run deep AI scenario benchmarks. This might take 30 to 60 seconds.
              </p>
            </div>

            {/* Stepper tracking columns */}
            <div className="max-w-md mx-auto space-y-3 bg-white/[0.02] p-6 rounded-lg border border-white/5 text-left">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] pl-1">
                Validators pipeline:
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {sseStagesConfig.map((item, index) => {
                  const isFinished = index < activeStageIndex;
                  const isCurrent = item.stage === sseStage;
                  return (
                    <div
                      key={item.stage}
                      className={`flex items-center justify-between p-2 py-1.5 rounded text-xs leading-none transition-colors duration-150 ${
                        isCurrent
                          ? "bg-white/5 text-white border border-white/10 font-semibold"
                          : isFinished
                          ? "text-emerald-400 font-medium"
                          : "text-white/30 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isFinished ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isCurrent ? (
                          <Loader2 className="w-3.5 h-3.5 text-[#d4af37] animate-spin" />
                        ) : (
                          <div className="h-1.5 w-1.5 bg-white/20 rounded-full ml-1"></div>
                        )}
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] font-mono tracking-widest uppercase opacity-70">
                        {isFinished ? "ok" : isCurrent ? "calc" : "idle"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live stream logs feed ticker */}
            <div className="text-center font-mono text-[10px] text-[#d4af37] bg-[#d4af37]/10 py-2.5 px-3 rounded-md max-w-sm mx-auto border border-[#d4af37]/20 uppercase tracking-wider">
              {sseMessages.length > 0
                ? `⚡ ${sseMessages[sseMessages.length - 1].message}`
                : "🌐 Tuning live satellite intelligence routers..."}
            </div>
          </div>
        )}

        {/* Step contents renderers */}
        {!isSubmitting && (
          <>
            {showLanding ? (
              <LandingPage onStart={() => { setShowLanding(false); setStep(1); }} />
            ) : (
              <div className="bg-[#0f0f12] border border-white/10 rounded-xl p-6 sm:p-8 md:p-10 shadow-xl hover:border-white/15 transition-colors duration-300">
                {errorDetails && (
                  <div className="bg-red-950/25 text-red-200 p-4 rounded-lg border border-red-800/40 mb-6 flex flex-col gap-2.5 text-sm">
                    <div className="flex gap-3">
                      <div className="font-bold flex-shrink-0 mt-0.5">⚠️ Error:</div>
                      <div className="leading-relaxed">
                        {errorDetails.message}
                      </div>
                    </div>
                    {(errorDetails.code || errorDetails.requestId) && (
                      <div className="mt-1 pl-8 border-t border-red-950/10 pt-2 font-mono text-[10px] text-red-300/60 flex flex-wrap gap-x-4 gap-y-1">
                        {errorDetails.code && (
                          <span>ERROR_CODE: {errorDetails.code}</span>
                        )}
                        {errorDetails.requestId && (
                          <span>REQUEST_ID: {errorDetails.requestId}</span>
                        )}
                      </div>
                    )}
                    <div className="pl-8 pt-1">
                      <button
                        type="button"
                        onClick={handleValidateSubmit}
                        className="underline font-semibold text-[#d4af37] hover:text-[#c29e2f] text-xs transition-colors cursor-pointer block"
                      >
                        Retry Validation Process
                      </button>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <ProfileStep
                    data={profile}
                    onChange={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
                    onNext={() => setStep(2)}
                    file={resumeFile}
                    onChangeFile={setResumeFile}
                  />
                )}

                {step === 2 && (
                  <FinancialsStep
                    data={financials}
                    onChange={(updated) => setFinancials((prev) => ({ ...prev, ...updated }))}
                    onPrev={() => setStep(1)}
                    onNext={() => setStep(3)}
                  />
                )}

                {step === 3 && (
                  <PlanBStep
                    data={planB}
                    onChange={(updated) => setPlanB((prev) => ({ ...prev, ...updated }))}
                    onPrev={() => setStep(2)}
                    onNext={() => setStep(4)}
                  />
                )}

                {step === 4 && (
                  <ConstraintsStep
                    data={constraints}
                    onChange={(updated) => setConstraints((prev) => ({ ...prev, ...updated }))}
                    onPrev={() => setStep(3)}
                    onNext={() => setStep(5)}
                    expectedIncome12Months={planB.expectedIncome12Months}
                  />
                )}

                {step === 5 && (
                  <PsychologyStep
                    data={psychology}
                    onChange={(updated) => setPsychology(updated)}
                    onPrev={() => setStep(4)}
                    onNext={() => setStep(6)}
                    hasUploadedResume={!!resumeFile}
                  />
                )}

                {step === 6 && (
                  <ResumeStep
                    researchOptions={researchOptions}
                    onChangeResearch={(updated) => setResearchOptions(updated)}
                    file={resumeFile}
                    onChangeFile={(file) => setResumeFile(file)}
                    onPrev={() => setStep(5)}
                    onSubmit={() => setStep(7)}
                    submitting={isSubmitting}
                  />
                )}

                {step === 7 && (
                  <ReviewStep
                    profile={profile}
                    financials={financials}
                    planB={planB}
                    constraints={constraints}
                    psychology={psychology}
                    researchOptions={researchOptions}
                    resumeFile={resumeFile}
                    onPrev={() => setStep(6)}
                    onSubmit={handleValidateSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}

                {step === 8 && validationResult && (
                  <ResultsDisplay
                    results={validationResult}
                    userMonthlyIncome={financials.monthlyIncome}
                    onReset={() => {
                      setStep(1);
                      setShowLanding(true);
                      setValidationResult(null);
                      setResumeFile(null);
                    }}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Humble Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-[10px] tracking-widest uppercase text-white/30 bg-[#0a0a0c] print:hidden max-w-4xl mx-auto w-full">
        <p className="max-w-[600px] mx-auto px-4 leading-relaxed">
          Plan B Validator is an analytical framework and should not be considered financial or professional career advice. Validate all market data independently.
        </p>
        <p className="mt-2 font-mono text-[9px] opacity-60">© 2026 Plan B Validator • v1.0.42 • TX_DC_01</p>
      </footer>
    </div>
  );
}
