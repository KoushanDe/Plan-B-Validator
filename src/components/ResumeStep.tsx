import React, { useState, useRef } from "react";
import { ResearchOptions } from "../types";
import { FileUp, File, Trash2, Globe, Shield, Play, ArrowRight } from "lucide-react";

interface ResumeStepProps {
  researchOptions: ResearchOptions;
  onChangeResearch: (options: ResearchOptions) => void;
  file: File | null;
  onChangeFile: (file: File | null) => void;
  onSubmit: () => void;
  onPrev: () => void;
  submitting: boolean;
}

export default function ResumeStep({
  researchOptions,
  onChangeResearch,
  file,
  onChangeFile,
  onSubmit,
  onPrev,
  submitting,
}: ResumeStepProps) {
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

  return (
    <div id="resume-step-container" className="space-y-6">
      <div className="border-b border-app-border pb-4">
        <h2 className="text-xl font-serif text-app-main flex items-center gap-2.5">
          <FileUp className="w-5 h-5 text-app-gold" />
          <span>Resume Intelligence & Web Research</span>
        </h2>
        <p className="text-xs text-app-dim mt-1 uppercase tracking-wider">
          Provide your current resume to allow the AI to extract your specific skills, market value, and benchmark against corporate standards.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-app-dim mb-2">
            Upload CV / Resume <span className="text-xs text-app-dim font-normal font-sans">(Optional, PDF only)</span>
          </label>
          <span className="text-xs text-app-dim font-sans">
            Allow deep analysis of your current market positioning and matching with Plan B demand curves.
          </span>

          <div
            id="drag-drop-zone"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerSelect}
            className={`mt-4 border border-dashed rounded p-6 text-center cursor-pointer transition-all ${
              isDragActive
                ? "bg-white/[0.05] border-app-gold"
                : file
                ? "bg-emerald-950/20 border-emerald-500/30"
                : "bg-app-subtle border-app-border hover:bg-app-input hover:border-app-gold/30"
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
                <File className="w-10 h-10 text-app-gold animate-bounce-slow" />
                <p className="text-sm font-semibold text-app-main truncate max-w-md">
                  {file.name}
                </p>
                <p className="text-xs text-app-dim font-mono">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  id="remove-resume-btn"
                  onClick={removeFile}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-rose-950/20 text-app-error hover:bg-rose-900/30 border border-app-error-border duration-150 rounded text-xs font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove CV</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <FileUp className="w-10 h-10 text-app-dim" />
                <p className="text-sm text-app-muted font-medium">
                  Drag and drop your PDF resume here, or <span className="text-app-gold underline font-semibold">browse files</span>
                </p>
                <p className="text-xs text-app-dim">PDF up to 10MB format matches best</p>
              </div>
            )}
          </div>
        </div>

        {/* Web Research Toggle */}
        <div className="bg-app-panel border border-app-border-light rounded-lg p-5 mt-4">
          <div className="flex items-start gap-3 justify-between">
            <div className="flex gap-2">
              <Globe className="w-5 h-5 text-app-gold flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-app-main text-md">Enable Upstream Web Research</h4>
                <p className="text-xs text-app-dim mt-1 leading-relaxed">
                  We will query live search resources, community forums, and hiring platforms to evaluate local trends, wage listings, and demand curves.
                </p>
                {!file && (
                  <p className="text-xs text-app-gold mt-2 font-medium flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Web research is recommended with a resume for better analysis. We do not store or sell any data.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              id="enable-research-toggle"
              onClick={() => onChangeResearch({ enableResearch: !researchOptions.enableResearch })}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border border-app-border-light transition-colors duration-200 ease-in-out focus:outline-none ${
                researchOptions.enableResearch ? "bg-app-gold" : "bg-app-subtle-hover"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black ring-0 transition duration-200 ease-in-out ${
                  researchOptions.enableResearch ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="flex gap-2.5 bg-app-subtle border border-app-border-light text-app-dim p-4 rounded text-[10px] leading-relaxed">
          <Shield className="w-4 h-4 flex-shrink-0 text-app-gold/60" />
          <span>
            <strong>Privacy Guarantee:</strong> Resumes are processed in memory and analyzed strictly to extract relevant experience details. We do not store or sell any data, and files are not written to static records or used for ad targeting.
          </span>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-app-border">
        <button
          id="resume-prev-btn"
          type="button"
          disabled={submitting}
          onClick={onPrev}
          className="px-6 py-2.5 bg-app-subtle hover:bg-app-subtle-hover text-app-main text-xs font-bold uppercase tracking-widest border border-app-border transition-colors flex items-center gap-2 rounded-sm cursor-pointer disabled:opacity-50"
        >
          <span>Back</span>
        </button>

        <button
          id="btn-trigger-validation"
          type="button"
          disabled={submitting}
          onClick={onSubmit}
          className="px-8 py-3 bg-app-main hover:opacity-90 text-app-base font-bold uppercase tracking-widest text-xs flex items-center gap-2 rounded-sm duration-150 cursor-pointer disabled:opacity-50"
        >
          <span>Continue to Review</span>
          <ArrowRight className="w-4 h-4 text-app-base" />
        </button>
      </div>
    </div>
  );
}
