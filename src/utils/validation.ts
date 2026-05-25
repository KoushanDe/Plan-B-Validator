import {
  AnalyzeRequest,
  ProfileData,
  FinancialsData,
  PlanBData,
  ConstraintsData,
  PsychologyData,
} from "../types";

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

export function validateAnalyzeRequest(
  data: Partial<AnalyzeRequest>,
  hasResume: boolean,
  resumeFile?: File | null
): ValidationResult {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  // 1. Check Root Objects
  const profile: Partial<ProfileData> = data.profile || {};
  const financials: Partial<FinancialsData> = data.financials || {};
  const planB: Partial<PlanBData> = data.planB || {};
  const constraints: Partial<ConstraintsData> = data.constraints || {};
  const psychology: Partial<PsychologyData> = data.psychology || {};

  // 2. Profile Step Validation
  if (!hasResume) {
    if (!profile.currentProfession || !profile.currentProfession.trim()) {
      errors["profile.currentProfession"] = "Current profession/job title is required when no resume is uploaded.";
    }
    if (!profile.industry || !profile.industry.trim()) {
      errors["profile.industry"] = "Industry is required when no resume is uploaded.";
    }
    if (profile.yearsExperience === undefined || profile.yearsExperience === null) {
      errors["profile.yearsExperience"] = "Years of experience is required when no resume is uploaded.";
    } else if (profile.yearsExperience < 0) {
      errors["profile.yearsExperience"] = "Years of experience must be greater than or equal to 0.";
    }
    if (!profile.country || !profile.country.trim()) {
      errors["profile.country"] = "Country is required when no resume is uploaded.";
    }
    if (!profile.city || !profile.city.trim()) {
      errors["profile.city"] = "City is required when no resume is uploaded.";
    }
  } else {
    // If has resume, we still validate that if fields are filled, they meet length constraints or value rules
    if (profile.yearsExperience !== undefined && profile.yearsExperience !== null && profile.yearsExperience < 0) {
      errors["profile.yearsExperience"] = "Years of experience must be greater than or equal to 0.";
    }
  }

  // Length constraints on Profile
  if (profile.currentProfession && profile.currentProfession.length > 120) {
    errors["profile.currentProfession"] = "Profession must be 120 characters or less.";
  }
  if (profile.industry && profile.industry.length > 120) {
    errors["profile.industry"] = "Industry must be 120 characters or less.";
  }
  if (profile.country && profile.country.length > 80) {
    errors["profile.country"] = "Country must be 80 characters or less.";
  }
  if (profile.city && profile.city.length > 80) {
    errors["profile.city"] = "City must be 80 characters or less.";
  }
  if (planB.targetCountry && planB.targetCountry.length > 80) {
    errors["planB.targetCountry"] = "Target country must be 80 characters or less.";
  }
  if (planB.targetCity && planB.targetCity.length > 80) {
    errors["planB.targetCity"] = "Target city must be 80 characters or less.";
  }

  // Profile Cross-checks
  if (profile.yearsExperience !== undefined && profile.yearsExperience > 50) {
    warnings["profile.yearsExperience"] = "Years of experience is unusually high (> 50 years).";
  }

  // 3. Financials Step Validation
  if (financials.monthlyIncome === undefined || financials.monthlyIncome === null || financials.monthlyIncome < 0) {
    errors["financials.monthlyIncome"] = "Monthly income is required and must be greater than or equal to 0.";
  }
  if (financials.liquidSavings === undefined || financials.liquidSavings === null || financials.liquidSavings < 0) {
    errors["financials.liquidSavings"] = "Liquid savings/cash is required and must be greater than or equal to 0.";
  }
  if (financials.monthlyExpenses === undefined || financials.monthlyExpenses === null || financials.monthlyExpenses <= 0) {
    errors["financials.monthlyExpenses"] = "Monthly expenses (burn) is required and must be strictly greater than 0.";
  }
  if (financials.dependents === undefined || financials.dependents === null || financials.dependents < 0 || !Number.isInteger(financials.dependents)) {
    errors["financials.dependents"] = "Dependents is required and must be a whole number greater than or equal to 0.";
  }
  if (financials.debtObligations === undefined || financials.debtObligations === null || financials.debtObligations < 0) {
    errors["financials.debtObligations"] = "Debt obligations are required and must be greater than or equal to 0.";
  }
  if (financials.emergencyFundMonths === undefined || financials.emergencyFundMonths === null || financials.emergencyFundMonths < 0) {
    errors["financials.emergencyFundMonths"] = "Emergency fund target is required and must be greater than or equal to 0.";
  }

  // Financials Cross-checks
  if (financials.monthlyIncome !== undefined) {
    if (financials.monthlyExpenses !== undefined && financials.monthlyExpenses > financials.monthlyIncome) {
      warnings["financials.monthlyExpenses"] = "Your burn rate (monthly expenses) exceeds your current monthly income.";
    }
  }
  if (financials.liquidSavings === 0) {
    warnings["financials.liquidSavings"] = "You reported no runway buffer (liquid savings is 0). This is highly risky.";
  }

  // Live calculated runway warning (Calculated on client side as liquidSavings / monthlyExpenses)
  if (financials.liquidSavings !== undefined && financials.monthlyExpenses && financials.monthlyExpenses > 0) {
    const rawRunway = financials.liquidSavings / financials.monthlyExpenses;
    if (rawRunway < 3) {
      warnings["financials.runwayMonths"] = `Your estimated capital runway (or survival limits) is critically low: ${rawRunway.toFixed(1)} months.`;
    }
  }

  // 4. Plan B Step Validation
  if (!planB.title || !planB.title.trim()) {
    errors["planB.title"] = "Plan B Title is required.";
  } else if (planB.title.length > 150) {
    errors["planB.title"] = "Plan B Title must be 150 characters or less.";
  }

  if (!planB.description || !planB.description.trim()) {
    errors["planB.description"] = "Plan B Description is required.";
  } else if (planB.description.length > 2000) {
    errors["planB.description"] = "Plan B Description must be 2000 characters or less.";
  }

  if (!planB.reason || !planB.reason.trim()) {
    errors["planB.reason"] = "Plan B Reason/Motivation is required.";
  } else if (planB.reason.length > 1000) {
    errors["planB.reason"] = "Reason must be 1000 characters or less.";
  }

  if (planB.timelineMonths === undefined || planB.timelineMonths === null || planB.timelineMonths < 1 || planB.timelineMonths > 120 || !Number.isInteger(planB.timelineMonths)) {
    errors["planB.timelineMonths"] = "Timeline is required and must be a whole number between 1 and 120 months.";
  }

  if (planB.expectedIncome3Months === undefined || planB.expectedIncome3Months === null || planB.expectedIncome3Months < 0) {
    errors["planB.expectedIncome3Months"] = "Expected income at month 3 must be greater than or equal to 0.";
  }
  if (planB.expectedIncome6Months === undefined || planB.expectedIncome6Months === null || planB.expectedIncome6Months < 0) {
    errors["planB.expectedIncome6Months"] = "Expected income at month 6 must be greater than or equal to 0.";
  }
  if (planB.expectedIncome12Months === undefined || planB.expectedIncome12Months === null || planB.expectedIncome12Months < 0) {
    errors["planB.expectedIncome12Months"] = "Expected income at month 12 must be greater than or equal to 0.";
  }

  if (planB.iWillQuitMyJob === undefined || planB.iWillQuitMyJob === null || typeof planB.iWillQuitMyJob !== "boolean") {
    errors["planB.iWillQuitMyJob"] = "I will quit my job option must be a boolean (true/false).";
  }

  // Plan B Cross-checks
  if (planB.expectedIncome3Months !== undefined && planB.expectedIncome6Months !== undefined && planB.expectedIncome12Months !== undefined) {
    if (planB.expectedIncome12Months < planB.expectedIncome6Months || planB.expectedIncome6Months < planB.expectedIncome3Months) {
      warnings["planB.expectedIncomeProgress"] = "Your projected Plan B income is not non-decreasing over the 3, 6, and 12-month periods.";
    }
  }

  if (planB.iWillQuitMyJob === true) {
    if (planB.expectedIncome3Months === 0 && planB.expectedIncome6Months === 0 && planB.expectedIncome12Months === 0) {
      warnings["planB.quittingNoIncome"] = "You plan to quit your current job, but have structured no income from Plan B up to month 12.";
    }
    if (planB.timelineMonths !== undefined && planB.timelineMonths <= 3) {
      warnings["planB.aggressiveTimeline"] = "Aggressive timeline: Transitioning full-time inside 3 months leaves very low preparation runway.";
    }
  }

  // 5. Constraints Step Validation
  if (!constraints.successDefinition || !constraints.successDefinition.trim()) {
    errors["constraints.successDefinition"] = "Success definition is required.";
  } else if (constraints.successDefinition.length > 1000) {
    errors["constraints.successDefinition"] = "Success definition must be 1000 characters or less.";
  }

  if (!constraints.biggestFear || !constraints.biggestFear.trim()) {
    errors["constraints.biggestFear"] = "Biggest fear is required.";
  } else if (constraints.biggestFear.length > 1000) {
    errors["constraints.biggestFear"] = "Biggest fear must be 1000 characters or less.";
  }

  if (!constraints.acceptableDownside || !constraints.acceptableDownside.trim()) {
    errors["constraints.acceptableDownside"] = "Acceptable downside is required.";
  } else if (constraints.acceptableDownside.length > 1000) {
    errors["constraints.acceptableDownside"] = "Acceptable downside must be 1000 characters or less.";
  }

  if (constraints.minimumAcceptableSalary === undefined || constraints.minimumAcceptableSalary === null || constraints.minimumAcceptableSalary < 0) {
    errors["constraints.minimumAcceptableSalary"] = "Minimum acceptable monthly salary is required and must be greater than or equal to 0.";
  }

  if (
    constraints.acceptableMonthsWithoutIncome === undefined ||
    constraints.acceptableMonthsWithoutIncome === null ||
    constraints.acceptableMonthsWithoutIncome < 0 ||
    constraints.acceptableMonthsWithoutIncome > 120 ||
    !Number.isInteger(constraints.acceptableMonthsWithoutIncome)
  ) {
    errors["constraints.acceptableMonthsWithoutIncome"] = "Months without income must be a whole number between 0 and 120.";
  }

  if (
    constraints.familyPressureLevel === undefined ||
    constraints.familyPressureLevel === null ||
    constraints.familyPressureLevel < 1 ||
    constraints.familyPressureLevel > 5 ||
    !Number.isInteger(constraints.familyPressureLevel)
  ) {
    errors["constraints.familyPressureLevel"] = "Family pressure level must be an integer between 1 and 5.";
  }

  // Constraints Cross-checks
  if (constraints.minimumAcceptableSalary !== undefined && planB.expectedIncome12Months !== undefined) {
    if (constraints.minimumAcceptableSalary > planB.expectedIncome12Months) {
      warnings["constraints.targetDelta"] = "Your 12-month expected Plan B income is lower than your reported minimum acceptable salary limit.";
    }
  }

  // Cross-component warnings: Dependents & Quitting logic
  if (planB.iWillQuitMyJob === true && financials.dependents !== undefined && financials.dependents > 0) {
    if (planB.expectedIncome3Months === 0) {
      warnings["cross.dependentNoIncome"] = "High Risk: Quitting a full-time role with dependents while projecting ₹0 Plan B income in month 3 is highly vulnerable.";
    }
  }

  // 6. Psychology Step Validation
  const psychoFields = [
    "uncertaintyTolerance",
    "discipline",
    "stressRecovery",
    "validationDependency",
    "impulsiveness",
    "routineAdherence",
    "setbackRecovery",
    "uncertaintyStamina",
    "financialResilience",
    "selfDirectedMotivation",
  ];

  psychoFields.forEach((f) => {
    const val = psychology[f];
    if (val === undefined || val === null) {
      errors[`psychology.${f}`] = "All psychology questions are mandatory.";
    } else if (val < 1 || val > 5 || !Number.isInteger(val)) {
      errors[`psychology.${f}`] = "Psychology score must be an integer between 1 and 5.";
    }
  });

  // 7. Resume file type and size validation
  if (hasResume && resumeFile) {
    if (resumeFile.type !== "application/pdf" && !resumeFile.name.toLowerCase().endsWith(".pdf")) {
      errors["resume"] = "Only PDF resumes are supported.";
    }
    if (resumeFile.size > 10 * 1024 * 1024) {
      errors["resume"] = "Resume file too large. Max file size is 10 MB.";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}
