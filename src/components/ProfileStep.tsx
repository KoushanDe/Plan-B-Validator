import React, { useState, useRef, useEffect } from "react";
import { ProfileData } from "../types";
import { Briefcase, Milestone, AlertTriangle, HelpCircle, FileUp, File, Trash2 } from "lucide-react";

interface ProfileStepProps {
  data: ProfileData;
  onChange: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  file: File | null;
  onChangeFile: (file: File | null) => void;
}

export default function ProfileStep({ data, onChange, onNext, file, onChangeFile }: ProfileStepProps) {
  const willUploadResume = !!file;
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        onChangeFile(droppedFile);
      } else {
        alert("Please upload a PDF format CV / Resume.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        onChangeFile(selectedFile);
      } else {
        alert("Please upload a PDF format CV / Resume.");
      }
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChangeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!willUploadResume) {
      if (!data.currentProfession || !data.industry || !data.country || !data.city) {
        alert("Please fill in all required fields (marked with *), or upload your CV / resume.");
        return;
      }
    }
    onNext();
  };

  const currentProfessionLen = data.currentProfession?.length || 0;
  const industryLen = data.industry?.length || 0;
  const countryLen = data.country?.length || 0;
  const cityLen = data.city?.length || 0;

  return (
    <form id="profile-step-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-serif text-white flex items-center gap-2.5 font-semibold">
          <Briefcase className="w-5 h-5 text-[#d4af37]" />
          <span>Professional Profile</span>
        </h2>
        <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">
          Tell us about your current status so we can compare it with your target scenario.
        </p>
      </div>

      {/* Resume Upload on Step 1 */}
      <div className="bg-[#0f0f12] border border-white/10 rounded-lg p-5 space-y-4">
        <div>
          <span className="text-xs font-semibold text-white block uppercase tracking-wider mb-1">
            Fast Track: Upload CV / Resume <span className="text-[10px] text-white/40 font-normal normal-case">(Optional, PDF only)</span>
          </span>
          <span className="text-[11px] text-white/40 block leading-relaxed">
            Uploading your resume here lets you skip manual profile fields. Our AI will automatically parse your history.
          </span>
        </div>

        <div
          id="profile-drag-drop-zone"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerSelect}
          className={`border border-dashed rounded p-5 text-center cursor-pointer transition-all ${
            isDragActive
              ? "bg-white/[0.05] border-[#d4af37]"
              : file
              ? "bg-emerald-950/20 border-emerald-500/30 text-white"
              : "bg-white/[0.01] border-white/10 hover:bg-white/[0.03] hover:border-[#d4af37]/30 text-white/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {file ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <File className="w-8 h-8 text-[#d4af37]" />
              <p className="text-xs font-semibold text-white truncate max-w-sm">
                {file.name}
              </p>
              <p className="text-[10px] text-white/40 font-mono">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] bg-emerald-950/40 font-mono text-emerald-400 border border-emerald-500/30 rounded px-1.5 py-0.5 tracking-tight font-bold uppercase">
                  Resume Loaded
                </span>
                <button
                  type="button"
                  id="profile-remove-resume-btn"
                  onClick={removeFile}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-950/20 text-rose-400 hover:bg-rose-900/30 border border-rose-500/20 duration-150 rounded text-[10px] font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove CV</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1">
              <FileUp className="w-8 h-8 text-white/20" />
              <p className="text-xs text-white/70 font-medium">
                Drag and drop your PDF resume here, or <span className="text-[#d4af37] underline font-semibold">browse files</span>
              </p>
              <p className="text-[10px] text-white/30">Skip manual fields entirely once uploaded</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="currentProfession" className={`block text-xs uppercase tracking-widest ${willUploadResume ? "text-white/20" : "text-white/40"}`}>
              Current Profession / Job Title {willUploadResume ? "(using resume details)" : "*"}
            </label>
            {!willUploadResume && (
              <span className={`text-[10px] font-mono ${currentProfessionLen > 120 ? "text-rose-400 font-bold" : "text-white/35"}`}>
                {currentProfessionLen}/120
              </span>
            )}
          </div>
          <input
            id="currentProfession"
            type="text"
            required={!willUploadResume}
            disabled={willUploadResume}
            maxLength={120}
            value={willUploadResume ? "" : (data.currentProfession || "")}
            onChange={(e) => onChange({ currentProfession: e.target.value })}
            placeholder={willUploadResume ? "Bypassed — details will be extracted from resume" : "e.g., Senior Software Engineer"}
            className={`w-full px-4 py-3 rounded border text-sm font-mono transition-all ${
              willUploadResume
                ? "bg-white/[0.01] border-white/5 text-white/30 cursor-not-allowed selection:bg-transparent placeholder-white/10"
                : "bg-white/[0.03] border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30"
            }`}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="industry" className={`block text-xs uppercase tracking-widest ${willUploadResume ? "text-white/20" : "text-white/40"}`}>
              Industry / Sector {willUploadResume ? "(using resume details)" : "*"}
            </label>
            {!willUploadResume && (
              <span className={`text-[10px] font-mono ${industryLen > 120 ? "text-rose-400 font-bold" : "text-white/35"}`}>
                {industryLen}/120
              </span>
            )}
          </div>
          <input
            id="industry"
            type="text"
            required={!willUploadResume}
            disabled={willUploadResume}
            maxLength={120}
            value={willUploadResume ? "" : (data.industry || "")}
            onChange={(e) => onChange({ industry: e.target.value })}
            placeholder={willUploadResume ? "Bypassed — details will be extracted from resume" : "e.g., Finance, Tech, Healthcare"}
            className={`w-full px-4 py-3 rounded border text-sm font-mono transition-all ${
              willUploadResume
                ? "bg-white/[0.01] border-white/5 text-white/30 cursor-not-allowed selection:bg-transparent placeholder-white/10"
                : "bg-white/[0.03] border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30"
            }`}
          />
        </div>

        <div>
          <label htmlFor="yearsExperience" className={`block text-xs uppercase tracking-widest mb-2 ${willUploadResume ? "text-white/20" : "text-white/40"}`}>
            Years of Work Experience {willUploadResume ? "(using resume details)" : "*"}
          </label>
          <input
            id="yearsExperience"
            type="number"
            min="0"
            max="120"
            step="0.1"
            required={!willUploadResume}
            disabled={willUploadResume}
            value={willUploadResume || data.yearsExperience === undefined || data.yearsExperience === null || isNaN(data.yearsExperience) ? "" : data.yearsExperience}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                onChange({ yearsExperience: undefined as any });
              } else {
                const parsed = parseFloat(val);
                onChange({ yearsExperience: isNaN(parsed) ? undefined as any : parsed });
              }
            }}
            placeholder={willUploadResume ? "Bypassed" : "e.g., 5.5"}
            className={`w-full px-4 py-3 rounded border text-sm font-mono transition-all ${
              willUploadResume
                ? "bg-white/[0.01] border-white/5 text-white/30 cursor-not-allowed selection:bg-transparent placeholder-white/10"
                : "bg-white/[0.03] border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30"
            }`}
          />
          {!willUploadResume && data.yearsExperience !== undefined && data.yearsExperience > 50 && (
            <div className="mt-2 text-[10px] text-amber-400 flex items-center gap-1 font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Experience is unusually high (&gt; 50 years).</span>
            </div>
          )}
          {!willUploadResume && data.yearsExperience !== undefined && data.yearsExperience < 0 && (
            <div className="mt-2 text-[10px] text-rose-400 flex items-center gap-1 font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Experience cannot be negative.</span>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="country" className={`block text-xs uppercase tracking-widest ${willUploadResume ? "text-white/20" : "text-white/40"}`}>
              Current Country {willUploadResume ? "(using resume details)" : "*"}
            </label>
            {!willUploadResume && (
              <span className={`text-[10px] font-mono ${countryLen > 80 ? "text-rose-400 font-bold" : "text-white/35"}`}>
                {countryLen}/80
              </span>
            )}
          </div>
          <input
            id="country"
            type="text"
            required={!willUploadResume}
            disabled={willUploadResume}
            maxLength={80}
            value={willUploadResume ? "" : (data.country || "")}
            onChange={(e) => onChange({ country: e.target.value })}
            placeholder={willUploadResume ? "Bypassed — details will be extracted from resume" : "e.g., India"}
            className={`w-full px-4 py-3 rounded border text-sm font-mono transition-all ${
              willUploadResume
                ? "bg-white/[0.01] border-white/5 text-white/30 cursor-not-allowed selection:bg-transparent placeholder-white/10"
                : "bg-white/[0.03] border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30"
            }`}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="city" className={`block text-xs uppercase tracking-widest ${willUploadResume ? "text-white/20" : "text-white/40"}`}>
              Current City {willUploadResume ? "(using resume details)" : "*"}
            </label>
            {!willUploadResume && (
              <span className={`text-[10px] font-mono ${cityLen > 80 ? "text-rose-400 font-bold" : "text-white/35"}`}>
                {cityLen}/80
              </span>
            )}
          </div>
          <input
            id="city"
            type="text"
            required={!willUploadResume}
            disabled={willUploadResume}
            maxLength={80}
            value={willUploadResume ? "" : (data.city || "")}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder={willUploadResume ? "Bypassed — details will be extracted from resume" : "e.g., Bengaluru"}
            className={`w-full px-4 py-3 rounded border text-sm font-mono transition-all ${
              willUploadResume
                ? "bg-white/[0.01] border-white/5 text-white/30 cursor-not-allowed selection:bg-transparent placeholder-white/10"
                : "bg-white/[0.03] border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30"
            }`}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          id="profile-next-btn"
          type="submit"
          className="px-6 py-2.5 bg-white hover:bg-white/90 text-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 rounded-sm cursor-pointer"
        >
          <span>Continue to Financials</span>
          <Milestone className="w-4 h-4 text-black" />
        </button>
      </div>
    </form>
  );
}
