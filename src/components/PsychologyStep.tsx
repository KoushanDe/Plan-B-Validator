import React, { useState, useEffect } from "react";
import { PsychologyData, QuestionnaireQuestion } from "../types";
import { BrainCircuit, ArrowLeft, ArrowRight } from "lucide-react";
import { getUserId } from "../utils/userId";

interface PsychologyStepProps {
  data: PsychologyData;
  onChange: (data: PsychologyData) => void;
  onNext: () => void;
  onPrev: () => void;
  hasUploadedResume?: boolean;
}

const DEFAULT_QUESTIONS: QuestionnaireQuestion[] = [
  { id: "uncertainty_tolerance", text: "I can make major decisions and act productively even under high ambiguity without clear answers.", field: "uncertaintyTolerance" },
  { id: "discipline", text: "I hold myself accountable to strict standards and maintain focus without external management.", field: "discipline" },
  { id: "stress_recovery", text: "I am able to decompress, sleep, and recover from intense professional stress quickly.", field: "stressRecovery" },
  { id: "validation_dependency", text: "I rely heavily on positive feedback from colleagues or bosses to feel successful.", field: "validationDependency" },
  { id: "impulsiveness", text: "I tend to act quickly on sudden ideas/opportunities without detailed structured planning.", field: "impulsiveness" },
  { id: "routine_adherence", text: "I thrive best when my work follows a stable, predictable, and repetitive daily schedule.", field: "routineAdherence" },
  { id: "setback_recovery", text: "I recover quickly from severe business rejections or personal failures without self-doubt.", field: "setbackRecovery" },
  { id: "uncertainty_stamina", text: "I can endure long periods of financial and operational silence without losing motivation.", field: "uncertaintyStamina" },
  { id: "financial_resilience", text: "I have a high threshold for living on a tight budget if it enables future success.", field: "financialResilience" },
  { id: "self_directed_motivation", text: "I find it easy to generate independent motivation when there are no immediate external rewards.", field: "selfDirectedMotivation" }
];

const SNAKE_TO_CAMEL: Record<string, string> = {
  "uncertainty_tolerance": "uncertaintyTolerance",
  "discipline": "discipline",
  "stress_recovery": "stressRecovery",
  "validation_dependency": "validationDependency",
  "impulsiveness": "impulsiveness",
  "routine_adherence": "routineAdherence",
  "setback_recovery": "setbackRecovery",
  "uncertainty_stamina": "uncertaintyStamina",
  "financial_resilience": "financialResilience",
  "self_directed_motivation": "selfDirectedMotivation"
};

export default function PsychologyStep({ data, onChange, onNext, onPrev, hasUploadedResume = false }: PsychologyStepProps) {
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>(DEFAULT_QUESTIONS);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const response = await fetch("/api/questionnaire/questions", {
          headers: {
            "X-User-Id": getUserId(),
          },
        });
        if (response.ok) {
          const resData = await response.json();
          // Make sure questions count is valid
          if (resData && Array.isArray(resData.questions) && resData.questions.length > 0) {
            const mapped = resData.questions.map((q: any) => {
              const keySource = q.field || String(q.id);
              return {
                ...q,
                text: q.text || q.question,
                field: SNAKE_TO_CAMEL[keySource] || keySource
              };
            });
            setQuestions(mapped);
          } else {
            setQuestions(DEFAULT_QUESTIONS);
          }
        } else {
          setQuestions(DEFAULT_QUESTIONS);
        }
      } catch (err) {
        console.error("Using fallback questionnaire:", err);
        setQuestions(DEFAULT_QUESTIONS);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  // Initialize scores with neutral 3 if empty
  useEffect(() => {
    const freshData = { ...data };
    let changed = false;
    questions.forEach((q) => {
      if (freshData[q.field] === undefined) {
        freshData[q.field] = 3; // neutral default
        changed = true;
      }
    });
    if (changed) {
      onChange(freshData);
    }
  }, [questions]);

  const selectAnswer = (field: string, score: number) => {
    onChange({
      ...data,
      [field]: score,
    });
  };

  const isFormComplete = () => {
    return questions.every((q) => data[q.field] !== undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete()) {
      alert("Please answer all questions before proceeding.");
      return;
    }
    onNext();
  };

  const likertOptions = [
    { score: 1, label: "Strongly Disagree" },
    { score: 2, label: "Disagree" },
    { score: 3, label: "Neutral" },
    { score: 4, label: "Agree" },
    { score: 5, label: "Strongly Agree" },
  ];

  return (
    <form id="psychology-step-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-app-border pb-4">
        <h2 className="text-xl font-serif text-app-main flex items-center gap-2.5">
          <BrainCircuit className="w-5 h-5 text-app-gold" />
          <span>Psychological Readiness Probe</span>
        </h2>
        <p className="text-xs text-app-dim mt-1 uppercase tracking-wider">
          An honest assessment of your mental model, endurance limits, and behavioral traits under high ambiguity.
        </p>
      </div>

      {loading && (
        <div className="text-xs text-app-gold flex items-center gap-2 bg-app-input border border-app-border-light px-3 py-2 rounded animate-pulse">
          <div className="h-2 w-2 bg-app-gold rounded-full animate-ping"></div>
          <span>Syncing questionnaire schema with backend servers...</span>
        </div>
      )}

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-white/10">
        {questions.map((q, idx) => {
          const currentVal = data[q.field] ?? 3;
          return (
            <div
              key={q.id}
              className="p-5 rounded border border-app-border-light bg-app-subtle hover:border-app-border transition-colors"
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded bg-app-subtle text-app-gold font-mono text-xs font-semibold">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-sans font-medium text-app-main leading-relaxed mb-4">
                    {q.text || (q as any).question}
                  </p>

                  <div className="grid grid-cols-5 gap-2 max-w-xl">
                    {likertOptions.map((opt) => {
                      const isSelected = currentVal === opt.score;
                      return (
                        <button
                          key={opt.score}
                          type="button"
                          id={`likert-${q.field}-${opt.score}`}
                          onClick={() => selectAnswer(q.field, opt.score)}
                          className={`flex flex-col items-center justify-center py-2.5 px-1 rounded transition-all text-center cursor-pointer ${
                            isSelected
                              ? "bg-app-gold text-app-base font-semibold ring-1 ring-[#d4af37]/30"
                              : "bg-app-subtle border border-app-border-light hover:bg-app-subtle text-app-muted"
                          }`}
                        >
                          <span className="text-xs font-bold font-mono">{opt.score}</span>
                          <span className={`text-[8px] uppercase tracking-wider mt-1 truncate max-w-full hidden sm:block ${
                            isSelected ? "text-app-base/80 font-bold" : "text-app-dim"
                          }`}>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4 border-t border-app-border">
        <button
          id="psychology-prev-btn"
          type="button"
          onClick={onPrev}
          className="px-6 py-2.5 bg-app-subtle hover:bg-app-subtle-hover text-app-main text-xs font-bold uppercase tracking-widest border border-app-border transition-colors flex items-center gap-2 rounded-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          id="psychology-next-btn"
          type="submit"
          className="px-6 py-2.5 bg-app-main hover:opacity-90 text-app-base text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 rounded-sm cursor-pointer"
        >
          <span>{hasUploadedResume ? "Continue to Web Research" : "Continue to Resume Upload"}</span>
          <ArrowRight className="w-4 h-4 text-app-base" />
        </button>
      </div>
    </form>
  );
}
