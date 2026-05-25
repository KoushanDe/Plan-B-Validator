import React, { useState, useEffect, useRef } from "react";
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
  Trash2,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon
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
  const [sseStage, setSseStage] = useState<any>("SANITIZE");
  const [sseMessages, setSseMessages] = useState<Array<{ stage: any; message: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ message: string; code?: string; requestId?: string | null } | null>(null);
  const [confirmClear, setConfirmClear] = useState<boolean>(false);
  const [fontSizeIncrease, setFontSizeIncrease] = useState<boolean>(false);
  const [isLightTheme, setIsLightTheme] = useState<boolean>(false);

  useEffect(() => {
    if (fontSizeIncrease) {
      document.documentElement.classList.add('font-lg');
    } else {
      document.documentElement.classList.remove('font-lg');
    }
  }, [fontSizeIncrease]);

  useEffect(() => {
    if (isLightTheme) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isLightTheme]);

  // Advanced pipeline state/control synchronization
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [pendingReportResult, setPendingReportResult] = useState<any>(null);
  const [submissionError, setSubmissionError] = useState<any>(null);
  const activeStageRef = useRef<HTMLDivElement>(null);

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

  const pendingReportResultRef = useRef<any>(null);
  const submissionErrorRef = useRef<any>(null);
  
  useEffect(() => {
    pendingReportResultRef.current = pendingReportResult;
  }, [pendingReportResult]);
  
  useEffect(() => {
    submissionErrorRef.current = submissionError;
  }, [submissionError]);

  // Automated pipeline simulation timer during analysis submission
  useEffect(() => {
    let timeoutId: any;
    
    if (isSubmitting) {
      const stages: string[] = [
        "SANITIZE",
        ...(resumeFile ? ["RESUME_PROFILE"] : []),
        "RUNWAY",
        "PSYCHOLOGY",
        ...(resumeFile ? ["RESUME_MARKET_VALUE"] : []),
        ...(researchOptions.enableResearch ? ["RESEARCH"] : []),
        ...(planB.iWillQuitMyJob ? ["MOCK_REHIRE"] : []),
        "SCORING",
        "OPENAI_CORE",
        "GEMINI_DEEP",
        "COMPLETE"
      ];

      const runStage = (index: number) => {
        if (index >= stages.length) return;

        const currentStageName = stages[index];
        setSseStage(currentStageName);
        setActiveStageIdx(index);

        let msg = "Processing step...";
        if (currentStageName === "SANITIZE") msg = "Reviewing profile metrics and target configurations...";
        if (currentStageName === "RESUME_PROFILE") msg = "Extracting resume parameters and training landmarks...";
        if (currentStageName === "RUNWAY") msg = "Matching savings reserve boundaries against absolute cost curves...";
        if (currentStageName === "PSYCHOLOGY") msg = "Evaluating risk tolerance, routine adherence, and stress recovery scores...";
        if (currentStageName === "RESUME_MARKET_VALUE") msg = "Aligning years of experience against live country salaries...";
        if (currentStageName === "RESEARCH") msg = "Accessing live regional demand profiles and price indices...";
        if (currentStageName === "MOCK_REHIRE") msg = "Assessing corporate re-hire market and reentry complexity as a backup buffer...";
        if (currentStageName === "SCORING") msg = "Computing alternative opportunity costs and calibration offsets...";
        if (currentStageName === "OPENAI_CORE") msg = "Running complex career transition threat simulation engines...";
        if (currentStageName === "GEMINI_DEEP") msg = "Synthesizing full-scale feedback dossiers and strategic guidelines...";
        if (currentStageName === "COMPLETE") msg = "Waiting for final response payload securely...";

        setSseMessages((prev) => {
          if (prev.some((m) => m.stage === currentStageName)) return prev;
          return [...prev, { stage: currentStageName, message: msg }];
        });

        const report = pendingReportResultRef.current;
        const err = submissionErrorRef.current;

        if (index === stages.length - 1) {
          if (report) {
            setValidationResult(report);
            setStep(8);
            setIsSubmitting(false);
            return;
          } else if (err) {
            setError(err.message);
            setErrorDetails(err);
            setIsSubmitting(false);
            return;
          }
          // If neither, poll at the COMPLETE stage until API returns
          timeoutId = setTimeout(() => {
            runStage(index);
          }, 300);
          return;
        }

        // Custom non-uniform simulated processing intervals (in milliseconds)
        let duration = 3000;
        if (!report && !err) {
          // Standard real-feeling variable paces
          switch (currentStageName) {
            case "SANITIZE": duration = 1400; break;
            case "RESUME_PROFILE": duration = 2200; break;
            case "RUNWAY": duration = 1800; break;
            case "PSYCHOLOGY": duration = 2500; break;
            case "RESUME_MARKET_VALUE": duration = 2400; break;
            case "RESEARCH": duration = 3400; break;
            case "MOCK_REHIRE": duration = 3000; break;
            case "SCORING": duration = 1900; break;
            case "OPENAI_CORE": duration = 15000; break;
            case "GEMINI_DEEP": duration = 15000; break;
            default: duration = 2500;
          }
        } else {
          // Accelerate to display results if the compilation actually finished early
          switch (currentStageName) {
            case "SANITIZE": duration = 300; break;
            case "RESUME_PROFILE": duration = 300; break;
            case "RUNWAY": duration = 300; break;
            case "PSYCHOLOGY": duration = 300; break;
            case "RESUME_MARKET_VALUE": duration = 300; break;
            case "RESEARCH": duration = 400; break;
            case "MOCK_REHIRE": duration = 400; break;
            case "SCORING": duration = 300; break;
            case "OPENAI_CORE": duration = 300; break;
            case "GEMINI_DEEP": duration = 400; break;
            default: duration = 300;
          }
        }

        timeoutId = setTimeout(() => {
          runStage(index + 1);
        }, duration);
      };

      runStage(0);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSubmitting, planB.iWillQuitMyJob]);

  // Autoscroll effect for pipeline stepper
  useEffect(() => {
    if (isSubmitting && activeStageRef.current) {
      activeStageRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [sseStage, isSubmitting]);

  // Combined single submit handler conforming to the exact specification
  const handleValidateSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setErrorDetails(null);
    setPendingReportResult(null);
    setSubmissionError(null);
    setActiveStageIdx(0);
    setSseStage("SANITIZE");
    setSseMessages([{ stage: "SANITIZE", message: "Reviewing profile metrics and target configurations..." }]);

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
        let errMsg = errObj.message || ((errObj.code === "RATE_LIMITED" || response.status === 429) ? "You have reached the maximum number of requests allowed. Please wait a while before trying again." : "An upstream error occurred during analysis.");
        
        if (!errObj.message && (errObj.code === "RATE_LIMITED" || response.status === 429)) {
          errMsg = "You have reached the maximum number of requests allowed. Please wait a while before trying again.";
        }
        // Override generic API error messages for rate limiting
        if ((typeof errMsg === "string" && errMsg.includes("API error (429)")) || response.status === 429 || errObj.code === "RATE_LIMITED") {
          errMsg = "You have reached the maximum number of requests allowed. Please wait a while before trying again.";
        }
        
        const errCode = errObj.code || (response.status === 429 ? "RATE_LIMITED" : "INTERNAL_ERROR");
        const reqId = errObj.requestId || null;

        setErrorDetails({
          message: errMsg,
          code: errCode,
          requestId: reqId
        });
        setError(errMsg);
        setSubmissionError({
          message: errMsg,
          code: errCode,
          requestId: reqId
        });
        setIsSubmitting(false);
        return;
      }

      const report = await response.json();
      const finalReport = report?.result || report;
      if (finalReport && !finalReport.requestId && report.requestId) {
        finalReport.requestId = report.requestId;
      }

      if (finalReport) {
        // Normalize overallVerdict support
        if (!finalReport.verdict && finalReport.overallVerdict) {
          finalReport.verdict = finalReport.overallVerdict;
        }

        if (finalReport.verdict) {
          setPendingReportResult(finalReport);
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
      setSubmissionError({
        message: msg,
        code: "INTERNAL_ERROR",
        requestId: null
      });
      setIsSubmitting(false);
    }
  };

  const stepsConfig = [
    { num: 1, name: "Profile" },
    { num: 2, name: "Plan B" },
    { num: 3, name: "Financials" },
    { num: 4, name: "Constraints" },
    { num: 5, name: "Psychology" },
    { num: 6, name: "Resume & Research" },
    { num: 7, name: "Review & Confirm" },
  ];

  // Stage details for loader screen
  const sseStagesConfig: Array<{ stage: any; label: string }> = [
    { stage: "SANITIZE", label: "Inputs Sanitization Check" },
    ...(resumeFile ? [{ stage: "RESUME_PROFILE", label: "Parsing Resume Qualifications" }] : []),
    { stage: "RUNWAY", label: "Financial Runway Extraction" },
    { stage: "PSYCHOLOGY", label: "Stress Psychology Profiling" },
    ...(resumeFile ? [{ stage: "RESUME_MARKET_VALUE", label: "Resume Wage Benchmark Mapping" }] : []),
    ...(researchOptions.enableResearch ? [{ stage: "RESEARCH", label: "Regional Web Pricing Research" }] : []),
    ...(planB.iWillQuitMyJob ? [{ stage: "MOCK_REHIRE", label: "Assessing Corporate Re-hire Market" }] : []),
    { stage: "SCORING", label: "Confidence Metric Allocation" },
    { stage: "OPENAI_CORE", label: "Deep Scenario Simulation" },
    { stage: "GEMINI_DEEP", label: "Deep Reasoning Valuation" },
    { stage: "COMPLETE", label: "Decision Report Assembly" },
  ];

  const activeStageIndex = sseStagesConfig.findIndex((item) => item.stage === sseStage);

  return (
    <div id="app-root-container" className="min-h-screen flex flex-col bg-app-base text-app-main print:block">
      
      {/* Upper navigation header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-app-border bg-app-panel-glass backdrop-blur-md print:hidden">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={() => setShowLanding(true)}
          title="Return to Landing Page"
        >
          <img 
            src="/favicon.svg" 
            alt="Logo"
            className="w-14 h-14 group-hover:scale-105 transition-transform duration-200"
          />
          <div>
            <h1 className="text-base sm:text-lg font-medium tracking-widest uppercase text-app-main flex flex-wrap items-center gap-2 group-hover:text-app-main transition-colors duration-200">
              Plan B <span className="font-light text-app-dim">Validator</span>
            </h1>
            <span className="text-[10px] text-app-dim tracking-wider font-light block">Scenario-based transition stress tester</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLightTheme(prev => !prev)}
            className="text-[10px] tracking-widest uppercase text-app-dim hover:text-app-main font-semibold px-2 py-1 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Toggle Light/Dark Theme"
          >
            {isLightTheme ? <Moon className="w-4 h-4 text-app-gold" /> : <Sun className="w-4 h-4 text-app-main/60" />}
          </button>
          
          <button
            type="button"
            onClick={() => setFontSizeIncrease(prev => !prev)}
            className="text-[10px] tracking-widest uppercase text-app-dim hover:text-app-main font-semibold px-2 py-1 flex items-center gap-1.5 transition-colors cursor-pointer mr-2"
            title="Toggle Accessibility Font Size"
          >
            {fontSizeIncrease ? (
              <div className="flex items-end gap-0.5 text-app-gold">
                <span className="text-[10px] leading-none mb-[1px]">A</span>
                <span className="text-[14px] leading-none">A</span>
              </div>
            ) : (
              <div className="flex items-end gap-0.5 text-app-muted">
                <span className="text-[10px] leading-none mb-[1px]">A</span>
                <span className="text-[14px] leading-none">A</span>
              </div>
            )}
          </button>
          
          {!showLanding && step !== 8 && (
            <div className="flex items-center gap-4">
              {confirmClear ? (
                <div className="flex items-center gap-2 bg-app-error-bg border border-app-error-border px-3 py-1 rounded">
                  <button
                    id="clear-draft-confirm-btn"
                    type="button"
                    onClick={handleClearDraft}
                    className="text-[10px] tracking-widest uppercase text-app-error hover:text-app-error-muted font-bold transition-colors cursor-pointer"
                  >
                    Confirm Clear
                  </button>
                  <span className="text-app-dim text-xs">|</span>
                  <button
                    id="clear-draft-cancel-btn"
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="text-[10px] tracking-widest uppercase text-app-muted hover:text-app-main font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  id="clear-draft-btn"
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="text-[10px] tracking-widest uppercase text-app-dim hover:text-app-error font-semibold px-2 py-1 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Clear draft inputs"
                >
                  <Trash2 className="w-3.5 h-3.5 text-app-error/80" />
                  <span className="hidden sm:inline">Clear draft</span>
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Container core */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 print:block">
        
        {/* Dynamic Multi-Step Navigator Dots */}
        {step <= 7 && !showLanding && !isSubmitting && (
          <div id="navigator-dots-wrapper" className="mb-10 print:hidden border-b border-app-border-light pb-4">
            <nav className="flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-3 text-[11px] font-semibold tracking-widest text-app-dim">
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
                        ? "text-app-gold border-b-2 border-app-gold font-bold"
                        : isCompleted
                        ? "text-app-main hover:text-app-main border-b-2 border-transparent"
                        : "text-app-dim hover:text-app-muted border-b-2 border-transparent"
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
          <div id="submitting-stages-screener" className="bg-app-panel border border-app-border rounded-xl p-16 sm:p-24 space-y-12 animate-fade-in text-center my-6 max-w-4xl w-full mx-auto shadow-2xl min-h-[500px] flex flex-col justify-center">
            <div className="flex flex-col items-center justify-center space-y-6">
              <Loader2 className="w-16 h-16 text-app-gold animate-spin" />
              <h2 className="text-3xl font-serif font-light text-app-main uppercase tracking-wider">
                Simulating Scenario Risk Drivers
              </h2>
              <p className="text-sm text-app-muted max-w-lg mx-auto leading-relaxed">
                Please wait while we stress-test your financials against target regional demand, compute the psychological risk curve, and run deep AI scenario benchmarks. This might take 30 to 60 seconds.
              </p>
            </div>

            {/* Stepper tracking columns */}
            <div className="max-w-md mx-auto space-y-3 bg-app-subtle p-6 rounded-lg border border-app-border-light text-left">
              <h3 className="text-[10px] font-bold text-app-dim uppercase tracking-[0.2em] pl-1">
                Validators pipeline:
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {sseStagesConfig.map((item, index) => {
                  const isFinished = index < activeStageIndex;
                  const isCurrent = item.stage === sseStage;
                  return (
                    <div
                      key={item.stage}
                      ref={isCurrent ? activeStageRef : undefined}
                      className={`flex items-center justify-between p-2 py-1.5 rounded text-xs leading-none transition-colors duration-150 ${
                        isCurrent
                          ? "bg-app-subtle text-app-main border border-app-border font-semibold"
                          : isFinished
                          ? "text-app-success font-medium"
                          : "text-app-dim opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isFinished ? (
                          <Check className="w-3.5 h-3.5 text-app-success" />
                        ) : isCurrent ? (
                          <Loader2 className="w-3.5 h-3.5 text-app-gold animate-spin" />
                        ) : (
                          <div className="h-1.5 w-1.5 bg-app-border rounded-full ml-1"></div>
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
            <div className="text-center font-mono text-[10px] text-app-gold bg-app-gold/10 py-2.5 px-3 rounded-md max-w-sm mx-auto border border-app-gold/20 uppercase tracking-wider">
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
              <div className="bg-app-panel border border-app-border rounded-xl p-6 sm:p-8 md:p-10 shadow-xl hover:border-app-border-strong transition-colors duration-300">
                {errorDetails && (
                  <div className="bg-red-950/25 text-app-error-muted p-4 rounded-lg border border-red-800/40 mb-6 flex flex-col gap-2.5 text-sm">
                    <div className="flex gap-3">
                      <div className="font-bold flex-shrink-0 mt-0.5">⚠️ Error:</div>
                      <div className="leading-relaxed">
                        {errorDetails.message}
                      </div>
                    </div>
                    {(errorDetails.code || errorDetails.requestId) && (
                      <div className="mt-1 pl-8 border-t border-red-950/10 pt-2 font-mono text-[10px] text-app-error-muted/60 flex flex-wrap gap-x-4 gap-y-1">
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
                        className="underline font-semibold text-app-gold hover:brightness-90 text-xs transition-colors cursor-pointer block"
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
                  <PlanBStep
                    data={planB}
                    onChange={(updated) => setPlanB((prev) => ({ ...prev, ...updated }))}
                    onPrev={() => setStep(1)}
                    onNext={() => setStep(3)}
                  />
                )}

                {step === 3 && (
                  <FinancialsStep
                    data={financials}
                    iWillQuitMyJob={planB.iWillQuitMyJob}
                    onChange={(updated) => setFinancials((prev) => ({ ...prev, ...updated }))}
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
      <footer className="py-8 border-t border-app-border-light text-center text-[10px] tracking-widest uppercase text-app-dim bg-app-base print:hidden max-w-4xl mx-auto w-full">
        <p className="max-w-[600px] mx-auto px-4 leading-relaxed">
          Plan B Validator is an analytical framework and should not be considered financial or professional career advice. Validate all market data independently.
        </p>
        <p className="mt-3 font-mono text-[9px] opacity-60">© 2026 Plan B Validator • v1.0.42 • TX_DC_01</p>
        <div className="mt-3">
          <a href="https://www.linkedin.com/in/koushan-de-04a966192/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-app-main transition-colors text-xs font-sans normal-case opacity-80 hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            Created by Koushan De
          </a>
        </div>
      </footer>
    </div>
  );
}
