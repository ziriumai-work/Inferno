"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  dataStore,
  AdminLead,
  HeroData,
  StatItem,
  FeatureCard,
  AboutData,
  TeamMember,
  ServiceItem,
  Job,
  Article,
  CommunityStory,
  TestimonialItem,
  FAQItem,
  LegalPage,
  SiteSettings,
  PartnerCardItem,
  QuizQuestionItem,
} from "@/utils/dataStore";
import type { KnowledgeBaseItem } from "@/lib/chatbotData";

// Active Tab navigation items
type AdminTab =
  | "overview"
  | "leads"
  | "bookings"
  | "hero"
  | "about"
  | "services"
  | "contracts"
  | "partnerships"
  | "news"
  | "careers"
  | "community"
  | "quiz"
  | "knowledge"
  | "settings";

function AdminViewButton({
  onClick,
  label = "Inspect",
  className = "",
  title = "Inspect Details",
}: {
  onClick: () => void;
  label?: string;
  className?: string;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] text-[var(--adm-text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[rgba(225,77,24,0.08)] transition-all cursor-pointer shadow-xs font-[family-name:var(--font-space-grotesk)] active:scale-95 group ${className}`}
    >
      <svg
        className="w-3.5 h-3.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {label && <span>{label}</span>}
    </button>
  );
}

function AdminEditButton({
  onClick,
  label = "Edit",
  className = "",
  title = "Edit",
}: {
  onClick: () => void;
  label?: string;
  className?: string;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] text-[var(--adm-text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[rgba(225,77,24,0.08)] transition-all cursor-pointer shadow-xs font-[family-name:var(--font-space-grotesk)] active:scale-95 ${className}`}
    >
      <svg
        className="w-3.5 h-3.5 shrink-0 opacity-80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>
      {label && <span>{label}</span>}
    </button>
  );
}

function AdminDeleteButton({
  onClick,
  label = "Delete",
  className = "",
  title = "Delete",
}: {
  onClick: () => void;
  label?: string;
  className?: string;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer shadow-xs font-[family-name:var(--font-space-grotesk)] active:scale-95 ${className}`}
    >
      <svg
        className="w-3.5 h-3.5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
      {label && <span>{label}</span>}
    </button>
  );
}

function AdminModalCloseButton({
  onClick,
  title = "Close dialog",
  className = "",
}: {
  onClick: () => void;
  title?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      title={title}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] text-[var(--adm-text-muted)] hover:text-[var(--adm-text-primary)] hover:border-[var(--primary)] hover:bg-[rgba(225,77,24,0.08)] transition-all cursor-pointer shadow-xs active:scale-90 ${className}`}
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}

function ImageDropzone({
  value,
  onChange,
  label,
  aspectRatio = "video",
  placeholderHint = "Drop PNG, JPG, WEBP or SVG here, or click to browse",
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  aspectRatio?: "video" | "square" | "wide";
  placeholderHint?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
        return;
      }
    } catch {
      // Fallback to FileReader if server upload encounters an issue
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const hasImage = Boolean(value && value.trim().length > 0);

  const previewDimensions =
    aspectRatio === "square"
      ? "w-32 h-32"
      : aspectRatio === "wide"
      ? "w-full h-36"
      : "w-full h-44";

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowManualUrl(!showManualUrl)}
            className="text-[11px] text-[var(--adm-text-muted)] hover:text-[var(--primary)] transition-colors underline cursor-pointer"
          >
            {showManualUrl ? "Hide manual URL" : "Enter path/URL manually"}
          </button>
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          // reset input so selecting the same file again triggers change
          e.target.value = "";
        }}
      />

      {/* Interactive Drag & Drop Area */}
      <div
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center p-4 text-center ${
          isDragging
            ? "border-[var(--primary)] bg-[rgba(225,77,24,0.12)] scale-[1.01]"
            : "border-[var(--adm-card-border)] hover:border-[var(--primary)] bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)]"
        }`}
      >
        {hasImage ? (
          <div className="w-full flex flex-col items-center gap-3">
            <div
              className={`relative rounded-xl overflow-hidden border border-[var(--adm-card-border)] bg-[var(--adm-card)] shadow-xs ${previewDimensions} flex items-center justify-center`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={label || "Uploaded preview"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="px-3 py-1.5 text-xs font-semibold text-white bg-black/70 backdrop-blur-xs rounded-xl flex items-center gap-1.5 shadow-md">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Click or Drop to Replace
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-[11px] text-[var(--adm-text-muted)] truncate max-w-xs font-mono">
                {value.startsWith("data:") ? "Image loaded (embedded data)" : value}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-red-500 hover:text-white hover:bg-red-500/80 border border-red-500/30 transition-all cursor-pointer"
                title="Remove image"
              >
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="py-5 px-3 flex flex-col items-center">
            <div className="w-12 h-12 mb-2.5 rounded-2xl bg-[rgba(225,77,24,0.1)] text-[var(--primary)] flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m16 16-4-4-4 4" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
              Drag &amp; drop an image here, or{" "}
              <span className="text-[var(--primary)] underline underline-offset-2">browse files</span>
            </p>
            <p className="text-[11px] text-[var(--adm-text-muted)] mt-1">
              {placeholderHint}
            </p>
          </div>
        )}
      </div>

      {/* Manual URL input toggle */}
      {showManualUrl && (
        <div className="flex gap-2 items-center pt-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/image.png or https://example.com/image.jpg"
            className="flex-1 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl px-3 py-2 text-xs outline-none text-[var(--adm-text-primary)]"
          />
          <button
            type="button"
            onClick={() => setShowManualUrl(false)}
            className="px-3 py-2 text-xs rounded-xl bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] text-[var(--adm-text-secondary)] hover:text-[var(--adm-text-primary)] cursor-pointer"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

function VideoDropzone({
  value,
  onChange,
  label = "Initiative Presentation Video",
  placeholderHint = "Upload MP4, WebM or MOV video, or enter video path/URL",
}: {
  value?: string;
  onChange: (val: string) => void;
  label?: string;
  placeholderHint?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    const isVideo =
      file.type.startsWith("video/") ||
      file.name.match(/\.(mp4|webm|mov|ogg)$/i);
    if (!isVideo) {
      setErrorMessage("Please select a video file (MP4, WebM, or MOV).");
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    setUploadProgress(
      `Uploading ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`,
    );

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
        setUploadProgress(null);
        return;
      }
      throw new Error(data.error || "Server upload failed");
    } catch (err: any) {
      if (file.size < 15 * 1024 * 1024) {
        setUploadProgress("Converting to local embedded video...");
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) onChange(result);
          setUploadProgress(null);
        };
        reader.readAsDataURL(file);
      } else {
        setErrorMessage(
          `Upload notice: ${err.message || "File too large for direct browser storage. Enter path or provide video URL."}`,
        );
        setUploadProgress(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const hasVideo = Boolean(value && value.trim().length > 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-1.5">
          <svg
            className="w-4 h-4 text-[var(--secondary)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
          </svg>
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-[11px] text-[var(--adm-text-muted)] hover:text-[var(--primary)] transition-colors underline cursor-pointer"
        >
          {showManualUrl ? "Hide manual URL" : "Enter URL/path manually"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/ogg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center p-4 text-center ${
          isDragging
            ? "border-[var(--secondary)] bg-[rgba(26,86,196,0.12)] scale-[1.01]"
            : "border-[var(--adm-card-border)] hover:border-[var(--secondary)] bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)]"
        }`}
      >
        {isUploading ? (
          <div className="py-8 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[var(--secondary)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
              {uploadProgress || "Uploading video..."}
            </p>
            <span className="text-[10px] text-[var(--adm-text-muted)]">
              Saving video and preparing playback
            </span>
          </div>
        ) : hasVideo ? (
          <div className="w-full flex flex-col items-center gap-3">
            <div
              className="relative w-full aspect-video max-h-56 rounded-xl overflow-hidden bg-black border border-[var(--adm-card-border)] shadow-xs flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                key={value}
                src={value}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain bg-black"
              >
                Your browser does not support HTML video.
              </video>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-between w-full px-1">
              <span className="text-[11px] text-[var(--adm-text-muted)] truncate max-w-[260px] font-mono">
                {value?.startsWith("data:")
                  ? "Video loaded (embedded data)"
                  : value}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[var(--secondary)] hover:bg-[var(--secondary)]/10 border border-[var(--secondary)]/30 transition-all cursor-pointer"
                >
                  Change Video
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-red-500 hover:text-white hover:bg-red-500/80 border border-red-500/30 transition-all cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-5 px-3 flex flex-col items-center">
            <div className="w-12 h-12 mb-2.5 rounded-2xl bg-[rgba(26,86,196,0.1)] text-[var(--secondary)] flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
              Drag &amp; drop a video here, or{" "}
              <span className="text-[var(--secondary)] underline underline-offset-2">
                browse files
              </span>
            </p>
            <p className="text-[11px] text-[var(--adm-text-muted)] mt-1">
              {placeholderHint}
            </p>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="text-[11px] text-red-500 font-medium">{errorMessage}</p>
      )}

      {/* Manual URL input toggle */}
      {showManualUrl && (
        <div className="flex gap-2 items-center pt-1">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/scholarship_video.mp4 or https://example.com/video.mp4"
            className="flex-1 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--secondary)] rounded-xl px-3 py-2 text-xs outline-none text-[var(--adm-text-primary)] font-mono"
          />
          <button
            type="button"
            onClick={() => setShowManualUrl(false)}
            className="px-3 py-2 text-xs rounded-xl bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] text-[var(--adm-text-secondary)] hover:text-[var(--adm-text-primary)] cursor-pointer"
          >
            Done
          </button>
        </div>
      )}

      {/* Preset shortcut for official scholarship video */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[10px] text-[var(--adm-text-muted)] font-medium">
          Quick Shortcut:
        </span>
        <button
          type="button"
          onClick={() => onChange("/scholarship_video.mp4")}
          className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--adm-card-subtle)] hover:bg-[var(--secondary)]/10 text-[var(--adm-text-primary)] hover:text-[var(--secondary)] border border-[var(--adm-card-border)] font-mono transition-colors cursor-pointer"
        >
          /scholarship_video.mp4
        </button>
      </div>
    </div>
  );
}

function GalleryManager({
  gallery = [],
  onChange,
  label = "Tournament & Community Photo Gallery",
}: {
  gallery?: string[];
  onChange: (items: string[]) => void;
  label?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [showAddUrl, setShowAddUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const addedPhotos: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          addedPhotos.push(data.url);
          continue;
        }
      } catch {
        // Fallback to FileReader
      }
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || "");
        reader.readAsDataURL(file);
      });
      if (dataUrl) addedPhotos.push(dataUrl);
    }

    if (addedPhotos.length > 0) {
      onChange([...gallery, ...addedPhotos]);
    }
    setIsUploading(false);
  };

  const handleRemovePhoto = (idx: number) => {
    const updated = gallery.filter((_, i) => i !== idx);
    onChange(updated);
  };

  const handleAddManual = () => {
    if (!newUrl.trim()) return;
    onChange([...gallery, newUrl.trim()]);
    setNewUrl("");
    setShowAddUrl(false);
  };

  return (
    <div className="space-y-3 pt-2 border-t border-[var(--adm-card-border)]">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-1.5">
          <svg
            className="w-4 h-4 text-[var(--primary)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          {label} ({gallery.length} photos)
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddUrl(!showAddUrl)}
            className="text-[11px] text-[var(--adm-text-muted)] hover:text-[var(--primary)] underline cursor-pointer"
          >
            {showAddUrl ? "Cancel URL" : "+ Add by URL"}
          </button>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 bg-[var(--primary)] hover:bg-[#c84113] text-white text-[11px] font-semibold rounded-lg cursor-pointer flex items-center gap-1 shadow-xs"
          >
            {isUploading ? "Uploading..." : "+ Upload Photos"}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleUploadFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {showAddUrl && (
        <div className="flex gap-2 items-center p-2 rounded-xl bg-[var(--adm-card)] border border-[var(--adm-card-border)]">
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="/kickball_action_1.jpg or https://..."
            className="flex-1 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--adm-text-primary)] font-mono outline-none"
          />
          <button
            type="button"
            onClick={handleAddManual}
            className="px-3 py-1.5 bg-[var(--primary)] text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Add
          </button>
        </div>
      )}

      {gallery.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {gallery.map((photo, pIdx) => (
            <div
              key={pIdx}
              className="group relative aspect-video rounded-xl overflow-hidden border border-[var(--adm-card-border)] bg-[var(--adm-card)] shadow-xs"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt={`Gallery photo ${pIdx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/75 text-[9px] text-white font-mono font-bold">
                {String(pIdx + 1).padStart(2, "0")}
              </div>
              <button
                type="button"
                onClick={() => handleRemovePhoto(pIdx)}
                className="absolute top-1 right-1 w-6 h-6 rounded-md bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                title="Remove photo"
              >
                ✕
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-black/70 px-1 py-0.5 text-[9px] text-white/90 truncate font-mono">
                {photo.split("/").pop()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-4 rounded-xl border border-dashed border-[var(--adm-card-border)] hover:border-[var(--primary)] text-center cursor-pointer bg-[var(--adm-card-subtle)]"
        >
          <p className="text-xs text-[var(--adm-text-muted)]">
            No gallery photos added yet. Click &ldquo;+ Upload Photos&rdquo; to add tournament or initiative photos.
          </p>
        </div>
      )}

      {/* Presets for kickball tournament */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[10px] text-[var(--adm-text-muted)] font-medium">
          Quick Shortcut:
        </span>
        <button
          type="button"
          onClick={() =>
            onChange([
              "/kickball_tournament.png",
              "/kickball_action_1.jpg",
              "/kickball_action_2.jpg",
              "/kickball_action_3.jpg",
            ])
          }
          className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--adm-card-subtle)] hover:bg-[var(--primary)]/10 text-[var(--adm-text-primary)] hover:text-[var(--primary)] border border-[var(--adm-card-border)] transition-colors cursor-pointer"
        >
          Reset to 4 Official Kickball Photos
        </button>
      </div>
    </div>
  );
}

function getTabIcon(tabId: string) {
  switch (tabId) {
    case "overview":
      return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      );
    case "leads":
      return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
          <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      );
    case "bookings":
      return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
          <path d="M12 14v2l1.5 1.5" />
        </svg>
      );
    case "hero":
      return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case "about":
      return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "services":
      return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case "contracts":
      return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" x2="8" y1="13" y2="13" />
          <line x1="16" x2="8" y1="17" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "partnerships":
      return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
          <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
          <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </svg>
      );
    case "news":
      return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8" />
          <path d="M15 18h-5" />
          <path d="M10 6h8v4h-8V6Z" />
        </svg>
      );
    case "careers":
      return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" x2="20" y1="8" y2="14" />
          <line x1="23" x2="17" y1="11" y2="11" />
        </svg>
      );
    case "community":
      return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case "quiz":
      return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      );
    case "knowledge":
      return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" x2="12.01" y1="17" y2="17" />
        </svg>
      );
    case "settings":
      return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

function getPaginationRange(current: number, total: number): number[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, total];
  }
  if (current >= total - 2) {
    return [1, total - 3, total - 2, total - 1, total];
  }
  return [1, current - 1, current, current + 1, total];
}

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  // ── AUTH STATE ──
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isResetView, setIsResetView] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const isResetMode = searchParams.get("mode") === "reset";

  // ── THEME STATE (LIGHT & DARK MODE) ──
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const isDark = theme === "dark";

  useEffect(() => {
    try {
      const saved = localStorage.getItem("inferno_admin_theme") as
        | "light"
        | "dark"
        | null;
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      } else if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    } catch {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("inferno_admin_theme", nextTheme);
    } catch (e) {
      console.warn("Could not save theme", e);
    }
  };

  // ── ACTIVE NAVIGATION TAB ──
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const isExpanded = isSidebarHovered || isSidebarOpen;
  const [toastState, setToastState] = useState<{
    message: string;
    type?: "success" | "error" | "info" | "warning";
  } | null>(null);

  // ── CRM CONFIRMATION & NOTE STATES ──
  const [leadToDelete, setLeadToDelete] = useState<AdminLead | null>(null);
  const [isDeletingLead, setIsDeletingLead] = useState(false);
  const [leadToModifyStatus, setLeadToModifyStatus] = useState<{
    lead: AdminLead;
    newStatus: "new" | "reviewed" | "contacted" | "archived";
  } | null>(null);
  const [isModifyingStatus, setIsModifyingStatus] = useState(false);
  const [editedLeadNotes, setEditedLeadNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // ── CMS DATA STATES ──
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [hero, setHero] = useState<HeroData | null>(null);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [aiFeatures, setAiFeatures] = useState<FeatureCard[]>([]);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [communityStories, setCommunityStories] = useState<CommunityStory[]>(
    [],
  );
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [chatbotQA, setChatbotQA] = useState<KnowledgeBaseItem[]>([]);
  const [privacy, setPrivacy] = useState<LegalPage | null>(null);
  const [conduct, setConduct] = useState<LegalPage | null>(null);
  const [partnerCards, setPartnerCards] = useState<PartnerCardItem[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // ── LEADS CRM FILTERS & INSPECTION ──
  const [leadSearch, setLeadSearch] = useState("");
  const [leadTypeFilter, setLeadTypeFilter] = useState("ALL");
  const [leadStatusFilter, setLeadStatusFilter] = useState("ALL");
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);

  // ── BOOKINGS & CALENDAR SYNC STATE ──
  const [dbBookings, setDbBookings] = useState<any[]>([]);
  const [bookingRealtimeStatus, setBookingRealtimeStatus] = useState<
    "connecting" | "live" | "polling"
  >("connecting");
  const [bookingLoadError, setBookingLoadError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [activeSlotsCount, setActiveSlotsCount] = useState<number | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [liveSlotsList, setLiveSlotsList] = useState<any[]>([]);
  const [showSlotsGrid, setShowSlotsGrid] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
  const [delayMinutes, setDelayMinutes] = useState(10);
  const [delayReason, setDelayReason] = useState("");
  const [customMeetingUrl, setCustomMeetingUrl] = useState("");
  const [isUpdatingBooking, setIsUpdatingBooking] = useState(false);

  // ── PAGINATION STATE ──
  const [leadCurrentPage, setLeadCurrentPage] = useState(1);
  const [leadPageSize, setLeadPageSize] = useState(10);
  const [bookingCurrentPage, setBookingCurrentPage] = useState(1);
  const [bookingPageSize, setBookingPageSize] = useState(10);

  // ── DEDICATED LEADS CRM STATE ──
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const leadsFetchedRef = useRef(false);

  // ── SUPABASE DATABASE CMS SYNC STATE ──
  const [dbSyncStatus, setDbSyncStatus] = useState<
    "synced" | "syncing" | "offline"
  >("synced");
  const [isSyncingDb, setIsSyncingDb] = useState(false);
  const [lastDbSync, setLastDbSync] = useState<Date | null>(null);

  // ── MODAL EDITING STATE ──
  const [editModal, setEditModal] = useState<{
    type: string;
    item: any;
    isNew: boolean;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback(
    (
      msg: string,
      type: "success" | "error" | "info" | "warning" = "success",
    ) => {
      setToastState({ message: msg, type });
      setTimeout(() => {
        setToastState((prev) => (prev?.message === msg ? null : prev));
      }, 4000);
    },
    [],
  );

  const fetchSupabaseBookings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, booking_slots(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setDbBookings(data ?? []);
      setBookingLoadError(null);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Unable to refresh CMS bookings:", error);
      setBookingLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load bookings. Check the Supabase connection and table access.",
      );
      setBookingRealtimeStatus("polling");
    }
  }, [supabase]);

  // ── DEDICATED LEADS FETCHER (Isolated from CMS setting cycles) ──
  const fetchLeads = useCallback(async (showToastNotice = false) => {
    setIsLoadingLeads(true);
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.leads)) {
          setLeads(json.leads);
          dataStore.saveLeads(json.leads);
          leadsFetchedRef.current = true;
          if (showToastNotice) {
            showToast(`Loaded ${json.leads.length} leads from database.`);
          }
        }
      }
    } catch (err) {
      console.error("Unable to load leads from /api/leads:", err);
      if (showToastNotice) {
        showToast("Error loading leads from database.");
      }
    } finally {
      setIsLoadingLeads(false);
    }
  }, []);

  // ── LOAD ALL CMS DATA ──
  const loadAllData = useCallback(() => {
    setHero(dataStore.getHero());
    setStats(dataStore.getStats());
    setAiFeatures(dataStore.getAIInnovation());
    setAbout(dataStore.getAbout());
    setTeam(dataStore.getTeam());
    setServices(dataStore.getServices());
    setContracts(dataStore.getContracts());
    setCapabilities(dataStore.getCapabilities());
    setArticles(dataStore.getArticles());
    setJobs(dataStore.getJobs());
    setCommunityStories(dataStore.getCommunityStories());
    setTestimonials(dataStore.getTestimonials());
    setFaqs(dataStore.getFAQs());
    setResources(dataStore.getResources());
    setChatbotQA(dataStore.getChatbotQA());
    setPrivacy(dataStore.getLegalPrivacy());
    setConduct(dataStore.getLegalConduct());
    setPartnerCards(dataStore.getPartnerCards());
    setQuizQuestions(dataStore.getQuizQuestions());
    setSiteSettings(dataStore.getSiteSettings());
    return fetchSupabaseBookings();
  }, [fetchSupabaseBookings]);

  // ── SUPABASE CMS DATABASE SYNC HANDLERS ──
  const handleSyncFromSupabase = useCallback(
    async (quiet = false) => {
      setIsSyncingDb(true);
      setDbSyncStatus("syncing");
      try {
        const res = await dataStore.syncFromSupabase();
        if (res.success) {
          setDbSyncStatus("synced");
          setLastDbSync(new Date());
          loadAllData();
          if (!quiet)
            showToast(
              `Supabase synced successfully (${res.count} collections live).`,
            );
        } else {
          setDbSyncStatus("offline");
          if (!quiet) showToast("Operating from local cache.");
        }
      } catch {
        setDbSyncStatus("offline");
        if (!quiet) showToast("Database sync notice.");
      } finally {
        setIsSyncingDb(false);
      }
    },
    [loadAllData],
  );

  const handlePushAllToSupabase = async () => {
    setIsSyncingDb(true);
    try {
      const success = await dataStore.pushAllToSupabase();
      if (success) {
        setDbSyncStatus("synced");
        setLastDbSync(new Date());
        showToast(
          "All CMS records pushed to Supabase PostgreSQL database successfully.",
        );
      } else {
        showToast("Database push failed. Please check network/credentials.");
      }
    } catch {
      showToast("Database push failed.");
    } finally {
      setIsSyncingDb(false);
    }
  };

  // ── CHECK AUTH ON MOUNT ──
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (session?.user) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email ?? "Admin");
          loadAllData();
          void fetchLeads();
          void handleSyncFromSupabase(true);
          return;
        }
      } catch (error) {
        console.error("Unable to verify the Supabase session:", error);
      }
      setIsAuthenticated(false);
    };

    void checkAuth();
  }, [fetchLeads, loadAllData, supabase]);

  // Refetch leads whenever the user switches to the Leads CRM tab
  useEffect(() => {
    if (isAuthenticated && activeTab === "leads") {
      void fetchLeads();
    }
  }, [activeTab, fetchLeads, isAuthenticated]);

  // Keep browser-stored CMS content current across tabs and refresh bookings live.
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleStorage = (event: StorageEvent) => {
      const key = event?.key;
      if (
        !key ||
        (typeof key === "string" &&
          key.startsWith("inferno_") &&
          key !== "inferno_admin_theme")
      ) {
        loadAllData();
        setLastUpdated(new Date());
      }
    };
    const handleCMS = () => {
      loadAllData();
      setLastUpdated(new Date());
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadAllData();
      }
    };
    const refreshInterval = window.setInterval(() => {
      loadAllData();
    }, 30_000);
    const channel = supabase
      .channel("admin-dashboard-bookings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => void fetchSupabaseBookings(),
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setBookingRealtimeStatus("live");
          void fetchSupabaseBookings();
        } else {
          setBookingRealtimeStatus("polling");
        }
      });

    const handleSyncState = (e: Event) => {
      const custom = e as CustomEvent<{
        status: "idle" | "syncing" | "synced" | "error";
        key?: string;
        timestamp?: number;
      }>;
      if (!custom.detail) return;
      if (custom.detail.status === "syncing") {
        setIsSyncingDb(true);
        setDbSyncStatus("syncing");
      } else if (custom.detail.status === "synced") {
        setIsSyncingDb(false);
        setDbSyncStatus("synced");
        setLastDbSync(new Date(custom.detail.timestamp || Date.now()));
      } else if (custom.detail.status === "error") {
        setIsSyncingDb(false);
        setDbSyncStatus("offline");
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cms-update", handleCMS);
    window.addEventListener("cms-sync-state", handleSyncState);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cms-update", handleCMS);
      window.removeEventListener("cms-sync-state", handleSyncState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      void supabase.removeChannel(channel);
    };
  }, [fetchSupabaseBookings, isAuthenticated, loadAllData, supabase]);

  // ── AUTH HANDLERS ──
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });

      if (error) {
        setAuthError(error.message);
      } else if (data.session) {
        setIsAuthenticated(true);
        setUserEmail(data.session.user.email ?? "admin@theinfernogroup.com");
        loadAllData();
        void fetchLeads();
        showToast("Authenticated via Supabase Auth.");
      }
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Failed to authenticate.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) {
      setAuthError(
        "Please provide your admin email to receive reset instructions.",
      );
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(authEmail, {
        redirectTo: `${window.location.origin}/auth/callback?next=/infernollc/admin?mode=reset`,
      });
      if (error) throw error;
      setResetSuccess(true);
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to send password reset transmission.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Unable to sign out of the CMS:", error);
      showToast(
        error instanceof Error
          ? `Sign out failed: ${error.message}`
          : "Sign out failed. Please try again.",
      );
      return;
    }
    setIsAuthenticated(false);
    setUserEmail(null);
    showToast("Signed out of Admin Operations Desk.");
  };

  // Keep edited notes in sync when opening or changing selected lead
  useEffect(() => {
    if (selectedLead) {
      setEditedLeadNotes(selectedLead.adminNotes || "");
    }
  }, [selectedLead]);

  // ── CRM ACTIONS WITH PROPER CONFIRMATIONS & TOASTS ──
  const handleRequestChangeStatus = (
    lead: AdminLead,
    newStatus: "new" | "reviewed" | "contacted" | "archived",
  ) => {
    if ((lead.status || "new") === newStatus) return;
    setLeadToModifyStatus({ lead, newStatus });
  };

  const handleConfirmStatusChange = async () => {
    if (!leadToModifyStatus) return;
    setIsModifyingStatus(true);
    const { lead, newStatus } = leadToModifyStatus;
    const leadName = lead.name || lead.contactName || "Client";

    try {
      const updated = leads.map((l) =>
        l.id === lead.id ? { ...l, status: newStatus } : l,
      );
      setLeads(updated);
      dataStore.saveLeads(updated);

      if (selectedLead && selectedLead.id === lead.id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }

      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to sync status to database");
      }

      setLeadToModifyStatus(null);
      showToast(
        `✓ Status for ${leadName} marked as ${newStatus.toUpperCase()} & saved to Supabase.`,
        "success",
      );
    } catch (err) {
      console.warn("Async lead update sync error:", err);
      setLeadToModifyStatus(null);
      showToast(
        `Status updated locally to ${newStatus.toUpperCase()} (offline mode).`,
        "warning",
      );
    } finally {
      setIsModifyingStatus(false);
    }
  };

  const handleRequestDeleteLead = (lead: AdminLead) => {
    setLeadToDelete(lead);
  };

  const handleConfirmDeleteLead = async () => {
    if (!leadToDelete) return;
    setIsDeletingLead(true);
    const leadId = leadToDelete.id;
    const leadName =
      leadToDelete.name || leadToDelete.contactName || "Anonymous";

    try {
      const res = await fetch(`/api/leads?id=${encodeURIComponent(leadId)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete record from database");
      }

      const updated = leads.filter((l) => l.id !== leadId);
      setLeads(updated);
      dataStore.saveLeads(updated);

      if (selectedLead?.id === leadId) {
        setSelectedLead(null);
      }

      setLeadToDelete(null);
      showToast(
        `✓ Transmission from ${leadName} (#${leadId.slice(0, 8)}) permanently deleted.`,
        "success",
      );
    } catch (err) {
      console.error("Async lead delete error:", err);
      showToast("Failed to delete transmission record from database.", "error");
    } finally {
      setIsDeletingLead(false);
    }
  };

  const handleSaveNotesExplicit = async () => {
    if (!selectedLead) return;
    setIsSavingNotes(true);
    const leadId = selectedLead.id;
    const adminNotes = editedLeadNotes;

    try {
      const updated = leads.map((l) =>
        l.id === leadId ? { ...l, adminNotes } : l,
      );
      setLeads(updated);
      dataStore.saveLeads(updated);
      setSelectedLead({ ...selectedLead, adminNotes });

      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, adminNotes }),
      });

      if (!res.ok) {
        throw new Error("Failed to save admin notes to database");
      }

      showToast("✓ Internal notes updated and synced to Supabase.", "success");
    } catch (err) {
      console.warn("Async lead notes sync error:", err);
      showToast("Notes saved locally (offline mode).", "warning");
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Legacy fallback compatibility methods
  const updateLeadStatus = async (
    leadId: string,
    status: "new" | "reviewed" | "contacted" | "archived",
  ) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (targetLead) {
      handleRequestChangeStatus(targetLead, status);
    }
  };

  const saveLeadAdminNotes = async (leadId: string, adminNotes: string) => {
    setEditedLeadNotes(adminNotes);
    const updated = leads.map((l) =>
      l.id === leadId ? { ...l, adminNotes } : l,
    );
    setLeads(updated);
    dataStore.saveLeads(updated);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, adminNotes });
    }
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, adminNotes }),
      });
      showToast("✓ Admin notes updated and synced to Supabase.", "success");
    } catch {
      showToast("Admin notes saved locally.", "warning");
    }
  };

  const deleteLead = async (leadId: string) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (targetLead) {
      handleRequestDeleteLead(targetLead);
    }
  };

  const exportLeadsCSV = () => {
    if (filteredLeads.length === 0) {
      alert("No leads available to export with current filters.");
      return;
    }
    const headers = [
      "ID",
      "Type",
      "Created At",
      "Status",
      "Name / Contact",
      "Email",
      "Phone",
      "Company / Organization",
      "Details / Scope",
      "Admin Notes",
    ];
    const rows = filteredLeads.map((l) => [
      `"${l.id}"`,
      `"${l.type}"`,
      `"${new Date(l.createdAt).toLocaleString()}"`,
      `"${l.status || "new"}"`,
      `"${l.name || l.contactName || "N/A"}"`,
      `"${l.email || l.contactEmail || "N/A"}"`,
      `"${l.phone || "N/A"}"`,
      `"${l.company || l.partnerCompany || l.org || "N/A"}"`,
      `"${(l.message || l.notes || l.jobTitle || l.solicitation || l.resourceTitle || "").replace(/"/g, '""')}"`,
      `"${(l.adminNotes || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Inferno_Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported leads to CSV.");
  };

  // Open Resume payload in a new tab (PDF/document) or formatted applicant dossier
  const handleOpenResume = (lead: AdminLead) => {
    if (lead.resumeData && lead.resumeData.startsWith("data:")) {
      try {
        const arr = lead.resumeData.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "application/pdf";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        const newTab = window.open(blobUrl, "_blank", "noopener,noreferrer");
        if (!newTab) {
          // Fallback if popup blocker intercepted window.open
          const tempLink = document.createElement("a");
          tempLink.href = blobUrl;
          tempLink.target = "_blank";
          tempLink.rel = "noopener noreferrer";
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
        }
        setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
        return;
      } catch (err) {
        console.error("Error opening resume blob:", err);
      }
    }

    // Text fallback dossier if no binary file was attached
    const textContent =
      `=================================================================\n` +
      `THE INFERNO GROUP LLC - APPLICANT DOSSIER\n` +
      `=================================================================\n\n` +
      `ROLE APPLIED: ${lead.jobTitle || "Cadre Position"}\n` +
      `CANDIDATE NAME: ${lead.name || lead.contactName || "N/A"}\n` +
      `EMAIL: ${lead.email || lead.contactEmail || "N/A"}\n` +
      `PHONE: ${lead.phone || "N/A"}\n` +
      `TRANSMITTED ON: ${new Date(lead.createdAt).toLocaleString()}\n\n` +
      `COVER STATEMENT / STATEMENT OF INTEREST:\n${lead.cover || lead.message || "None provided."}\n\n` +
      `RESUME RECORD: ${lead.resumeName || "Uploaded via Portal"}\n`;
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const newTab = window.open(blobUrl, "_blank", "noopener,noreferrer");
    if (!newTab) {
      const tempLink = document.createElement("a");
      tempLink.href = blobUrl;
      tempLink.target = "_blank";
      tempLink.rel = "noopener noreferrer";
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    }
    setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
  };

  // Download Resume payload if Base64 exists or generate text dossier
  const handleDownloadResume = (lead: AdminLead) => {
    if (lead.resumeData && lead.resumeData.startsWith("data:")) {
      const link = document.createElement("a");
      link.href = lead.resumeData;
      link.download = lead.resumeName || `Resume_${lead.name || lead.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    // Text fallback dossier
    const textContent =
      `=================================================================\n` +
      `THE INFERNO GROUP LLC - APPLICANT DOSSIER\n` +
      `=================================================================\n\n` +
      `ROLE APPLIED: ${lead.jobTitle || "Cadre Position"}\n` +
      `CANDIDATE NAME: ${lead.name}\n` +
      `EMAIL: ${lead.email}\n` +
      `PHONE: ${lead.phone || "N/A"}\n` +
      `TRANSMITTED ON: ${new Date(lead.createdAt).toLocaleString()}\n\n` +
      `COVER STATEMENT:\n${lead.cover || "None provided."}\n\n` +
      `RESUME RECORD: ${lead.resumeName || "Uploaded via Portal"}\n`;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Applicant_${(lead.name || "Cadre").replace(/\s+/g, "_")}_Dossier.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── CALENDAR & BOOKINGS ACTIONS ──
  const handleTriggerCalendarSync = async () => {
    setIsSyncingCalendar(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/bookings/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Calendar sync failed.");
      setSyncResult(
        `Sync Successful: Evaluated ${data.totalSlotsEvaluated} slots, detected ${data.syncedRangesCount} external calendar busy windows.`,
      );
      showToast("Google & Outlook calendars synchronized.");
      fetchSupabaseBookings();
    } catch (err: any) {
      setSyncResult(
        `Sync Error: ${err.message || "Failed to reach booking sync endpoint."}`,
      );
    } finally {
      setIsSyncingCalendar(false);
    }
  };

  const handleInspectSlots = async () => {
    setIsLoadingSlots(true);
    try {
      const res = await fetch("/api/bookings/slots?days=14");
      const data = await res.json();
      if (data.slots) {
        setLiveSlotsList(data.slots);
        setActiveSlotsCount(data.slots.length);
        setShowSlotsGrid(true);
        showToast(
          `Retrieved ${data.slots.length} available slots for the next 14 days.`,
        );
      }
    } catch (err: any) {
      alert("Failed to query live slots: " + err.message);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // ── BOOKING MANAGEMENT & ACTION HANDLERS ──
  const handleSelectBooking = (b: any) => {
    setSelectedBooking(b);
    setCustomMeetingUrl(b.meeting_url || "");
  };

  const handleSelectSlot = (slot: any) => {
    // Find matching booking if this slot is already booked
    const matching = combinedBookings.find(
      (b) =>
        (b.raw?.slot_id && b.raw.slot_id === slot.id) ||
        (b.slot_date === new Date(slot.start_time).toLocaleDateString() &&
          b.slot_time ===
            new Date(slot.start_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })),
    );
    if (matching) {
      handleSelectBooking(matching);
    } else {
      // Create a virtual booking view for this slot
      const virtual = {
        id: slot.id,
        full_name: "Available / Unassigned",
        email: "operations@theinfernogroup.com",
        phone: "N/A",
        company: "The Inferno Group Consultation Desk",
        meeting_type: "Strategy Consultation",
        created_at: slot.start_time,
        slot_date: new Date(slot.start_time).toLocaleDateString(),
        slot_time: new Date(slot.start_time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timezone: slot.timezone || "EST",
        status: slot.is_available ? "available" : "reserved",
        meeting_url: `https://meet.google.com/lookup/tig-${slot.id ? slot.id.slice(0, 8) : "consultation"}`,
        delay_minutes: 0,
        delay_message: "",
        notes: `Live calendar slot (${new Date(slot.start_time).toLocaleString()} – ${new Date(slot.end_time).toLocaleTimeString()}). Click 'Join Video Room' to test audio/video environment.`,
        source: "Live Calendar Inventory",
        raw: slot,
      };
      handleSelectBooking(virtual);
    }
  };

  const handleJoinMeeting = (b: any) => {
    const targetUrl =
      b.meeting_url ||
      b.raw?.meeting_url ||
      `https://meet.google.com/lookup/tig-${b.id ? b.id.slice(0, 8) : "consultation"}`;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    showToast(`Opening meeting room for ${b.full_name}...`);
  };

  const handleConfirmBooking = async (b: any) => {
    setIsUpdatingBooking(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id, status: "confirmed" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDbBookings((prev) =>
          prev.map((item) =>
            item.id === b.id ? { ...item, status: "confirmed" } : item,
          ),
        );
        setSelectedBooking((prev: any) =>
          prev ? { ...prev, status: "confirmed" } : null,
        );
        showToast(`Consultation with ${b.full_name} confirmed.`);
      } else {
        setSelectedBooking((prev: any) =>
          prev ? { ...prev, status: "confirmed" } : null,
        );
        showToast("Consultation marked as confirmed.");
      }
    } catch {
      showToast("Consultation marked as confirmed.");
    } finally {
      setIsUpdatingBooking(false);
    }
  };

  const handleSaveMeetingUrl = async (id: string, meeting_url: string) => {
    if (!meeting_url) return;
    setIsUpdatingBooking(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, meeting_url }),
      });
      if (res.ok) {
        setDbBookings((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, meeting_url } : item,
          ),
        );
        setSelectedBooking((prev: any) =>
          prev ? { ...prev, meeting_url } : null,
        );
        showToast("Custom meeting room URL saved.");
      } else {
        setSelectedBooking((prev: any) =>
          prev ? { ...prev, meeting_url } : null,
        );
        showToast("Meeting URL updated.");
      }
    } catch {
      showToast("Meeting URL updated.");
    } finally {
      setIsUpdatingBooking(false);
    }
  };

  const handleApplyDelay = async (b: any, minutes: number, reason: string) => {
    setIsUpdatingBooking(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: b.id,
          delay_minutes: minutes,
          delay_message: reason,
          status: "delayed",
        }),
      });
      if (res.ok) {
        setDbBookings((prev) =>
          prev.map((item) =>
            item.id === b.id
              ? {
                  ...item,
                  delay_minutes: minutes,
                  delay_message: reason,
                  status: "delayed",
                }
              : item,
          ),
        );
      }
      setSelectedBooking((prev: any) =>
        prev
          ? {
              ...prev,
              delay_minutes: minutes,
              delay_message: reason,
              status: "delayed",
            }
          : null,
      );
      setIsDelayModalOpen(false);
      showToast(`Delay notice recorded: +${minutes} minutes.`);
    } catch {
      setIsDelayModalOpen(false);
      showToast(`Delay (+${minutes}m) saved.`);
    } finally {
      setIsUpdatingBooking(false);
    }
  };

  const handleSendDelayEmail = (b: any, minutes: number, reason: string) => {
    const subject = encodeURIComponent(
      `Update regarding our upcoming consultation: The Inferno Group (+${minutes}m)`,
    );
    const body = encodeURIComponent(
      `Hi ${b.full_name},\n\nPlease note our consultation scheduled for ${b.slot_date} at ${b.slot_time} (${b.timezone}) will begin approximately ${minutes} minutes late.\n\n${reason ? `Reason / Note: ${reason}\n\n` : ""}Meeting Link: ${b.meeting_url || `https://meet.google.com/lookup/tig-${b.id ? b.id.slice(0, 8) : "consultation"}`}\n\nThank you for your understanding.\n\nBest regards,\nExecutive Operations Team\nThe Inferno Group\nhttps://theinfernogroup.com`,
    );
    window.open(`mailto:${b.email}?subject=${subject}&body=${body}`, "_blank");
    handleApplyDelay(b, minutes, reason);
  };

  const handleDeleteBooking = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to cancel this booking and free up the consultation slot?",
      )
    )
      return;
    setIsUpdatingBooking(true);
    try {
      const res = await fetch(`/api/bookings?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDbBookings((prev) => prev.filter((b) => b.id !== id));
        setSelectedBooking(null);
        showToast("Booking cancelled and slot restored to available.");
        void fetchSupabaseBookings();
      } else {
        alert("Failed to cancel booking via server API.");
      }
    } catch (err: any) {
      alert("Error cancelling booking: " + err.message);
    } finally {
      setIsUpdatingBooking(false);
    }
  };

  // ── BACKUP, EXPORT & FACTORY RESET ──
  const handleExportFullJSON = () => {
    const fullSnapshot = dataStore.exportFullSnapshot();
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(fullSnapshot, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute(
      "download",
      `TheInfernoGroup_CMS_Backup_${new Date().toISOString().slice(0, 10)}.json`,
    );
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast("Full CMS state exported to JSON.");
  };

  const handleImportJSONClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (!e.target.files || e.target.files.length === 0) return;
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        dataStore.importFullSnapshot(parsed);
        void dataStore.pushAllToSupabase();
        loadAllData();
        showToast("CMS snapshot restored and synced to Supabase successfully!");
      } catch {
        alert(
          "Invalid JSON format. Please provide an authentic Inferno CMS snapshot.",
        );
      }
    };
  };

  const handleResetToFactoryDefaults = () => {
    const confirmed = confirm(
      "WARNING: This will reset all CMS content (Hero, Services, Team, FAQs, Knowledge Base, Contracts, etc.) to factory default definitions and sync to Supabase. Do you wish to continue?",
    );
    if (!confirmed) return;
    dataStore.resetAllToDefaults();
    void dataStore.pushAllToSupabase();
    loadAllData();
    showToast("CMS restored to factory defaults and synced to Supabase.");
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      const matchesType =
        leadTypeFilter === "ALL" ||
        item.type.toUpperCase() === leadTypeFilter.toUpperCase();
      const status = item.status || "new";
      const matchesStatus =
        leadStatusFilter === "ALL" || status === leadStatusFilter;
      const q = leadSearch.toLowerCase();
      const matchesQuery =
        !q ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.contactName && item.contactName.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.contactEmail && item.contactEmail.toLowerCase().includes(q)) ||
        (item.company && item.company.toLowerCase().includes(q)) ||
        (item.org && item.org.toLowerCase().includes(q)) ||
        (item.jobTitle && item.jobTitle.toLowerCase().includes(q)) ||
        (item.solicitation && item.solicitation.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q));
      return matchesType && matchesStatus && matchesQuery;
    });
  }, [leads, leadTypeFilter, leadStatusFilter, leadSearch]);

  // Combined Bookings
  const combinedBookings = useMemo(() => {
    const localBookings = leads
      .filter((l) => l.type === "BOOKING")
      .map((l) => ({
        id: l.id,
        full_name: l.name || "Anonymous Client",
        email: l.email || "N/A",
        phone: l.phone || "N/A",
        company: l.company || "N/A",
        meeting_type: l.consultType || "Consultation",
        created_at: l.createdAt,
        slot_date: l.date || "Scheduled",
        slot_time: l.time || "",
        timezone: l.timezone || "EST",
        status: (l as any).status || "confirmed",
        meeting_url: (l as any).meeting_url || "",
        delay_minutes: (l as any).delay_minutes || 0,
        delay_message: (l as any).delay_message || "",
        notes: l.notes || l.message || "",
        source: "Local Transmission",
        raw: l,
      }));

    const remote = dbBookings.map((b) => ({
      id: b.id,
      full_name: b.full_name,
      email: b.email,
      phone: b.phone || "N/A",
      company: b.company || "N/A",
      meeting_type: b.meeting_type,
      created_at: b.created_at,
      slot_date: b.booking_slots
        ? new Date(b.booking_slots.start_time).toLocaleDateString()
        : "N/A",
      slot_time: b.booking_slots
        ? new Date(b.booking_slots.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A",
      timezone: b.booking_slots?.timezone || "EST",
      status: b.status || "pending",
      meeting_url: b.meeting_url || "",
      delay_minutes: b.delay_minutes || 0,
      delay_message: b.delay_message || "",
      notes: b.notes || "",
      source: "Supabase Database",
      raw: b,
    }));

    return [...remote, ...localBookings];
  }, [leads, dbBookings]);

  // ── PAGINATION COMPUTATIONS & AUTO-RESETS ──
  const totalLeadPages = Math.max(
    1,
    Math.ceil(filteredLeads.length / leadPageSize),
  );
  const paginatedLeads = useMemo(() => {
    const start = (leadCurrentPage - 1) * leadPageSize;
    return filteredLeads.slice(start, start + leadPageSize);
  }, [filteredLeads, leadCurrentPage, leadPageSize]);

  const totalBookingPages = Math.max(
    1,
    Math.ceil(combinedBookings.length / bookingPageSize),
  );
  const paginatedBookings = useMemo(() => {
    const start = (bookingCurrentPage - 1) * bookingPageSize;
    return combinedBookings.slice(start, start + bookingPageSize);
  }, [combinedBookings, bookingCurrentPage, bookingPageSize]);

  useEffect(() => {
    setLeadCurrentPage(1);
  }, [leadTypeFilter, leadStatusFilter, leadSearch, leadPageSize]);

  useEffect(() => {
    setBookingCurrentPage(1);
  }, [bookingPageSize]);

  const recentLeads = useMemo(
    () =>
      [...leads]
        .sort(
          (first, second) =>
            new Date(second.createdAt).getTime() -
            new Date(first.createdAt).getTime(),
        )
        .slice(0, 6),
    [leads],
  );

  const leadActivityByDay = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      return {
        label: date.toLocaleDateString(undefined, { weekday: "short" }),
        count: leads.filter((lead) => {
          const createdAt = new Date(lead.createdAt).getTime();
          return createdAt >= date.getTime() && createdAt < nextDate.getTime();
        }).length,
      };
    });
  }, [leads]);

  const handleDashboardRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadAllData();
    } finally {
      setIsRefreshing(false);
    }
  };

  // ── AUTH GATE SCREEN ──
  if (isAuthenticated === null) {
    return (
      <div
        id="admin-panel"
        data-theme={theme}
        className="min-h-screen bg-[var(--adm-bg)] flex items-center justify-center text-[var(--adm-text-primary)] font-[family-name:var(--font-outfit)]"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-mono text-[var(--adm-text-muted)] font-medium tracking-wider">
            Verifying Admin Security Clearance...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        id="admin-panel"
        data-theme={theme}
        className="min-h-screen bg-[var(--adm-bg)] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-[family-name:var(--font-outfit)]"
      >
        {/* Floating Theme Toggle on Auth Screen */}
        <div className="absolute top-6 right-6 z-20">
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-all cursor-pointer shadow-md ${
              isDark
                ? "border-white/20 bg-white/10 hover:bg-white/20 text-white"
                : "border-slate-300 bg-white/95 hover:bg-white text-slate-900 shadow-sm"
            }`}
            title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
          >
            <span>{isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
          </button>
        </div>

        {/* Ambient Brand Spotlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(225,77,24,0.18)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(26,86,196,0.15)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="w-full max-w-md bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-[24px] shadow-2xl p-8 z-10">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="The Inferno Group"
              className="h-11 mb-3"
            />
            <h2 className="text-xl font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
              Operations Desk &amp; CMS
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-[var(--adm-text-muted)] font-mono font-semibold tracking-wider">
                SECURE GOVCON PORTAL
              </span>
            </div>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs leading-relaxed font-semibold">
              {authError}
            </div>
          )}

          {resetSuccess ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                ✓
              </div>
              <h3 className="text-[var(--adm-text-primary)] font-semibold text-sm mb-1 font-[family-name:var(--font-space-grotesk)]">
                Password Reset Transmission Sent
              </h3>
              <p className="text-xs text-[var(--adm-text-muted)] mb-6">
                Check your inbox for a secure credential recovery token to update your
                administrative credentials.
              </p>
              <button
                type="button"
                onClick={() => {
                  setResetSuccess(false);
                  setIsResetView(false);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold hover:bg-[#c84113] transition-all cursor-pointer shadow-xs"
              >
                ← Return to Sign In
              </button>
            </div>
          ) : isResetView ? (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mx-auto mb-2 border border-[var(--primary)]/20 shadow-xs">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
                  Reset Administrative Passcode
                </h3>
                <p className="text-xs text-[var(--adm-text-muted)] mt-1">
                  Enter your administrative email to receive a secure credential reset link.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--adm-text-primary)] uppercase tracking-wider mb-1.5 font-[family-name:var(--font-space-grotesk)]">
                  Administrative Identifier
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="admin@theinfernogroup.com"
                  className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 text-[var(--adm-text-primary)] text-sm rounded-xl px-4 py-3 outline-none transition-all placeholder:text-[var(--adm-text-muted)]"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full mt-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-[var(--primary)]/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer font-[family-name:var(--font-space-grotesk)]"
              >
                {authLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Send Recovery Transmission
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </>
                )}
              </button>

              <div className="pt-3 text-center border-t border-[var(--adm-card-border)]">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetView(false);
                    setAuthError(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--adm-text-muted)] hover:text-[var(--adm-text-primary)] font-semibold transition-colors cursor-pointer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Return to Sign In
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--adm-text-primary)] uppercase tracking-wider mb-1.5 font-[family-name:var(--font-space-grotesk)]">
                  Administrative Identifier
                </label>
                <input
                  type="text"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="admin@theinfernogroup.com"
                  className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 text-[var(--adm-text-primary)] text-sm rounded-xl px-4 py-3 outline-none transition-all placeholder:text-[var(--adm-text-muted)]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-[var(--adm-text-primary)] uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
                    Passcode / Credential Key
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetView(true);
                      setAuthError(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--adm-card-subtle)] hover:bg-[rgba(225,77,24,0.1)] border border-[var(--adm-card-border)] hover:border-[var(--primary)] text-xs text-[var(--adm-text-secondary)] hover:text-[var(--primary)] font-semibold transition-all cursor-pointer shadow-2xs group"
                  >
                    <svg
                      className="w-3 h-3 text-[var(--adm-text-muted)] group-hover:text-[var(--primary)] transition-colors"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Forgot passcode?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 text-[var(--adm-text-primary)] text-sm rounded-xl pl-4 pr-11 py-3 outline-none transition-all placeholder:text-[var(--adm-text-muted)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--adm-text-muted)] hover:text-[var(--adm-text-primary)] transition-colors cursor-pointer rounded-lg hover:bg-[var(--adm-card)]"
                  >
                    {showPassword ? (
                      <svg
                        className="w-4 h-4 text-[var(--primary)]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full mt-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-[var(--primary)]/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer font-[family-name:var(--font-space-grotesk)]"
              >
                {authLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Authenticate Access
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-[var(--adm-card-border)] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthEmail(process.env.NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL || "");
                    setAuthPassword(process.env.NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD || "");
                  }}
                  className="text-xs text-[var(--primary)] font-bold hover:underline transition-colors cursor-pointer"
                >
                  ⚡ One-Click Local Command Clearance
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center text-xs text-[var(--adm-text-muted)] font-medium border-t border-[var(--adm-card-border)] pt-4">
            Authorized Personnel Only &middot; The Inferno Group LLC &middot; 2
            CFR &sect; 200 Security
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN ADMIN INTERFACE ──
  return (
    <div
      id="admin-panel"
      data-theme={theme}
      className="h-screen overflow-hidden bg-[var(--adm-bg)] text-[var(--adm-text-secondary)] flex font-[family-name:var(--font-outfit)]"
    >
      {/* Hidden File Input for JSON Backup Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        accept=".json"
        className="hidden"
      />

      {/* Toast Notification Banner with Type Icons & Colored Borders */}
      {toastState && (
        <div
          role="alert"
          aria-live="assertive"
          className={`fixed top-5 right-5 z-[9999] px-4 py-3 rounded-2xl shadow-2xl text-xs flex items-center gap-3 animate-fade-in font-[family-name:var(--font-space-grotesk)] font-semibold transition-all backdrop-blur-md border ${
            toastState.type === "error"
              ? "bg-[#180808]/95 text-red-100 border-red-500/60 shadow-red-950/40"
              : toastState.type === "warning"
                ? "bg-[#1c1406]/95 text-amber-100 border-amber-500/60 shadow-amber-950/40"
                : toastState.type === "info"
                  ? "bg-[#0b172a]/95 text-blue-100 border-blue-500/60 shadow-blue-950/40"
                  : "bg-[#061a12]/95 text-emerald-100 border-emerald-500/60 shadow-emerald-950/40"
          }`}
        >
          {/* Status Indicator Icon */}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
              toastState.type === "error"
                ? "bg-red-500/20 text-red-400"
                : toastState.type === "warning"
                  ? "bg-amber-500/20 text-amber-400"
                  : toastState.type === "info"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            {toastState.type === "error" ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            ) : toastState.type === "warning" ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            ) : toastState.type === "info" ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>

          <span className="leading-snug">{toastState.message}</span>

          <button
            type="button"
            onClick={() => setToastState(null)}
            aria-label="Dismiss notification"
            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all ml-1.5 cursor-pointer active:scale-90 shrink-0"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* ── SIDEBAR NAVIGATION ── */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-[2px] lg:hidden"
        />
      )}
      <aside
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        style={{
          backgroundColor: "var(--adm-sidebar-bg)",
          color: "var(--adm-sidebar-title)",
        }}
        className={`fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 flex-col transition-[width,transform] duration-300 ease-in-out lg:sticky lg:top-0 lg:z-30 lg:translate-x-0 ${
          isSidebarHovered ? "lg:w-60 shadow-2xl" : "lg:w-[4.5rem] shadow-none"
        } ${
          isSidebarOpen
            ? "translate-x-0 w-[min(18rem,86vw)] shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {/* Brand header - Completely borderless */}
          <div
            style={{
              backgroundColor: "var(--adm-sidebar-header-bg)",
            }}
            className="sticky top-0 z-10 flex h-[70px] items-center justify-between px-4 transition-colors"
          >
            <Link
              href="/"
              className="flex items-center gap-3 overflow-hidden no-underline"
              title="The Inferno Group - Content Workspace"
            >
              <img
                src="/logo.png"
                alt="Logo"
                className={`h-7 w-auto object-contain transition-all shrink-0 ${isDark ? "brightness-0 invert" : ""}`}
              />
              <div
                className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                  isExpanded
                    ? "opacity-100 max-w-[150px]"
                    : "opacity-0 max-w-0 lg:hidden"
                }`}
              >
                <div
                  style={{ color: "var(--adm-sidebar-title)" }}
                  className="text-xs font-bold font-[family-name:var(--font-space-grotesk)] tracking-wider"
                >
                  INFERNO GROUP
                </div>
                <div
                  style={{ color: "var(--adm-sidebar-sub)" }}
                  className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
                >
                  Content workspace
                </div>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar navigation"
              className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] text-[var(--adm-text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all cursor-pointer active:scale-90"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Navigation Items - Pure icons without square boxes or borders */}
          <div
            aria-label="CMS sections"
            className="admin-sidebar-nav space-y-4 px-2.5 py-3"
          >
            {[
              {
                title: "Operations",
                items: [
                  { id: "overview", label: "Overview" },
                  {
                    id: "leads",
                    label: "Leads & inquiries",
                    badge: leads.filter(
                      (lead) => (lead.status || "new") === "new",
                    ).length,
                  },
                  { id: "bookings", label: "Bookings & sync" },
                ],
              },
              {
                title: "Core website",
                items: [
                  { id: "hero", label: "Hero & stats" },
                  { id: "about", label: "About & team" },
                  { id: "services", label: "Services" },
                  { id: "contracts", label: "Contracts" },
                  { id: "partnerships", label: "Partnerships" },
                ],
              },
              {
                title: "Content & Cadre",
                items: [
                  { id: "news", label: "News & bulletins" },
                  { id: "careers", label: "Careers & cadre" },
                  { id: "community", label: "Inferno Cares" },
                ],
              },
              {
                title: "Diagnostics & System",
                items: [
                  { id: "quiz", label: "Eligibility quiz" },
                  { id: "knowledge", label: "FAQs & chatbot" },
                  { id: "settings", label: "Site & brand settings" },
                ],
              },
            ].map((section) => (
              <div key={section.title}>
                <div
                  style={{ color: "var(--adm-sidebar-section)" }}
                  className={`mb-1 px-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-200 whitespace-nowrap overflow-hidden ${
                    isExpanded
                      ? "opacity-100 max-h-6"
                      : "opacity-0 max-h-0 lg:hidden"
                  }`}
                >
                  {section.title}
                </div>
                <div className="space-y-1">
                  {section.items.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        title={tab.label}
                        aria-label={tab.label}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => {
                          setActiveTab(tab.id as AdminTab);
                          setIsSidebarOpen(false);
                        }}
                        className={`group relative flex w-full items-center border-0 transition-all duration-200 cursor-pointer ${
                          isExpanded
                            ? "justify-between rounded-xl px-3 py-2.5"
                            : "mx-auto h-10 w-10 justify-center rounded-none border-0 bg-transparent p-0 shadow-none"
                        } ${
                          isExpanded
                            ? isActive
                              ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold shadow-md shadow-[var(--primary)]/20"
                              : isDark
                                ? "text-slate-400 hover:text-white hover:bg-white/5"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
                            : isActive
                              ? "text-[var(--primary)]"
                              : isDark
                                ? "text-slate-400 hover:text-white"
                                : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          {/* Pure icon without box or borders */}
                          <span className="relative flex h-6 w-6 shrink-0 items-center justify-center transition-transform group-hover:scale-110">
                            {getTabIcon(tab.id)}
                            {!isExpanded &&
                              tab.badge !== undefined &&
                              tab.badge > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[var(--primary)] px-0.5 text-[8px] font-bold text-white shadow-xs">
                                  {tab.badge > 9 ? "9+" : tab.badge}
                                </span>
                              )}
                          </span>
                          <span
                            className={`truncate whitespace-nowrap text-xs font-semibold transition-all duration-300 ${
                              isExpanded
                                ? "opacity-100 max-w-[140px]"
                                : "opacity-0 max-w-0 lg:hidden"
                            }`}
                          >
                            {tab.label}
                          </span>
                        </span>
                        {isExpanded &&
                          tab.badge !== undefined &&
                          tab.badge > 0 && (
                            <span
                              className={`ml-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                                isActive
                                  ? "bg-white text-[var(--primary)] shadow-xs"
                                  : "bg-[var(--primary)] text-white"
                              }`}
                            >
                              {tab.badge}
                            </span>
                          )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User bar & portal links - Completely borderless */}
        <div
          style={{
            backgroundColor: "var(--adm-sidebar-footer-bg)",
          }}
          className={`transition-colors ${isExpanded ? "p-3.5" : "p-2"}`}
        >
          {/* Sidebar Quick Theme Toggle - Borderless */}
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              backgroundColor: isExpanded
                ? "var(--adm-sidebar-toggle-bg)"
                : "transparent",
              color: "var(--adm-sidebar-toggle-text)",
            }}
            aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
            className={`mb-2.5 flex border-0 transition-all cursor-pointer font-[family-name:var(--font-space-grotesk)] ${
              isExpanded
                ? "w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold"
                : "mx-auto h-10 w-10 items-center justify-center rounded-none bg-transparent p-0 text-base shadow-none"
            } ${
              isExpanded
                ? isDark
                  ? "hover:bg-white/10"
                  : "hover:bg-slate-100"
                : ""
            }`}
            title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="text-base">
                {isDark ? "☀️" : "🌙"}
              </span>
              {isExpanded && <span className="whitespace-nowrap">Theme</span>}
            </span>
            {isExpanded && (
              <span
                style={{
                  backgroundColor: "var(--adm-sidebar-badge-bg)",
                  color: "var(--adm-sidebar-badge-text)",
                }}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-bold whitespace-nowrap"
              >
                {theme}
              </span>
            )}
          </button>

          {/* User profile avatar & email - Borderless */}
          <div
            className={`flex items-center mb-2.5 ${
              isExpanded ? "gap-2.5" : "justify-center"
            }`}
            title={userEmail ?? "Admin"}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white font-bold text-xs flex items-center justify-center shrink-0 font-[family-name:var(--font-space-grotesk)] shadow-xs">
              {userEmail ? userEmail[0].toUpperCase() : "A"}
            </div>
            {isExpanded && (
              <div className="overflow-hidden whitespace-nowrap transition-all duration-300">
                <div
                  style={{ color: "var(--adm-sidebar-user-text)" }}
                  className="text-xs font-bold truncate"
                >
                  {userEmail}
                </div>
                <div
                  style={{ color: "var(--adm-sidebar-clearance-text)" }}
                  className="text-xs font-mono font-semibold"
                >
                  Clearance: SuperAdmin
                </div>
              </div>
            )}
          </div>

          {/* Action buttons (Public Site & Sign Out) - Borderless */}
          {isExpanded ? (
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-[family-name:var(--font-space-grotesk)]">
              <Link
                href="/"
                target="_blank"
                style={{
                  backgroundColor: "var(--adm-sidebar-link-btn-bg)",
                  color: "var(--adm-sidebar-link-btn-text)",
                }}
                className={`py-1.5 px-2 rounded-lg font-semibold no-underline text-xs transition-colors ${
                  isDark ? "hover:bg-white/20" : "hover:bg-slate-200"
                }`}
              >
                Public Site ↗
              </Link>
              <button
                onClick={handleSignOut}
                style={{
                  backgroundColor: "var(--adm-sidebar-signout-bg)",
                  color: "var(--adm-sidebar-signout-text)",
                }}
                className={`py-1.5 px-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                  isDark ? "hover:bg-red-500/25" : "hover:bg-red-100"
                }`}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1 items-center">
              <Link
                href="/"
                target="_blank"
                title="Public Site ↗"
                style={{
                  backgroundColor: "var(--adm-sidebar-link-btn-bg)",
                  color: "var(--adm-sidebar-link-btn-text)",
                }}
                className={`h-8 w-8 flex items-center justify-center rounded-lg font-semibold no-underline text-sm transition-colors ${
                  isDark ? "hover:bg-white/20" : "hover:bg-slate-200"
                }`}
              >
                ↗
              </Link>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                style={{
                  backgroundColor: "var(--adm-sidebar-signout-bg)",
                  color: "var(--adm-sidebar-signout-text)",
                }}
                className={`h-8 w-8 flex items-center justify-center rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
                  isDark ? "hover:bg-red-500/25" : "hover:bg-red-100"
                }`}
              >
                ⎋
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Brand Accent Strip */}
        <div className="h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--navy)]"></div>

        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--adm-card-border)] bg-[var(--adm-card)] px-4 py-3 shadow-xs sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isSidebarOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--adm-card-border)] text-[var(--adm-text-primary)] hover:bg-[var(--adm-card-subtle)] cursor-pointer lg:hidden"
            >
              ☰
            </button>
            <div>
              <h1 className="text-lg font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] capitalize">
                {activeTab === "overview" && "Executive Command Center"}
                {activeTab === "leads" &&
                  "Inbound Transmissions & CRM Pipeline"}
                {activeTab === "bookings" &&
                  "Consultation Schedules & Availability"}
                {activeTab === "hero" && "Hero Banner, Stats & AI Innovation"}
                {activeTab === "about" &&
                  "About Us, Core Values & Leadership Team"}
                {activeTab === "services" &&
                  "Core Capabilities & Services Directory"}
                {activeTab === "contracts" &&
                  "Federal Solicitations & Capabilities"}
                {activeTab === "partnerships" &&
                  "Teaming & Subcontractor Opportunities"}
                {activeTab === "news" && "News, Solicitations & Press Articles"}
                {activeTab === "careers" && "Cadre Hiring & Job Openings"}
                {activeTab === "community" &&
                  "Inferno Cares & Client Testimonials"}
                {activeTab === "quiz" &&
                  "B2G Socioeconomic Eligibility Quiz CMS"}
                {activeTab === "knowledge" &&
                  "FAQ Base, Resources Library & Chatbot Q&A"}
                {activeTab === "settings" &&
                  "Global Corporate Identity & Emergency Alerts"}
              </h1>
              <div className="text-xs text-[var(--adm-text-muted)] font-semibold">
                The Inferno Group LLC &bull; Booking updates live &bull; Leads
                sync across tabs
              </div>
            </div>
          </div>

          {/* Quick System Tools & Theme Toggle */}
          <div className="flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
            {/* Live Page Jump Links */}
            {activeTab === "hero" && (
              <Link
                href="/"
                target="_blank"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--adm-text-primary)] transition-colors"
              >
                <span>View Home ↗</span>
              </Link>
            )}
            {activeTab === "about" && (
              <Link
                href="/about"
                target="_blank"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--adm-text-primary)] transition-colors"
              >
                <span>View About ↗</span>
              </Link>
            )}
            {activeTab === "services" && (
              <Link
                href="/services"
                target="_blank"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--adm-text-primary)] transition-colors"
              >
                <span>View Services ↗</span>
              </Link>
            )}
            {activeTab === "contracts" && (
              <Link
                href="/contracts"
                target="_blank"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--adm-text-primary)] transition-colors"
              >
                <span>View Contracts ↗</span>
              </Link>
            )}
            {activeTab === "partnerships" && (
              <Link
                href="/partnerships"
                target="_blank"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--adm-text-primary)] transition-colors"
              >
                <span>View Partnerships ↗</span>
              </Link>
            )}
            {activeTab === "news" && (
              <Link
                href="/news"
                target="_blank"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--adm-text-primary)] transition-colors"
              >
                <span>View News ↗</span>
              </Link>
            )}
            {activeTab === "careers" && (
              <Link
                href="/careers"
                target="_blank"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--adm-text-primary)] transition-colors"
              >
                <span>View Careers ↗</span>
              </Link>
            )}
            {activeTab === "quiz" && (
              <Link
                href="/quiz"
                target="_blank"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--adm-text-primary)] transition-colors"
              >
                <span>View Quiz ↗</span>
              </Link>
            )}
            {activeTab === "knowledge" && (
              <Link
                href="/faq"
                target="_blank"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--adm-text-primary)] transition-colors"
              >
                <span>View FAQs ↗</span>
              </Link>
            )}
            {activeTab === "bookings" && (
              <Link
                href="/calendar"
                target="_blank"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--adm-text-primary)] transition-colors"
              >
                <span>View Calendar ↗</span>
              </Link>
            )}

            <button
              onClick={handleExportFullJSON}
              title="Export complete CMS backup"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[var(--adm-card-border)] bg-[var(--adm-card)] hover:border-[var(--primary)] hover:text-[var(--primary)] text-xs font-bold text-[var(--adm-text-primary)] transition-all cursor-pointer shadow-2xs active:scale-95 font-[family-name:var(--font-space-grotesk)]"
            >
              <svg className="w-3.5 h-3.5 shrink-0 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleImportJSONClick}
              title="Import CMS backup from file"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[var(--adm-card-border)] bg-[var(--adm-card)] hover:border-[var(--primary)] hover:text-[var(--primary)] text-xs font-bold text-[var(--adm-text-primary)] transition-all cursor-pointer shadow-2xs active:scale-95 font-[family-name:var(--font-space-grotesk)]"
            >
              <svg className="w-3.5 h-3.5 shrink-0 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Import JSON</span>
            </button>
            <button
              onClick={handleResetToFactoryDefaults}
              title="Reset all content to factory seed defaults"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-red-500/25 bg-red-500/10 hover:bg-red-500 hover:text-white text-xs font-bold text-red-600 dark:text-red-400 transition-all cursor-pointer shadow-2xs active:scale-95 font-[family-name:var(--font-space-grotesk)]"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>Factory Reset</span>
            </button>
          </div>
        </header>

        {/* Main Tab Panels */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* ════════════════════════════════════════════════════════════════
              1. OVERVIEW TAB
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <section className="relative overflow-hidden rounded-[26px] bg-[#0d1b3d] px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8 sm:py-9">
                <div className="pointer-events-none absolute -right-12 -top-28 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(225,77,24,0.3),transparent_68%)]" />
                <div className="pointer-events-none absolute bottom-[-150px] right-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(26,86,196,0.3),transparent_68%)]" />
                <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                      Operations overview
                    </div>
                    <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      Good{" "}
                      {new Date().getHours() < 12
                        ? "morning"
                        : new Date().getHours() < 17
                          ? "afternoon"
                          : "evening"}
                      {userEmail ? `, ${userEmail.split("@")[0]}` : ""}.
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                      Your content, inquiries, and consultation activity at a
                      glance. Updates are timestamped so your team knows what is
                      current.
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            bookingRealtimeStatus === "live"
                              ? "animate-pulse bg-emerald-400"
                              : "bg-amber-300"
                          }`}
                        />
                        {bookingRealtimeStatus === "live"
                          ? "Bookings live"
                          : "Bookings refresh every 30 sec"}
                      </span>
                      <span className="text-xs text-slate-400">
                        {lastUpdated
                          ? `Updated ${lastUpdated.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "Waiting for first data refresh"}
                      </span>
                    </div>
                    <p className="mt-3 text-[11px] text-slate-400">
                      CMS content syncs across open tabs; lead submissions are
                      stored in this browser.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleDashboardRefresh}
                      disabled={isRefreshing}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/15 disabled:cursor-wait disabled:opacity-60"
                    >
                      <svg
                        className={isRefreshing ? "animate-spin" : ""}
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M20 7v5h-5M4 17v-5h5" />
                        <path d="M5.6 9a7 7 0 0 1 11.55-2.6L20 12M4 12l2.85 5.6A7 7 0 0 0 18.4 15" />
                      </svg>
                      {isRefreshing ? "Refreshing…" : "Refresh data"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("leads")}
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/20 transition hover:bg-[#c94113]"
                    >
                      Review inquiries <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              </section>

              {bookingLoadError && (
                <div
                  role="alert"
                  className="flex flex-col gap-1 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span>
                    <strong>Bookings could not be refreshed.</strong>{" "}
                    {bookingLoadError}
                  </span>
                  <button
                    type="button"
                    onClick={() => void fetchSupabaseBookings()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-xs transition-all shadow-2xs cursor-pointer active:scale-95 font-[family-name:var(--font-space-grotesk)] shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 7v5h-5M4 17v-5h5" />
                      <path d="M5.6 9a7 7 0 0 1 11.55-2.6L20 12M4 12l2.85 5.6A7 7 0 0 0 18.4 15" />
                    </svg>
                    Retry
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: "Total inquiries",
                    value: leads.length,
                    detail: `${leads.filter((lead) => (lead.status || "new") === "new").length} need review`,
                    color: "#e14d18",
                    icon: "↗",
                  },
                  {
                    label: "Consultations",
                    value: combinedBookings.length,
                    detail: `${dbBookings.length} from connected booking database`,
                    color: "#1a56c4",
                    icon: "◷",
                  },
                  {
                    label: "Published services",
                    value: services.filter(
                      (service) => service.status === "published",
                    ).length,
                    detail: "Visible on the public site",
                    color: "#0f766e",
                    icon: "▤",
                  },
                  {
                    label: "Published content",
                    value:
                      articles.filter(
                        (article) => article.status === "published",
                      ).length +
                      jobs.filter((job) => job.status === "published").length,
                    detail: "News articles and open roles",
                    color: "#7253c7",
                    icon: "✳",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="group rounded-2xl border border-[var(--adm-card-border)] bg-[var(--adm-card)] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-xs font-semibold text-[var(--adm-text-muted)]">
                        {stat.label}
                      </div>
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold"
                        style={{
                          color: stat.color,
                          backgroundColor: `${stat.color}12`,
                        }}
                      >
                        {stat.icon}
                      </span>
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-2">
                      <div className="text-3xl font-bold tracking-tight text-[var(--adm-text-primary)]">
                        {stat.value}
                      </div>
                      <span className="mb-1 h-1.5 w-12 rounded-full bg-[var(--adm-card-subtle)]">
                        <span
                          className="block h-full rounded-full"
                          style={{
                            backgroundColor: stat.color,
                            width: `${Math.min(100, Math.max(18, stat.value * 8))}%`,
                          }}
                        />
                      </span>
                    </div>
                    <div className="mt-1.5 text-xs text-[var(--adm-text-muted)]">
                      {stat.detail}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
                <section className="rounded-2xl border border-[var(--adm-card-border)] bg-[var(--adm-card)] p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--adm-text-primary)]">
                        Inquiry activity
                      </h3>
                      <p className="mt-1 text-xs text-[var(--adm-text-muted)]">
                        New submissions over the last seven days
                      </p>
                    </div>
                    <span className="rounded-lg bg-orange-500/10 px-2.5 py-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 border border-orange-500/20">
                      {leadActivityByDay.reduce(
                        (total, day) => total + day.count,
                        0,
                      )}{" "}
                      last 7 days
                    </span>
                  </div>
                  <div className="mt-7 flex h-44 items-end justify-between gap-3 border-b border-[var(--adm-card-border)] px-1">
                    {leadActivityByDay.map((day) => {
                      const maxCount = Math.max(
                        1,
                        ...leadActivityByDay.map((item) => item.count),
                      );
                      const height = Math.max(8, (day.count / maxCount) * 100);
                      return (
                        <div
                          key={day.label}
                          className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                        >
                          <span className="text-[11px] font-semibold text-[var(--adm-text-muted)]">
                            {day.count || ""}
                          </span>
                          <div className="flex h-[76%] w-full items-end justify-center">
                            <div
                              className={`w-full max-w-10 rounded-t-lg transition-all ${
                                day.count
                                  ? "bg-gradient-to-t from-[#1a56c4] to-[#6d9cf0]"
                                  : "bg-[var(--adm-card-subtle)]"
                              }`}
                              style={{ height: `${height}%` }}
                              title={`${day.count} inquiries`}
                            />
                          </div>
                          <span className="pb-2 text-[11px] font-medium text-[var(--adm-text-muted)]">
                            {day.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-5 pt-3.5 border-t border-[var(--adm-card-border)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--adm-text-muted)]">
                    <span className="flex items-center gap-2 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0"></span>
                      Activity based on browser-stored lead records
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("leads")}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[var(--primary)]/20 active:scale-95 transition-all cursor-pointer font-[family-name:var(--font-space-grotesk)] group"
                    >
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                      </svg>
                      <span>Open CRM</span>
                      <svg
                        className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </section>

                <section className="rounded-2xl border border-[var(--adm-card-border)] bg-[var(--adm-card)] p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--adm-text-primary)]">
                        Workspace health
                      </h3>
                      <p className="mt-1 text-xs text-[var(--adm-text-muted)]">
                        Content and data connections
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        bookingRealtimeStatus === "live"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {bookingRealtimeStatus === "live"
                        ? "Connected"
                        : bookingRealtimeStatus === "polling"
                          ? "Polling"
                          : "Connecting"}
                    </span>
                  </div>
                  <div className="mt-5 space-y-4">
                    {[
                      {
                        label: "Booking database",
                        detail:
                          bookingRealtimeStatus === "live"
                            ? "Realtime subscription active"
                            : "Automatic refresh every 30 seconds",
                        okay: !bookingLoadError,
                      },
                      {
                        label: "Public services",
                        detail: `${services.filter((service) => service.status === "published").length} published`,
                        okay: true,
                      },
                      {
                        label: "News & insights",
                        detail: `${articles.filter((article) => article.status === "published").length} published`,
                        okay: true,
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <span
                          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                            item.okay ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-[var(--adm-text-primary)]">
                            {item.label}
                          </div>
                          <div className="mt-0.5 text-[11px] text-[var(--adm-text-muted)]">
                            {item.detail}
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-[var(--adm-text-muted)]">
                          {item.okay ? "Ready" : "Issue"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 border-t border-[var(--adm-card-border)] pt-4">
                    <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--adm-text-muted)]">
                      Quick access
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Edit services", tab: "services" as AdminTab },
                        { label: "Manage news", tab: "news" as AdminTab },
                        { label: "View bookings", tab: "bookings" as AdminTab },
                        { label: "Update homepage", tab: "hero" as AdminTab },
                      ].map((item) => (
                        <button
                          key={item.tab}
                          type="button"
                          onClick={() => setActiveTab(item.tab)}
                          className="rounded-lg border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] hover:bg-[rgba(225,77,24,0.06)] hover:border-[var(--primary)] hover:text-[var(--primary)] px-3 py-2 text-left text-[11px] font-semibold text-[var(--adm-text-primary)] transition-all cursor-pointer font-[family-name:var(--font-space-grotesk)] shadow-2xs group flex items-center justify-between"
                        >
                          <span>{item.label}</span>
                          <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs opacity-70 group-hover:opacity-100" aria-hidden="true">
                            ↗
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              <section className="rounded-2xl border border-[var(--adm-card-border)] bg-[var(--adm-card)] p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--adm-text-primary)]">
                      Recent inquiries
                    </h3>
                    <p className="mt-1 text-xs text-[var(--adm-text-muted)]">
                      Latest activity from your public-site forms
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("leads")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)] hover:border-[var(--primary)] hover:text-[var(--primary)] px-3.5 py-2 text-xs font-bold text-[var(--adm-text-primary)] transition-all cursor-pointer shadow-2xs group font-[family-name:var(--font-space-grotesk)]"
                  >
                    <span>View all inquiries</span>
                    <svg
                      className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
                {recentLeads.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] px-4 py-10 text-center">
                    <div className="text-sm font-semibold text-[var(--adm-text-primary)]">
                      No inquiries yet
                    </div>
                    <p className="mt-1 text-xs text-[var(--adm-text-muted)]">
                      New public-site form submissions will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left text-xs">
                      <thead className="border-b border-[var(--adm-card-border)] text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--adm-text-muted)]">
                        <tr>
                          <th className="pb-3 pr-4">Inquiry</th>
                          <th className="pb-3 px-4">Channel</th>
                          <th className="pb-3 px-4">Received</th>
                          <th className="pb-3 px-4">Status</th>
                          <th className="pb-3 pl-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {recentLeads.map((lead) => (
                          <tr key={lead.id} className="group">
                            <td className="py-3.5 pr-4">
                              <div className="font-semibold text-[var(--adm-text-primary)]">
                                {lead.name || lead.contactName || "Anonymous"}
                              </div>
                              <div className="mt-0.5 text-[11px] text-[var(--adm-text-muted)]">
                                {lead.company ||
                                  lead.partnerCompany ||
                                  lead.org ||
                                  lead.email ||
                                  lead.contactEmail ||
                                  "General inquiry"}
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-700">
                                {lead.type.replaceAll("_", " ")}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3.5 text-[var(--adm-text-muted)]">
                              {new Date(lead.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                              <span className="ml-1.5 text-[10px]">
                                {new Date(lead.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
                                  (lead.status || "new") === "new"
                                    ? "bg-red-50 text-red-700"
                                    : (lead.status || "new") === "reviewed"
                                      ? "bg-blue-50 text-blue-700"
                                      : (lead.status || "new") === "contacted"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {lead.status || "new"}
                              </span>
                            </td>
                            <td className="py-3.5 pl-4 text-right">
                              <AdminViewButton
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setActiveTab("leads");
                                }}
                                label="Inspect"
                                title="Inspect Transmission Details"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              2. LEADS CRM TAB
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "leads" && (
            <div className="space-y-5 animate-fade-in">
              {/* Controls & Filter Bar */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-4 shadow-xs flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-wrap gap-3 flex-1 min-w-[280px]">
                  {/* Search */}
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search by name, email, company, job..."
                    className="bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl px-3 py-2 text-xs flex-1 min-w-[200px] outline-none focus:bg-[var(--adm-card)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 text-[var(--adm-text-primary)]"
                  />
                  {/* Type Filter */}
                  <select
                    value={leadTypeFilter}
                    onChange={(e) => setLeadTypeFilter(e.target.value)}
                    className="bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl px-3 py-2 text-xs outline-none focus:bg-[var(--adm-card)] focus:border-[var(--primary)] text-[var(--adm-text-primary)] font-medium"
                  >
                    <option value="ALL">All Channels</option>
                    <option value="CONTACT">Contact Desk (CONTACT)</option>
                    <option value="APPLICATION">
                      Job Resumes (APPLICATION)
                    </option>
                    <option value="PARTNER">
                      Subcontractor Teaming (PARTNER)
                    </option>
                    <option value="CONTRACT_REVIEW">
                      Solicitation Teaming (CONTRACT_REVIEW)
                    </option>
                    <option value="QUIZ">SBA Assessment (QUIZ)</option>
                    <option value="BOOKING">
                      Consultation Bookings (BOOKING)
                    </option>
                    <option value="DOWNLOAD">
                      Capability Statement (DOWNLOAD)
                    </option>
                    <option value="RESOURCE_DOWNLOAD">
                      Resources Library (RESOURCE_DOWNLOAD)
                    </option>
                  </select>
                  {/* Status Filter */}
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl px-3 py-2 text-xs outline-none focus:bg-[var(--adm-card)] focus:border-[var(--primary)] text-[var(--adm-text-primary)] font-medium"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="new">New (Unreviewed)</option>
                    <option value="reviewed">In Review</option>
                    <option value="contacted">Contacted / Dispatched</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <button
                  onClick={exportLeadsCSV}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-md shadow-[var(--primary)]/20 active:scale-95 transition-all font-[family-name:var(--font-space-grotesk)]"
                >
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Export to CSV ({filteredLeads.length})</span>
                </button>
              </div>

              {/* Leads Table */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl shadow-xs overflow-hidden">
                {filteredLeads.length === 0 ? (
                  <div className="p-12 text-center text-[var(--adm-text-muted)] text-sm">
                    No leads match your filter criteria.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[var(--adm-text-primary)]">
                      <thead className="bg-[var(--adm-card-subtle)] border-b border-[var(--adm-card-border)] text-[var(--adm-text-muted)] uppercase text-xs font-bold tracking-wider font-[family-name:var(--font-space-grotesk)]">
                        <tr>
                          <th className="py-3 px-4">Date &amp; ID</th>
                          <th className="py-3 px-4">Channel</th>
                          <th className="py-3 px-4">Lead / Candidate</th>
                          <th className="py-3 px-4">Company / Target</th>
                          <th className="py-3 px-4">Contact Coordinate</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {paginatedLeads.map((lead) => (
                          <tr
                            key={lead.id}
                            className="hover:bg-[var(--adm-card-subtle)]/80 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[var(--adm-text-muted)] whitespace-nowrap">
                              {new Date(lead.createdAt).toLocaleDateString()}
                              <div className="text-xs text-[var(--adm-text-muted)] font-medium">
                                {new Date(lead.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)]">
                                {lead.type}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-[var(--adm-text-primary)]">
                                {lead.name || lead.contactName || "Anonymous"}
                              </div>
                              {lead.resumeName && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenResume(lead);
                                  }}
                                  className="text-xs text-[var(--secondary)] hover:text-[var(--primary)] font-semibold mt-0.5 inline-flex items-center gap-1 cursor-pointer transition-colors group text-left"
                                  title="Click to open resume in a new tab"
                                >
                                  <span>📎 {lead.resumeName}</span>
                                  <svg className="w-3 h-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                  </svg>
                                </button>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-[var(--adm-text-muted)] font-semibold">
                              {lead.company ||
                                lead.partnerCompany ||
                                lead.org ||
                                lead.jobTitle ||
                                lead.solicitation ||
                                lead.resourceTitle ||
                                "—"}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="text-[var(--adm-text-primary)] font-semibold">
                                {lead.email || lead.contactEmail || "—"}
                              </div>
                              {lead.phone && (
                                <div className="text-xs text-[var(--adm-text-muted)] font-medium mt-0.5">
                                  {lead.phone}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={lead.status || "new"}
                                onChange={(e) =>
                                  handleRequestChangeStatus(
                                    lead,
                                    e.target.value as any,
                                  )
                                }
                                className={`text-xs font-bold uppercase rounded-lg px-2.5 py-1 outline-none border cursor-pointer font-[family-name:var(--font-space-grotesk)] ${
                                  (lead.status || "new") === "new"
                                    ? "bg-red-50 text-red-600 border-red-200"
                                    : (lead.status || "new") === "reviewed"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : (lead.status || "new") === "contacted"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-gray-50 text-gray-600 border-gray-200"
                                }`}
                              >
                                <option value="new">NEW</option>
                                <option value="reviewed">REVIEWED</option>
                                <option value="contacted">CONTACTED</option>
                                <option value="archived">ARCHIVED</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                              <AdminViewButton
                                onClick={() => setSelectedLead(lead)}
                                label="Inspect"
                                title="Inspect Transmission Details"
                              />
                              <AdminDeleteButton
                                onClick={() => handleRequestDeleteLead(lead)}
                                title="Delete Transmission"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Leads Pagination Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3.5 bg-[var(--adm-card-subtle)] border-t border-[var(--adm-card-border)] text-xs text-[var(--adm-text-muted)] font-[family-name:var(--font-space-grotesk)]">
                      <div className="flex items-center gap-2">
                        <span>
                          Showing{" "}
                          <strong className="text-[var(--adm-text-primary)]">
                            {filteredLeads.length === 0
                              ? 0
                              : (leadCurrentPage - 1) * leadPageSize + 1}
                            –
                            {Math.min(
                              leadCurrentPage * leadPageSize,
                              filteredLeads.length,
                            )}
                          </strong>{" "}
                          of{" "}
                          <strong className="text-[var(--adm-text-primary)]">
                            {filteredLeads.length}
                          </strong>{" "}
                          transmissions
                        </span>
                        <div className="flex items-center gap-1.5 ml-3">
                          <span className="text-[var(--adm-text-muted)]">Per page:</span>
                          <select
                            value={leadPageSize}
                            onChange={(e) => {
                              setLeadPageSize(Number(e.target.value));
                              setLeadCurrentPage(1);
                            }}
                            className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] text-[var(--adm-text-primary)] rounded-lg px-2 py-1 text-xs font-semibold cursor-pointer outline-none focus:border-[var(--primary)]"
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setLeadCurrentPage(1)}
                          disabled={leadCurrentPage === 1}
                          className="px-2.5 py-1 rounded-lg border border-[var(--adm-card-border)] bg-[var(--adm-card)] text-[var(--adm-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--adm-card-subtle)] cursor-pointer transition-colors"
                          title="First page"
                        >
                          «
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeadCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={leadCurrentPage === 1}
                          className="px-2.5 py-1 rounded-lg border border-[var(--adm-card-border)] bg-[var(--adm-card)] text-[var(--adm-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--adm-card-subtle)] cursor-pointer transition-colors"
                          title="Previous page"
                        >
                          ‹ Prev
                        </button>

                        {getPaginationRange(leadCurrentPage, totalLeadPages).map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setLeadCurrentPage(p)}
                            className={`min-w-[28px] px-2 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                              leadCurrentPage === p
                                ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs"
                                : "border-[var(--adm-card-border)] bg-[var(--adm-card)] text-[var(--adm-text-primary)] hover:bg-[var(--adm-card-subtle)]"
                            }`}
                          >
                            {p}
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => setLeadCurrentPage((p) => Math.min(totalLeadPages, p + 1))}
                          disabled={leadCurrentPage >= totalLeadPages}
                          className="px-2.5 py-1 rounded-lg border border-[var(--adm-card-border)] bg-[var(--adm-card)] text-[var(--adm-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--adm-card-subtle)] cursor-pointer transition-colors"
                          title="Next page"
                        >
                          Next ›
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeadCurrentPage(totalLeadPages)}
                          disabled={leadCurrentPage >= totalLeadPages}
                          className="px-2.5 py-1 rounded-lg border border-[var(--adm-card-border)] bg-[var(--adm-card)] text-[var(--adm-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--adm-card-subtle)] cursor-pointer transition-colors"
                          title="Last page"
                        >
                          »
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Lead Detail Modal / Inspector */}
              {selectedLead && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-[var(--adm-card)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-scale-up border border-[var(--adm-card-border)]">
                    <div className="flex justify-between items-start border-b border-[var(--adm-card-border)] pb-4">
                      <div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)] inline-block mb-1">
                          {selectedLead.type} TRANSMISSION
                        </span>
                        <h2 className="text-lg font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
                          {selectedLead.name ||
                            selectedLead.contactName ||
                            "Submission Details"}
                        </h2>
                        <div className="text-xs text-[var(--adm-text-muted)] font-mono">
                          Received:{" "}
                          {new Date(selectedLead.createdAt).toLocaleString()}{" "}
                          &bull; ID: {selectedLead.id}
                        </div>
                      </div>
                      <AdminModalCloseButton
                        onClick={() => setSelectedLead(null)}
                        title="Close details dialog"
                      />
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[var(--adm-card-subtle)] p-4 rounded-xl border border-[var(--adm-card-border)]">
                      <div>
                        <span className="text-[var(--adm-text-muted)] block">
                          Email
                        </span>
                        <a
                          href={`mailto:${selectedLead.email || selectedLead.contactEmail}`}
                          className="font-semibold text-[var(--primary)] hover:underline break-all"
                        >
                          {selectedLead.email ||
                            selectedLead.contactEmail ||
                            "N/A"}
                        </a>
                      </div>
                      <div>
                        <span className="text-[var(--adm-text-muted)] block">
                          Phone
                        </span>
                        <span className="font-semibold text-[var(--adm-text-primary)]">
                          {selectedLead.phone || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--adm-text-muted)] block">
                          Organization
                        </span>
                        <span className="font-semibold text-[var(--adm-text-primary)]">
                          {selectedLead.company ||
                            selectedLead.partnerCompany ||
                            selectedLead.org ||
                            "N/A"}
                        </span>
                      </div>
                      {selectedLead.jobTitle && (
                        <div>
                          <span className="text-[var(--adm-text-muted)] block">
                            Job Role
                          </span>
                          <span className="font-semibold text-[var(--adm-text-primary)]">
                            {selectedLead.jobTitle}
                          </span>
                        </div>
                      )}
                      {selectedLead.solicitation && (
                        <div>
                          <span className="text-[var(--adm-text-muted)] block">
                            Solicitation
                          </span>
                          <span className="font-semibold text-[var(--adm-text-primary)]">
                            {selectedLead.solicitation}
                          </span>
                        </div>
                      )}
                      {selectedLead.uei && (
                        <div>
                          <span className="text-[var(--adm-text-muted)] block">
                            Partner UEI
                          </span>
                          <span className="font-mono font-semibold text-[var(--adm-text-primary)]">
                            {selectedLead.uei}
                          </span>
                        </div>
                      )}
                      {selectedLead.bondingCapacity && (
                        <div>
                          <span className="text-[var(--adm-text-muted)] block">
                            Bonding
                          </span>
                          <span className="font-semibold text-[var(--adm-text-primary)]">
                            {selectedLead.bondingCapacity}
                          </span>
                        </div>
                      )}
                      {selectedLead.consultType && (
                        <div>
                          <span className="text-[var(--adm-text-muted)] block">
                            Consultation Scope
                          </span>
                          <span className="font-semibold text-[var(--adm-text-primary)] uppercase">
                            {selectedLead.consultType}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Booking Quick Launch to Consultation Modal */}
                    {selectedLead.type === "BOOKING" && (
                      <div className="p-4 bg-gradient-to-r from-[rgba(225,77,24,0.08)] to-[rgba(26,86,196,0.08)] border border-[rgba(225,77,24,0.2)] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                            Consultation Booking Record
                          </div>
                          <div className="text-xs text-[var(--adm-text-muted)] mt-0.5">
                            Scheduled: <strong>{selectedLead.date || "Scheduled Slot"}</strong> at <strong>{selectedLead.time || ""}</strong> ({selectedLead.timezone || "EST"})
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const matching = combinedBookings.find((b) => b.id === selectedLead.id) || {
                              id: selectedLead.id,
                              full_name: selectedLead.name || "Client",
                              email: selectedLead.email || "N/A",
                              phone: selectedLead.phone || "N/A",
                              company: selectedLead.company || "N/A",
                              meeting_type: selectedLead.consultType || "Consultation",
                              created_at: selectedLead.createdAt,
                              slot_date: selectedLead.date || "Scheduled",
                              slot_time: selectedLead.time || "",
                              timezone: selectedLead.timezone || "EST",
                              status: selectedLead.status || "confirmed",
                              meeting_url: (selectedLead as any).meeting_url || "",
                              delay_minutes: 0,
                              delay_message: "",
                              notes: selectedLead.notes || selectedLead.message || "",
                              source: "Local Transmission",
                              raw: selectedLead,
                            };
                            setSelectedLead(null);
                            handleSelectBooking(matching);
                          }}
                          className="px-3.5 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white rounded-xl text-xs font-bold font-[family-name:var(--font-space-grotesk)] cursor-pointer shadow-xs inline-flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                        >
                          <span>Open Consultation Desk</span>
                          <span>→</span>
                        </button>
                      </div>
                    )}

                    {/* Specific details */}
                    {/* Structured Employment Application Dossier */}
                    {(selectedLead.type === "APPLICATION" || selectedLead.applicationDetails) && (
                      <div className="space-y-4 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-2xl p-4 sm:p-5">
                        <div className="flex items-center justify-between border-b border-[var(--adm-card-border)] pb-3">
                          <h4 className="text-xs font-bold text-[var(--adm-text-primary)] uppercase tracking-wider font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                            Formal Candidate Application Dossier
                          </h4>
                          <span className="text-[0.7rem] font-semibold text-[var(--primary)] bg-[rgba(225,77,24,0.08)] px-2.5 py-0.5 rounded-full border border-[rgba(225,77,24,0.2)]">
                            {selectedLead.jobTitle || "Cadre Applicant"}
                          </span>
                        </div>

                        {/* Screening & Compliance Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3 bg-[var(--adm-card)] rounded-xl border border-[var(--adm-card-border)]">
                            <span className="text-[0.68rem] text-[var(--adm-text-muted)] uppercase tracking-wider block font-semibold mb-1">
                              Work Authorization
                            </span>
                            <span className="text-xs font-bold text-[var(--adm-text-primary)]">
                              {selectedLead.workAuthorization || selectedLead.applicationDetails?.workAuthorization || "Declared"}
                            </span>
                          </div>

                          <div className="p-3 bg-[var(--adm-card)] rounded-xl border border-[var(--adm-card-border)]">
                            <span className="text-[0.68rem] text-[var(--adm-text-muted)] uppercase tracking-wider block font-semibold mb-1">
                              Security Clearance
                            </span>
                            <span className="text-xs font-bold text-[var(--secondary)]">
                              {selectedLead.securityClearance || selectedLead.applicationDetails?.securityClearance || "None"}
                            </span>
                          </div>

                          <div className="p-3 bg-[var(--adm-card)] rounded-xl border border-[var(--adm-card-border)]">
                            <span className="text-[0.68rem] text-[var(--adm-text-muted)] uppercase tracking-wider block font-semibold mb-1">
                              Travel / Deployment
                            </span>
                            <span className="text-xs font-bold text-[var(--adm-text-primary)]">
                              {selectedLead.willingToTravel || selectedLead.applicationDetails?.willingToTravel || "Flexible"}
                            </span>
                          </div>
                        </div>

                        {/* Experience & Education Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-[var(--adm-text-muted)] block text-[0.7rem]">
                              Experience Level
                            </span>
                            <span className="font-semibold text-[var(--adm-text-primary)]">
                              {selectedLead.yearsExperience || selectedLead.applicationDetails?.yearsExperience || "N/A"}
                            </span>
                          </div>

                          <div>
                            <span className="text-[var(--adm-text-muted)] block text-[0.7rem]">
                              Education Completed
                            </span>
                            <span className="font-semibold text-[var(--adm-text-primary)]">
                              {selectedLead.educationLevel || selectedLead.applicationDetails?.educationLevel || "N/A"}
                            </span>
                          </div>

                          <div>
                            <span className="text-[var(--adm-text-muted)] block text-[0.7rem]">
                              Earliest Available Date
                            </span>
                            <span className="font-semibold text-[var(--adm-text-primary)]">
                              {selectedLead.earliestStartDate || selectedLead.applicationDetails?.earliestStartDate || "Immediate"}
                            </span>
                          </div>

                          <div>
                            <span className="text-[var(--adm-text-muted)] block text-[0.7rem]">
                              Desired Compensation
                            </span>
                            <span className="font-semibold text-[var(--primary)]">
                              {selectedLead.desiredCompensation || selectedLead.applicationDetails?.desiredCompensation || "Standard Rate"}
                            </span>
                          </div>
                        </div>

                        {/* Location & LinkedIn */}
                        <div className="flex flex-wrap gap-4 text-xs pt-1 border-t border-[var(--adm-card-border)]">
                          {(selectedLead.cityStateZip || selectedLead.applicationDetails?.cityStateZip) && (
                            <div>
                              <span className="text-[var(--adm-text-muted)] mr-1.5">Candidate Location:</span>
                              <strong className="text-[var(--adm-text-primary)]">
                                {selectedLead.cityStateZip || selectedLead.applicationDetails?.cityStateZip}
                              </strong>
                            </div>
                          )}
                          {(selectedLead.linkedinUrl || selectedLead.applicationDetails?.linkedinUrl) && (
                            <div>
                              <span className="text-[var(--adm-text-muted)] mr-1.5">LinkedIn / Portfolio:</span>
                              <a
                                href={selectedLead.linkedinUrl || selectedLead.applicationDetails?.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--secondary)] font-semibold hover:underline"
                              >
                                View Profile ↗
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Certifications Pills */}
                        {((selectedLead.certifications && selectedLead.certifications.length > 0) ||
                          (selectedLead.applicationDetails?.certifications && selectedLead.applicationDetails.certifications.length > 0)) && (
                          <div className="pt-2">
                            <span className="text-[0.68rem] text-[var(--adm-text-muted)] uppercase tracking-wider block font-semibold mb-1.5">
                              Verified Industry Certifications &amp; Credentials:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {(selectedLead.certifications || selectedLead.applicationDetails?.certifications || []).map(
                                (c, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md text-[0.72rem] font-semibold"
                                  >
                                    ✓ {c}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Statement of Interest */}
                        {(selectedLead.cover || selectedLead.applicationDetails?.statementOfInterest) && (
                          <div className="pt-2">
                            <span className="text-[0.68rem] text-[var(--adm-text-muted)] uppercase tracking-wider block font-semibold mb-1">
                              Candidate Statement of Interest &amp; Qualifications:
                            </span>
                            <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-xl p-3 text-xs text-[var(--adm-text-primary)] whitespace-pre-line leading-relaxed">
                              {selectedLead.applicationDetails?.statementOfInterest || selectedLead.cover}
                            </div>
                          </div>
                        )}

                        {/* Legal Attestation */}
                        <div className="p-2.5 bg-[var(--adm-card)] rounded-xl border border-[var(--adm-card-border)] flex flex-wrap items-center justify-between gap-2 text-[0.72rem]">
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            E-Verify &amp; Truth in Application Attestation Confirmed
                          </span>
                          {(selectedLead.digitalSignature || selectedLead.applicationDetails?.digitalSignature) && (
                            <span className="text-[var(--adm-text-muted)]">
                              Digital Signature: <strong className="text-[var(--adm-text-primary)] font-mono">{selectedLead.digitalSignature || selectedLead.applicationDetails?.digitalSignature}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedLead.cover && selectedLead.type !== "APPLICATION" && (
                      <div>
                        <h4 className="text-xs font-bold text-[var(--adm-text-primary)] uppercase tracking-wider mb-1.5 font-[family-name:var(--font-space-grotesk)]">
                          Cover Statement / Background
                        </h4>
                        <div className="bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl p-3 text-xs text-[var(--adm-text-primary)] whitespace-pre-line leading-relaxed">
                          {selectedLead.cover}
                        </div>
                      </div>
                    )}

                    {selectedLead.message && (
                      <div>
                        <h4 className="text-xs font-bold text-[var(--adm-text-primary)] uppercase tracking-wider mb-1.5 font-[family-name:var(--font-space-grotesk)]">
                          Inquiry Message
                        </h4>
                        <div className="bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl p-3 text-xs text-[var(--adm-text-primary)] whitespace-pre-line leading-relaxed">
                          {selectedLead.message}
                        </div>
                      </div>
                    )}

                    {selectedLead.reviewNotes && (
                      <div>
                        <h4 className="text-xs font-bold text-[var(--adm-text-primary)] uppercase tracking-wider mb-1.5 font-[family-name:var(--font-space-grotesk)]">
                          Teaming &amp; Capability Notes
                        </h4>
                        <div className="bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl p-3 text-xs text-[var(--adm-text-primary)] whitespace-pre-line leading-relaxed">
                          {selectedLead.reviewNotes}
                        </div>
                      </div>
                    )}

                    {selectedLead.recommendations && (
                      <div>
                        <h4 className="text-xs font-bold text-[var(--adm-text-primary)] uppercase tracking-wider mb-1.5 font-[family-name:var(--font-space-grotesk)]">
                          SBA Certification Eligibility Results
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedLead.recommendations.map((rec, rIdx) => (
                            <span
                              key={rIdx}
                              className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold"
                            >
                              ✓ {rec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resume Open & Download Actions */}
                    {(selectedLead.resumeName ||
                      selectedLead.type === "APPLICATION") && (
                      <div className="p-3.5 bg-[rgba(26,86,196,0.06)] border border-[rgba(26,86,196,0.2)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs text-[var(--adm-text-primary)] font-medium flex items-center gap-1.5 flex-wrap">
                          <span>Candidate Resume:</span>
                          <button
                            type="button"
                            onClick={() => handleOpenResume(selectedLead)}
                            className="font-bold text-[var(--secondary)] hover:text-[var(--primary)] hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                            title="Click to open resume in a new tab"
                          >
                            <span>{selectedLead.resumeName || "Uploaded Document"}</span>
                            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenResume(selectedLead)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)] hover:opacity-90 text-white rounded-lg text-xs font-semibold cursor-pointer font-[family-name:var(--font-space-grotesk)] shadow-xs transition-all active:scale-95"
                            title="Open resume in a new browser tab"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            <span>Open Resume</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadResume(selectedLead)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--secondary)] hover:opacity-90 text-white rounded-lg text-xs font-semibold cursor-pointer font-[family-name:var(--font-space-grotesk)] shadow-xs transition-all active:scale-95"
                            title="Download resume file"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Admin Notes Field with Explicit Save */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-bold text-[var(--adm-text-primary)] uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
                          Internal Admin Notes &amp; Follow-up Log
                        </h4>
                        <button
                          type="button"
                          onClick={handleSaveNotesExplicit}
                          disabled={
                            isSavingNotes ||
                            editedLeadNotes === (selectedLead.adminNotes || "")
                          }
                          className="px-3 py-1 bg-[var(--primary)] hover:opacity-95 text-white rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95 inline-flex items-center gap-1.5 font-[family-name:var(--font-space-grotesk)] shadow-xs"
                          title="Save internal notes to database"
                        >
                          {isSavingNotes ? (
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></span>
                          ) : (
                            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                              <polyline points="17 21 17 13 7 13 7 21" />
                              <polyline points="7 3 7 8 15 8" />
                            </svg>
                          )}
                          <span>{isSavingNotes ? "Saving..." : "Save Notes"}</span>
                        </button>
                      </div>
                      <textarea
                        value={editedLeadNotes}
                        onChange={(e) => setEditedLeadNotes(e.target.value)}
                        placeholder="Add internal notes, phone call logs, or assigned team members..."
                        className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl p-3 text-xs outline-none focus:bg-[var(--adm-card)] focus:border-[var(--primary)] min-h-[85px] text-[var(--adm-text-primary)]"
                      ></textarea>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--adm-card-border)] font-[family-name:var(--font-space-grotesk)]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--adm-text-muted)] font-medium">
                          Status:
                        </span>
                        <select
                          value={selectedLead.status || "new"}
                          onChange={(e) =>
                            handleRequestChangeStatus(
                              selectedLead,
                              e.target.value as any,
                            )
                          }
                          className="text-xs font-bold rounded-lg border border-[var(--adm-card-border)] px-2.5 py-1 text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] cursor-pointer"
                        >
                          <option value="new">NEW</option>
                          <option value="reviewed">REVIEWED</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="archived">ARCHIVED</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRequestDeleteLead(selectedLead)}
                          className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 shadow-2xs"
                          title="Permanently delete this transmission record"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          <span>Delete Record</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedLead(null)}
                          className="px-4 py-2 bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)] border border-[var(--adm-card-border)] hover:border-[var(--primary)] text-[var(--adm-text-primary)] rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
                        >
                          Close Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── LEAD DELETE CONFIRMATION MODAL ── */}
              {leadToDelete && (
                <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
                  <div className="bg-[var(--adm-card)] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[var(--adm-card-border)] space-y-4 animate-scale-up">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
                          Confirm Lead Deletion
                        </h3>
                        <p className="text-xs text-[var(--adm-text-muted)] mt-1 leading-relaxed">
                          Are you sure you want to permanently delete this transmission record? This action will remove the record from Supabase and cannot be undone.
                        </p>
                      </div>
                    </div>

                    {/* Target Lead Information Box */}
                    <div className="p-3.5 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--adm-text-primary)]">
                          {leadToDelete.name || leadToDelete.contactName || "Anonymous Submitter"}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)]">
                          {leadToDelete.type}
                        </span>
                      </div>
                      <div className="text-[var(--adm-text-muted)] truncate font-medium">
                        {leadToDelete.email || leadToDelete.contactEmail || "No email provided"}
                      </div>
                      <div className="text-[10px] text-[var(--adm-text-muted)] font-mono">
                        ID: {leadToDelete.id} &bull; Received: {new Date(leadToDelete.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--adm-card-border)] font-[family-name:var(--font-space-grotesk)]">
                      <button
                        type="button"
                        onClick={() => setLeadToDelete(null)}
                        disabled={isDeletingLead}
                        className="px-4 py-2 bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)] border border-[var(--adm-card-border)] text-[var(--adm-text-primary)] rounded-xl text-xs font-semibold cursor-pointer transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmDeleteLead}
                        disabled={isDeletingLead}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-600/20 active:scale-95 disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        {isDeletingLead ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></span>
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <>
                            <span>Permanently Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── LEAD STATUS CHANGE CONFIRMATION MODAL ── */}
              {leadToModifyStatus && (
                <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
                  <div className="bg-[var(--adm-card)] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[var(--adm-card-border)] space-y-4 animate-scale-up">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[rgba(26,86,196,0.12)] border border-[rgba(26,86,196,0.3)] text-[var(--secondary)] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
                          Confirm Status Modification
                        </h3>
                        <p className="text-xs text-[var(--adm-text-muted)] mt-1 leading-relaxed">
                          Update the operational review status for this transmission.
                        </p>
                      </div>
                    </div>

                    {/* Target Status Diff Box */}
                    <div className="p-3.5 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl text-xs space-y-2">
                      <div className="font-bold text-[var(--adm-text-primary)]">
                        {leadToModifyStatus.lead.name || leadToModifyStatus.lead.contactName || "Client"}
                      </div>
                      <div className="flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-500/10 text-[var(--adm-text-muted)] border border-slate-500/20">
                          {leadToModifyStatus.lead.status?.toUpperCase() || "NEW"}
                        </span>
                        <span className="text-sm font-bold text-[var(--primary)]">&rarr;</span>
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                            leadToModifyStatus.newStatus === "new"
                              ? "bg-red-50 text-red-600 border-red-200"
                              : leadToModifyStatus.newStatus === "reviewed"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : leadToModifyStatus.newStatus === "contacted"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {leadToModifyStatus.newStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--adm-card-border)] font-[family-name:var(--font-space-grotesk)]">
                      <button
                        type="button"
                        onClick={() => setLeadToModifyStatus(null)}
                        disabled={isModifyingStatus}
                        className="px-4 py-2 bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)] border border-[var(--adm-card-border)] text-[var(--adm-text-primary)] rounded-xl text-xs font-semibold cursor-pointer transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmStatusChange}
                        disabled={isModifyingStatus}
                        className="px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-[var(--primary)]/20 active:scale-95 disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        {isModifyingStatus ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></span>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm Status</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              3. BOOKINGS TAB
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "bookings" && (
            <div className="space-y-6 animate-fade-in">
              {/* Calendar Diagnostics Banner */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
                    External Calendar Synchronization
                  </h3>
                  <p className="text-xs text-[var(--adm-text-muted)] mt-1 max-w-xl">
                    Sync consultation availability with Google Calendar and
                    Microsoft Graph Outlook APIs. Busy windows are subtracted
                    from available slots in real time.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
                  <button
                    onClick={handleInspectSlots}
                    disabled={isLoadingSlots}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)] hover:border-[var(--primary)] hover:text-[var(--primary)] border border-[var(--adm-card-border)] text-[var(--adm-text-primary)] font-semibold rounded-xl text-xs transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group font-[family-name:var(--font-space-grotesk)]"
                  >
                    {isLoadingSlots ? (
                      <span className="w-3.5 h-3.5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin shrink-0"></span>
                    ) : (
                      <svg
                        className="w-3.5 h-3.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    )}
                    <span>{isLoadingSlots ? "Querying Slots..." : "Inspect Live Slots"}</span>
                  </button>
                  <button
                    onClick={handleTriggerCalendarSync}
                    disabled={isSyncingCalendar}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white font-semibold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-[var(--primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 font-[family-name:var(--font-space-grotesk)]"
                  >
                    {isSyncingCalendar ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></span>
                    ) : (
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                      </svg>
                    )}
                    <span>{isSyncingCalendar ? "Syncing..." : "Sync Calendars Real-Time"}</span>
                  </button>
                </div>
              </div>

              {syncResult && (
                <div className="p-4 bg-[rgba(26,86,196,0.06)] border border-[rgba(26,86,196,0.2)] text-[var(--adm-text-primary)] rounded-2xl text-xs font-mono">
                  {syncResult}
                </div>
              )}

              {activeSlotsCount !== null && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs">
                  ✓ Active consultation slots available for booking:{" "}
                  <strong>{activeSlotsCount} slots</strong>.
                </div>
              )}

              {/* Live Slots Schedule Grid (Click ANY slot to open modal) */}
              {liveSlotsList.length > 0 && (
                <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl shadow-xs p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Live Consultation Slots Inventory ({liveSlotsList.length} slots)
                      </h3>
                      <p className="text-xs text-[var(--adm-text-muted)] mt-0.5">
                        Click on <strong>any booking slot</strong> to view full details, reserve, or join the meeting room.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSlotsGrid((prev) => !prev)}
                      className="px-3 py-1.5 bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)] border border-[var(--adm-card-border)] text-[var(--adm-text-primary)] text-xs font-semibold rounded-xl transition-all cursor-pointer font-[family-name:var(--font-space-grotesk)]"
                    >
                      {showSlotsGrid ? "Hide Slots Grid" : "Show Slots Grid"}
                    </button>
                  </div>

                  {showSlotsGrid && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2">
                      {liveSlotsList.map((slot) => {
                        const start = new Date(slot.start_time);
                        const end = new Date(slot.end_time);
                        const isAvailable = slot.is_available;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => handleSelectSlot(slot)}
                            className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all active:scale-95 group font-[family-name:var(--font-space-grotesk)] ${
                              isAvailable
                                ? "bg-[var(--adm-card)] hover:bg-[var(--adm-card-subtle)] border-emerald-500/30 hover:border-emerald-500 shadow-2xs"
                                : "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/30 hover:border-amber-500 shadow-2xs"
                            }`}
                            title={`Click slot to open details: ${start.toLocaleString()}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[0.68rem] font-bold uppercase text-[var(--adm-text-muted)]">
                                {start.toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                              <span
                                className={`text-[0.65rem] font-bold px-1.5 py-0.2 rounded-full ${
                                  isAvailable
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                }`}
                              >
                                {isAvailable ? "OPEN" : "BOOKED"}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-[var(--adm-text-primary)] group-hover:text-[var(--primary)] transition-colors">
                              {start.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className="text-[0.65rem] text-[var(--adm-text-muted)] mt-0.5 font-mono">
                              {slot.timezone || "EST"} &bull; {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Booked Consultations List */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl shadow-xs overflow-hidden">
                <div className="p-6 pb-4">
                  <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                    Scheduled Consultations ({combinedBookings.length})
                  </h3>
                  <p className="text-xs text-[var(--adm-text-muted)] mt-1">
                    Click any slot card or details button to confirm, join video meeting, or send a delay notice to the client.
                  </p>
                </div>

                {combinedBookings.length === 0 ? (
                  <div className="py-12 text-center text-[var(--adm-text-muted)] text-xs">
                    No consultations scheduled yet. Book a session on the
                    `/calendar` portal to see live records here.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[var(--adm-text-primary)]">
                      <thead className="bg-[var(--adm-card-subtle)] border-b border-[var(--adm-card-border)] text-[var(--adm-text-muted)] uppercase text-xs font-bold tracking-wider font-[family-name:var(--font-space-grotesk)]">
                        <tr>
                          <th className="py-3 px-4">Client Name</th>
                          <th className="py-3 px-4">Organization</th>
                          <th className="py-3 px-4">Scope</th>
                          <th className="py-3 px-4">Scheduled Slot (Clickable)</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {paginatedBookings.map((b, idx) => (
                          <tr
                            key={b.id || idx}
                            className="hover:bg-[var(--adm-card-subtle)]/80 transition-colors"
                          >
                            <td className="py-3 px-4 font-bold text-[var(--adm-text-primary)]">
                              <div>{b.full_name}</div>
                              <div className="text-xs text-[var(--adm-text-muted)] font-medium">
                                {b.email}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-[var(--adm-text-muted)] font-semibold">
                              {b.company}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)]">
                                {b.meeting_type}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => handleSelectBooking(b)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)] hover:border-[var(--primary)] border border-[var(--adm-card-border)] rounded-xl text-left cursor-pointer transition-all group font-[family-name:var(--font-space-grotesk)] shadow-2xs"
                                title="Click to open consultation details modal"
                              >
                                <span className="text-sm">📅</span>
                                <div>
                                  <div className="font-bold text-[var(--adm-text-primary)] text-xs group-hover:text-[var(--primary)] transition-colors">
                                    {b.slot_date} &bull; {b.slot_time}
                                  </div>
                                  <div className="text-[0.68rem] text-[var(--adm-text-muted)] font-mono">
                                    {b.timezone} &bull; Open Details →
                                  </div>
                                </div>
                              </button>
                            </td>
                            <td className="py-3 px-4">
                              {b.delay_minutes > 0 ? (
                                <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-flex items-center gap-1 font-[family-name:var(--font-space-grotesk)]">
                                  <span>⏳</span>
                                  <span>DELAYED (+{b.delay_minutes}m)</span>
                                </span>
                              ) : b.status === "confirmed" ? (
                                <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-[family-name:var(--font-space-grotesk)]">
                                  ✓ CONFIRMED
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-bold uppercase bg-[rgba(26,86,196,0.08)] text-[var(--secondary)] border border-[rgba(26,86,196,0.2)] font-[family-name:var(--font-space-grotesk)]">
                                  ● PENDING
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap font-[family-name:var(--font-space-grotesk)]">
                              <button
                                type="button"
                                onClick={() => handleJoinMeeting(b)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs active:scale-95"
                                title="Join Video Consultation Meeting"
                              >
                                <span>📹</span>
                                <span>Join</span>
                              </button>

                              {b.status !== "confirmed" && (
                                <button
                                  type="button"
                                  onClick={() => handleConfirmBooking(b)}
                                  disabled={isUpdatingBooking}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs active:scale-95 disabled:opacity-50"
                                  title="Confirm Consultation"
                                >
                                  <span>✓</span>
                                  <span>Confirm</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedBooking(b);
                                  setIsDelayModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)] hover:border-amber-500 text-amber-600 dark:text-amber-400 border border-[var(--adm-card-border)] rounded-lg text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-2xs"
                                title="Send Delay Notice to Client"
                              >
                                <span>⏳</span>
                                <span>Delay</span>
                              </button>

                              <AdminViewButton
                                onClick={() => handleSelectBooking(b)}
                                label="Details"
                                title="Inspect Consultation Dossier"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Bookings Pagination Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3.5 bg-[var(--adm-card-subtle)] border-t border-[var(--adm-card-border)] text-xs text-[var(--adm-text-muted)] font-[family-name:var(--font-space-grotesk)]">
                      <div className="flex items-center gap-2">
                        <span>
                          Showing{" "}
                          <strong className="text-[var(--adm-text-primary)]">
                            {combinedBookings.length === 0
                              ? 0
                              : (bookingCurrentPage - 1) * bookingPageSize + 1}
                            –
                            {Math.min(
                              bookingCurrentPage * bookingPageSize,
                              combinedBookings.length,
                            )}
                          </strong>{" "}
                          of{" "}
                          <strong className="text-[var(--adm-text-primary)]">
                            {combinedBookings.length}
                          </strong>{" "}
                          consultations
                        </span>
                        <div className="flex items-center gap-1.5 ml-3">
                          <span className="text-[var(--adm-text-muted)]">Per page:</span>
                          <select
                            value={bookingPageSize}
                            onChange={(e) => {
                              setBookingPageSize(Number(e.target.value));
                              setBookingCurrentPage(1);
                            }}
                            className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] text-[var(--adm-text-primary)] rounded-lg px-2 py-1 text-xs font-semibold cursor-pointer outline-none focus:border-[var(--primary)]"
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setBookingCurrentPage(1)}
                          disabled={bookingCurrentPage === 1}
                          className="px-2.5 py-1 rounded-lg border border-[var(--adm-card-border)] bg-[var(--adm-card)] text-[var(--adm-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--adm-card-subtle)] cursor-pointer transition-colors"
                          title="First page"
                        >
                          «
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={bookingCurrentPage === 1}
                          className="px-2.5 py-1 rounded-lg border border-[var(--adm-card-border)] bg-[var(--adm-card)] text-[var(--adm-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--adm-card-subtle)] cursor-pointer transition-colors"
                          title="Previous page"
                        >
                          ‹ Prev
                        </button>

                        {getPaginationRange(bookingCurrentPage, totalBookingPages).map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setBookingCurrentPage(p)}
                            className={`min-w-[28px] px-2 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                              bookingCurrentPage === p
                                ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs"
                                : "border-[var(--adm-card-border)] bg-[var(--adm-card)] text-[var(--adm-text-primary)] hover:bg-[var(--adm-card-subtle)]"
                            }`}
                          >
                            {p}
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => setBookingCurrentPage((p) => Math.min(totalBookingPages, p + 1))}
                          disabled={bookingCurrentPage >= totalBookingPages}
                          className="px-2.5 py-1 rounded-lg border border-[var(--adm-card-border)] bg-[var(--adm-card)] text-[var(--adm-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--adm-card-subtle)] cursor-pointer transition-colors"
                          title="Next page"
                        >
                          Next ›
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingCurrentPage(totalBookingPages)}
                          disabled={bookingCurrentPage >= totalBookingPages}
                          className="px-2.5 py-1 rounded-lg border border-[var(--adm-card-border)] bg-[var(--adm-card)] text-[var(--adm-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--adm-card-subtle)] cursor-pointer transition-colors"
                          title="Last page"
                        >
                          »
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Consultation Dossier Modal */}
              {selectedBooking && !isDelayModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-[var(--adm-card)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-scale-up border border-[var(--adm-card-border)]">
                    <div className="flex justify-between items-start border-b border-[var(--adm-card-border)] pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)] font-[family-name:var(--font-space-grotesk)]">
                            {selectedBooking.meeting_type}
                          </span>
                          {selectedBooking.delay_minutes > 0 ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-[family-name:var(--font-space-grotesk)]">
                              DELAYED (+{selectedBooking.delay_minutes}m)
                            </span>
                          ) : selectedBooking.status === "confirmed" ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-[family-name:var(--font-space-grotesk)]">
                              CONFIRMED
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold uppercase bg-[rgba(26,86,196,0.08)] text-[var(--secondary)] border border-[rgba(26,86,196,0.2)] font-[family-name:var(--font-space-grotesk)]">
                              PENDING CONFIRMATION
                            </span>
                          )}
                        </div>
                        <h2 className="text-lg font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
                          {selectedBooking.full_name}
                        </h2>
                        <div className="text-xs text-[var(--adm-text-muted)] font-mono">
                          ID: {selectedBooking.id} &bull; Source: {selectedBooking.source}
                        </div>
                      </div>
                      <AdminModalCloseButton
                        onClick={() => setSelectedBooking(null)}
                        title="Close consultation dialog"
                      />
                    </div>

                    {/* Join Meeting Action Box */}
                    <div className="p-4 bg-gradient-to-r from-[rgba(225,77,24,0.08)] to-[rgba(26,86,196,0.08)] border border-[rgba(225,77,24,0.2)] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                          Executive Consultation Video Bridge
                        </div>
                        <div className="text-xs text-[var(--adm-text-muted)] mt-0.5 font-mono">
                          Slot: {selectedBooking.slot_date} &bull; {selectedBooking.slot_time} ({selectedBooking.timezone})
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleJoinMeeting(selectedBooking)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-[var(--primary)]/20 active:scale-95 font-[family-name:var(--font-space-grotesk)] shrink-0"
                      >
                        <span className="text-base">📹</span>
                        <span>Join Meeting Now</span>
                      </button>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[var(--adm-card-subtle)] p-4 rounded-xl border border-[var(--adm-card-border)]">
                      <div>
                        <span className="text-[var(--adm-text-muted)] block">Email</span>
                        <a
                          href={`mailto:${selectedBooking.email}`}
                          className="font-semibold text-[var(--primary)] hover:underline break-all"
                        >
                          {selectedBooking.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-[var(--adm-text-muted)] block">Phone</span>
                        <a
                          href={`tel:${selectedBooking.phone}`}
                          className="font-semibold text-[var(--adm-text-primary)] hover:underline"
                        >
                          {selectedBooking.phone || "N/A"}
                        </a>
                      </div>
                      <div>
                        <span className="text-[var(--adm-text-muted)] block">Company</span>
                        <span className="font-semibold text-[var(--adm-text-primary)]">
                          {selectedBooking.company || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--adm-text-muted)] block">Scheduled Date</span>
                        <span className="font-semibold text-[var(--adm-text-primary)]">
                          {selectedBooking.slot_date}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--adm-text-muted)] block">Scheduled Time</span>
                        <span className="font-semibold text-[var(--adm-text-primary)]">
                          {selectedBooking.slot_time} ({selectedBooking.timezone})
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--adm-text-muted)] block">Created At</span>
                        <span className="font-semibold text-[var(--adm-text-primary)] font-mono text-[0.7rem]">
                          {selectedBooking.created_at ? new Date(selectedBooking.created_at).toLocaleString() : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Meeting Link Configurator */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[var(--adm-text-primary)] uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
                        Meeting URL / Video Room Bridge
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customMeetingUrl}
                          onChange={(e) => setCustomMeetingUrl(e.target.value)}
                          placeholder={`https://meet.google.com/lookup/tig-${selectedBooking.id ? selectedBooking.id.slice(0, 8) : "consultation"}`}
                          className="flex-1 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl px-3.5 py-2 text-xs font-mono text-[var(--adm-text-primary)] outline-none focus:bg-[var(--adm-card)] focus:border-[var(--primary)]"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveMeetingUrl(selectedBooking.id, customMeetingUrl)}
                          disabled={isUpdatingBooking}
                          className="px-4 py-2 bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)] border border-[var(--adm-card-border)] hover:border-[var(--primary)] text-[var(--adm-text-primary)] rounded-xl text-xs font-semibold transition-all cursor-pointer font-[family-name:var(--font-space-grotesk)] shrink-0 disabled:opacity-50"
                        >
                          Save Link
                        </button>
                      </div>
                    </div>

                    {/* Preliminary Notes */}
                    {selectedBooking.notes && (
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-[var(--adm-text-primary)] uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
                          Client Preliminary Notes &amp; Scope Requirements
                        </h4>
                        <div className="bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl p-3.5 text-xs text-[var(--adm-text-primary)] whitespace-pre-line leading-relaxed">
                          {selectedBooking.notes}
                        </div>
                      </div>
                    )}

                    {/* Delay Notice Banner if delayed */}
                    {selectedBooking.delay_minutes > 0 && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-700 dark:text-amber-300 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 font-[family-name:var(--font-space-grotesk)]">
                          <span>⏳ Delay Notice Active: +{selectedBooking.delay_minutes} Minutes</span>
                        </div>
                        {selectedBooking.delay_message && (
                          <div className="italic text-[0.72rem] text-amber-800 dark:text-amber-200">
                            &ldquo;{selectedBooking.delay_message}&rdquo;
                          </div>
                        )}
                      </div>
                    )}

                    {/* Dialog Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--adm-card-border)] font-[family-name:var(--font-space-grotesk)]">
                      <div className="flex items-center gap-2">
                        {selectedBooking.status !== "confirmed" && (
                          <button
                            type="button"
                            onClick={() => handleConfirmBooking(selectedBooking)}
                            disabled={isUpdatingBooking}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50 inline-flex items-center gap-1.5"
                          >
                            <span>✓</span>
                            <span>Confirm Consultation</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsDelayModalOpen(true)}
                          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 inline-flex items-center gap-1.5"
                        >
                          <span>⏳</span>
                          <span>Send Delay Notice</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteBooking(selectedBooking.id)}
                          disabled={isUpdatingBooking}
                          className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                        >
                          Cancel Booking
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(null)}
                          className="px-4 py-2 bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)] border border-[var(--adm-card-border)] hover:border-[var(--primary)] text-[var(--adm-text-primary)] rounded-xl text-xs font-semibold transition-all cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delay Notice Dispatch Modal */}
              {isDelayModalOpen && selectedBooking && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-[var(--adm-card)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up border border-[var(--adm-card-border)]">
                    <div className="flex justify-between items-start border-b border-[var(--adm-card-border)] pb-3">
                      <div>
                        <span className="text-[0.7rem] font-bold uppercase tracking-wider text-amber-500 font-[family-name:var(--font-space-grotesk)] block mb-0.5">
                          Consultation Scheduling Notice
                        </span>
                        <h3 className="text-base font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
                          Notify Client of Delay
                        </h3>
                      </div>
                      <AdminModalCloseButton
                        onClick={() => setIsDelayModalOpen(false)}
                        title="Close delay dialog"
                      />
                    </div>

                    <div className="p-3.5 bg-[var(--adm-card-subtle)] rounded-xl border border-[var(--adm-card-border)] text-xs text-[var(--adm-text-primary)]">
                      <div>Client: <strong>{selectedBooking.full_name}</strong> ({selectedBooking.email})</div>
                      <div className="text-[var(--adm-text-muted)] mt-0.5 font-mono">
                        Scheduled: {selectedBooking.slot_date} &bull; {selectedBooking.slot_time} ({selectedBooking.timezone})
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[var(--adm-text-primary)] uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
                        Delay Interval Preset
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[5, 10, 15, 30].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setDelayMinutes(mins)}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all font-[family-name:var(--font-space-grotesk)] ${
                              delayMinutes === mins
                                ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                                : "bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)] text-[var(--adm-text-primary)] border-[var(--adm-card-border)]"
                            }`}
                          >
                            +{mins} min
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[var(--adm-text-primary)] uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
                        Reason / Note for Client (Optional)
                      </label>
                      <textarea
                        value={delayReason}
                        onChange={(e) => setDelayReason(e.target.value)}
                        placeholder="e.g. Concluding a government briefing, wrapping up previous defense advisory session..."
                        className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl p-3 text-xs outline-none focus:bg-[var(--adm-card)] focus:border-[var(--primary)] min-h-[70px]"
                      ></textarea>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-[var(--adm-card-border)] font-[family-name:var(--font-space-grotesk)]">
                      <button
                        type="button"
                        onClick={() => setIsDelayModalOpen(false)}
                        className="w-full sm:w-auto px-4 py-2 bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)] border border-[var(--adm-card-border)] text-[var(--adm-text-primary)] rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyDelay(selectedBooking, delayMinutes, delayReason)}
                        disabled={isUpdatingBooking}
                        className="w-full sm:w-auto px-4 py-2 bg-[var(--adm-card-subtle)] hover:bg-[var(--adm-card)] border border-amber-500 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        Apply Status in System
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendDelayEmail(selectedBooking, delayMinutes, delayReason)}
                        disabled={isUpdatingBooking}
                        className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                      >
                        <span>✉</span>
                        <span>Send Email to Client (+{delayMinutes}m)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              4. HERO BANNER, STATS & AI INNOVATION
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "hero" && hero && (
            <div className="space-y-6 animate-fade-in">
              {/* Hero Banner Form */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                  Homepage Hero Banner Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Eyebrow Headline
                    </label>
                    <input
                      type="text"
                      value={hero.eyebrow}
                      onChange={(e) =>
                        setHero({ ...hero, eyebrow: e.target.value })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <ImageDropzone
                    label="Fallback Background Image"
                    value={hero.fallbackImage}
                    onChange={(val) => setHero({ ...hero, fallbackImage: val })}
                    aspectRatio="wide"
                  />
                  <div>
                    <label className="block text-xs font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Main Headline
                    </label>
                    <input
                      type="text"
                      value={hero.headlineMain}
                      onChange={(e) =>
                        setHero({ ...hero, headlineMain: e.target.value })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Gradient Accent Headline
                    </label>
                    <input
                      type="text"
                      value={hero.headlineGradient}
                      onChange={(e) =>
                        setHero({ ...hero, headlineGradient: e.target.value })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Subheadline Description
                  </label>
                  <textarea
                    rows={2}
                    value={hero.subheadline}
                    onChange={(e) =>
                      setHero({ ...hero, subheadline: e.target.value })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl px-3 py-2 text-xs outline-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      CTA 1 Label
                    </label>
                    <input
                      type="text"
                      value={hero.ctaText1}
                      onChange={(e) =>
                        setHero({ ...hero, ctaText1: e.target.value })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      CTA 1 Link
                    </label>
                    <input
                      type="text"
                      value={hero.ctaLink1}
                      onChange={(e) =>
                        setHero({ ...hero, ctaLink1: e.target.value })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      CTA 2 Label
                    </label>
                    <input
                      type="text"
                      value={hero.ctaText2}
                      onChange={(e) =>
                        setHero({ ...hero, ctaText2: e.target.value })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      CTA 2 Link
                    </label>
                    <input
                      type="text"
                      value={hero.ctaLink2}
                      onChange={(e) =>
                        setHero({ ...hero, ctaLink2: e.target.value })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => {
                      dataStore.saveHero(hero);
                      showToast("Hero banner updated & synced to Supabase.");
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-md shadow-[var(--primary)]/20 font-[family-name:var(--font-space-grotesk)]"
                  >
                    Save Hero Settings
                  </button>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                    Impact Statistics ({stats.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((s, idx) => (
                    <div
                      key={s.id}
                      className="p-4 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={s.value}
                          onChange={(e) => {
                            const updated = [...stats];
                            updated[idx].value = e.target.value;
                            setStats(updated);
                          }}
                          placeholder="50"
                          className="w-16 bg-[var(--adm-card)] border border-[var(--adm-card-border)] focus:border-[var(--primary)] rounded-lg px-2 py-1 text-xs font-bold font-mono"
                        />
                        <input
                          type="text"
                          value={s.suffix || ""}
                          onChange={(e) => {
                            const updated = [...stats];
                            updated[idx].suffix = e.target.value;
                            setStats(updated);
                          }}
                          placeholder="+"
                          className="w-10 bg-[var(--adm-card)] border border-[var(--adm-card-border)] focus:border-[var(--primary)] rounded-lg px-2 py-1 text-xs font-bold font-mono"
                        />
                      </div>
                      <input
                        type="text"
                        value={s.label}
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[idx].label = e.target.value;
                          setStats(updated);
                        }}
                        className="w-full bg-[var(--adm-card)] border border-[var(--adm-card-border)] focus:border-[var(--primary)] rounded-lg px-2 py-1 text-xs text-[var(--adm-text-primary)]"
                      />
                    </div>
                  ))}
                </div>

                <div className="text-right">
                  <button
                    onClick={() => {
                      dataStore.saveStats(stats);
                      showToast("Stats saved & synced to Supabase.");
                    }}
                    className="px-5 py-2 bg-[var(--primary)] hover:bg-[#c84113] text-white font-semibold rounded-xl text-xs cursor-pointer font-[family-name:var(--font-space-grotesk)]"
                  >
                    Save Statistics
                  </button>
                </div>
              </div>

              {/* AI Innovation Cards */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--secondary)]"></span>
                    AI &amp; Operational Innovation Cards
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiFeatures.map((f, idx) => (
                    <div
                      key={f.id}
                      className="p-4 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl space-y-2"
                    >
                      <input
                        type="text"
                        value={f.title}
                        onChange={(e) => {
                          const updated = [...aiFeatures];
                          updated[idx].title = e.target.value;
                          setAiFeatures(updated);
                        }}
                        className="w-full bg-[var(--adm-card)] border border-[var(--adm-card-border)] focus:border-[var(--primary)] rounded-lg px-2 py-1 text-xs font-bold text-[var(--adm-text-primary)]"
                      />
                      <textarea
                        rows={3}
                        value={f.desc}
                        onChange={(e) => {
                          const updated = [...aiFeatures];
                          updated[idx].desc = e.target.value;
                          setAiFeatures(updated);
                        }}
                        className="w-full bg-[var(--adm-card)] border border-[var(--adm-card-border)] focus:border-[var(--primary)] rounded-lg px-2 py-1 text-xs text-[var(--adm-text-muted)]"
                      ></textarea>
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <button
                    onClick={() => {
                      dataStore.saveAIInnovation(aiFeatures);
                      showToast(
                        "AI Innovation cards saved & synced to Supabase.",
                      );
                    }}
                    className="px-5 py-2 bg-[var(--primary)] hover:bg-[#c84113] text-white font-semibold rounded-xl text-xs cursor-pointer font-[family-name:var(--font-space-grotesk)]"
                  >
                    Save AI Cards
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              5. ABOUT US & TEAM MEMBERS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "about" && about && (
            <div className="space-y-6 animate-fade-in">
              {/* Core Story & Statements */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                  Corporate Story &amp; Purpose
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Our Story (Paragraphs)
                    </label>
                    <textarea
                      rows={5}
                      value={about.story}
                      onChange={(e) =>
                        setAbout({ ...about, story: e.target.value })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-3 text-xs outline-none leading-relaxed text-[var(--adm-text-primary)]"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                        Mission Statement
                      </label>
                      <textarea
                        rows={2}
                        value={about.mission}
                        onChange={(e) =>
                          setAbout({ ...about, mission: e.target.value })
                        }
                        className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-3 text-xs outline-none text-[var(--adm-text-primary)]"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                        Vision Statement
                      </label>
                      <textarea
                        rows={2}
                        value={about.vision}
                        onChange={(e) =>
                          setAbout({ ...about, vision: e.target.value })
                        }
                        className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-3 text-xs outline-none text-[var(--adm-text-primary)]"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => {
                      dataStore.saveAbout(about);
                      showToast("About statements saved & synced to Supabase.");
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-md shadow-[var(--primary)]/20 font-[family-name:var(--font-space-grotesk)]"
                  >
                    Save About Statements
                  </button>
                </div>
              </div>

              {/* Leadership Team Members */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                      Leadership Team Profiles ({team.length})
                    </h3>
                    <p className="text-xs text-[var(--adm-text-muted)] font-medium">
                      Manage executive bios, profile photos, and published
                      statuses displayed on `/about`.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditModal({
                        type: "team",
                        item: {
                          id: `team-${Date.now()}`,
                          name: "",
                          role: "",
                          bio: "",
                          image: "/logo.png",
                          socialLinks: { linkedin: "", email: "" },
                          status: "published",
                        },
                        isNew: true,
                      })
                    }
                    className="px-3.5 py-2 bg-[var(--primary)] hover:bg-[#c84113] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs font-[family-name:var(--font-space-grotesk)]"
                  >
                    + Add Executive Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-2xl flex gap-4 items-start hover:border-[var(--primary)] transition-colors"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.image}
                        alt={m.name}
                        className="w-16 h-16 rounded-xl object-cover bg-[var(--adm-card)] border border-[var(--adm-card-border)] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-bold text-[var(--adm-text-primary)] truncate font-[family-name:var(--font-space-grotesk)]">
                              {m.name}
                            </h4>
                            <div className="text-xs text-[var(--primary)] font-semibold truncate">
                              {m.role}
                            </div>
                          </div>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                              m.status === "published"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {m.status}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--adm-text-muted)] line-clamp-2 mt-1.5 leading-relaxed">
                          {m.bio}
                        </p>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--adm-card-border)]">
                          <AdminEditButton
                            onClick={() =>
                              setEditModal({
                                type: "team",
                                item: { ...m },
                                isNew: false,
                              })
                            }
                            label="Edit Profile"
                          />
                          <AdminDeleteButton
                            onClick={() => {
                              if (!confirm(`Delete ${m.name}?`)) return;
                              const updated = team.filter((t) => t.id !== m.id);
                              setTeam(updated);
                              dataStore.saveTeam(updated);
                              showToast(
                                `Removed ${m.name} & synced to Supabase.`,
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              6. SERVICES DIRECTORY
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "services" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                    Services &amp; Core Offerings Directory ({services.length})
                  </h3>
                  <p className="text-xs text-[var(--adm-text-muted)] font-medium">
                    Powers `/services` and dynamic route pages `/services/[id]`.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditModal({
                      type: "service",
                      item: {
                        id: `service-${Date.now()}`,
                        num: `0${services.length + 1}`,
                        badge: "Full-Lifecycle",
                        title: "",
                        headline: "",
                        desc: "",
                        caps: ["Capability 1", "Capability 2"],
                        idealFor: ["Government Agencies"],
                        status: "published",
                      },
                      isNew: true,
                    })
                  }
                  className="px-3.5 py-2 bg-[var(--primary)] hover:bg-[#c84113] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs font-[family-name:var(--font-space-grotesk)]"
                >
                  + Create Service Line
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-5 bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl shadow-xs space-y-3 hover:border-[var(--primary)] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)]">
                          {srv.num} &bull; {srv.badge}
                        </span>
                        <h4 className="text-sm font-bold text-[var(--adm-text-primary)] mt-2 font-[family-name:var(--font-space-grotesk)]">
                          {srv.title}
                        </h4>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          srv.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {srv.status}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--adm-text-muted)] line-clamp-2 leading-relaxed">
                      {srv.desc}
                    </p>

                    <div className="text-xs text-[var(--adm-text-muted)] font-medium">
                      <strong className="text-[var(--adm-text-primary)] font-bold">
                        Key Caps:
                      </strong>{" "}
                      {srv.caps.slice(0, 3).join(", ")}
                      {srv.caps.length > 3 && ` +${srv.caps.length - 3} more`}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-[var(--adm-card-border)]">
                      <Link
                        href={`/services/${srv.id}`}
                        target="_blank"
                        className="text-xs text-[var(--adm-text-muted)] hover:text-[var(--primary)] no-underline font-medium"
                      >
                        Preview Page ↗
                      </Link>
                      <div className="flex items-center gap-2">
                        <AdminEditButton
                          onClick={() =>
                            setEditModal({
                              type: "service",
                              item: { ...srv },
                              isNew: false,
                            })
                          }
                        />
                        <AdminDeleteButton
                          onClick={() => {
                            if (!confirm(`Delete service: ${srv.title}?`))
                              return;
                            const updated = services.filter(
                              (s) => s.id !== srv.id,
                            );
                            setServices(updated);
                            dataStore.saveServices(updated);
                            showToast(`Service deleted & synced to Supabase.`);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              7. CONTRACTS & CAPABILITIES
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "contracts" && (
            <div className="space-y-6 animate-fade-in">
              {/* Federal Contracts */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                      Active Federal Contract Solicitations ({contracts.length})
                    </h3>
                    <p className="text-xs text-[var(--adm-text-muted)] font-medium">
                      Powers `/contracts` active teaming feed and solicitation
                      intake.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditModal({
                        type: "contract",
                        item: {
                          solicitation: `FEMA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                          title: "",
                          agency: "Federal Emergency Management Agency (FEMA)",
                          naics: "541611",
                          setAside: "HUBZone Set-Aside",
                          postedDate: new Date().toISOString().slice(0, 10),
                          deadline: new Date(Date.now() + 30 * 86400000)
                            .toISOString()
                            .slice(0, 10),
                          location: "Orlando, FL / Regional Deployments",
                          status: "Active Solicitation",
                        },
                        isNew: true,
                      })
                    }
                    className="px-3.5 py-2 bg-[var(--primary)] hover:bg-[#c84113] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs font-[family-name:var(--font-space-grotesk)]"
                  >
                    + Add Solicitation
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[var(--adm-text-primary)]">
                    <thead className="bg-[var(--adm-card-subtle)] border-b border-[var(--adm-card-border)] text-[var(--adm-text-muted)] uppercase text-xs font-bold tracking-wider font-[family-name:var(--font-space-grotesk)]">
                      <tr>
                        <th className="py-3 px-4">Solicitation</th>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Agency</th>
                        <th className="py-3 px-4">NAICS &amp; Set-Aside</th>
                        <th className="py-3 px-4">Deadline</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {contracts.map((c, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-[var(--adm-card-subtle)]/80 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono font-bold text-[var(--adm-text-primary)]">
                            {c.solicitation}
                          </td>
                          <td className="py-3 px-4 font-bold text-[var(--adm-text-primary)] max-w-xs truncate">
                            {c.title}
                          </td>
                          <td className="py-3 px-4 text-[var(--adm-text-muted)] truncate max-w-xs font-semibold">
                            {c.agency}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] px-2 py-0.5 rounded text-xs font-semibold text-[var(--adm-text-primary)]">
                              {c.naics}
                            </span>{" "}
                            &bull; {c.setAside}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-red-600 font-bold">
                            {c.deadline}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                            <AdminEditButton
                              onClick={() =>
                                setEditModal({
                                  type: "contract",
                                  item: { ...c },
                                  isNew: false,
                                })
                              }
                            />
                            <AdminDeleteButton
                              onClick={() => {
                                if (
                                  !confirm(
                                    `Delete solicitation ${c.solicitation}?`,
                                  )
                                )
                                  return;
                                const updated = contracts.filter(
                                  (_, i) => i !== idx,
                                );
                                setContracts(updated);
                                dataStore.saveContracts(updated);
                                showToast(
                                  "Solicitation removed & synced to Supabase.",
                                );
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Socioeconomic Capabilities */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--secondary)]"></span>
                  Socioeconomic Capabilities &amp; Designations (
                  {capabilities.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {capabilities.map((cap, idx) => (
                    <div
                      key={cap.id}
                      className="p-4 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl space-y-2 hover:border-[var(--primary)] transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[var(--primary)] font-[family-name:var(--font-space-grotesk)]">
                          {cap.acronym} &bull; {cap.name}
                        </span>
                        <AdminEditButton
                          onClick={() =>
                            setEditModal({
                              type: "capability",
                              item: { ...cap },
                              isNew: false,
                            })
                          }
                        />
                      </div>
                      <p className="text-xs text-[var(--adm-text-muted)] line-clamp-2 leading-relaxed">
                        {cap.desc}
                      </p>
                      <div className="text-xs text-[var(--adm-text-primary)] font-medium">
                        Advantage:{" "}
                        <strong className="font-bold">{cap.oppVal}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              8. PARTNERSHIPS & TEAMING DIRECTORY CMS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "partnerships" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                    Teaming &amp; Subcontracting Opportunities (
                    {partnerCards.length})
                  </h3>
                  <p className="text-xs text-[var(--adm-text-muted)] font-medium">
                    Manage the 4 strategic partnership tiers and subcontractor
                    vetting cards displayed on `/partnerships`.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
                  <Link
                    href="/partnerships"
                    target="_blank"
                    className="px-3.5 py-2 border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] hover:border-[var(--primary)] rounded-xl text-xs font-semibold text-[var(--adm-text-primary)] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>View /partnerships ↗</span>
                  </Link>
                  <button
                    onClick={() =>
                      setEditModal({
                        type: "partner",
                        item: {
                          id: `partner-${Date.now()}`,
                          badge: "Teaming Track",
                          title: "",
                          desc: "",
                          status: "published",
                        },
                        isNew: true,
                      })
                    }
                    className="px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-[var(--primary)]/20 transition-all flex items-center gap-1.5"
                  >
                    <span>+ Add Teaming Pillar</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partnerCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-5 shadow-xs space-y-3 hover:border-[var(--primary)] transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)]">
                          {card.badge}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            card.status === "published"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {card.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
                        {card.title}
                      </h4>
                      <p className="text-xs text-[var(--adm-text-muted)] line-clamp-3 leading-relaxed mt-1">
                        {card.desc}
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-[var(--adm-card-border)]">
                      <AdminEditButton
                        onClick={() =>
                          setEditModal({
                            type: "partner",
                            item: { ...card },
                            isNew: false,
                          })
                        }
                      />
                      <AdminDeleteButton
                        onClick={() => {
                          if (!confirm(`Delete teaming tier "${card.title}"?`))
                            return;
                          const updated = partnerCards.filter(
                            (p) => p.id !== card.id,
                          );
                          setPartnerCards(updated);
                          dataStore.savePartnerCards(updated);
                          showToast(
                            "Teaming pillar deleted & synced to Supabase.",
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              9. NEWS & INSIGHTS ARTICLES
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "news" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                    News Articles, Solicitations &amp; Press ({articles.length})
                  </h3>
                  <p className="text-xs text-[var(--adm-text-muted)] font-medium">
                    Powers `/news` and dynamic story routes `/news/[slug]`.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditModal({
                      type: "article",
                      item: {
                        slug: `intel-bulletin-${Date.now().toString().slice(-4)}`,
                        title: "",
                        category: "Emergency Management",
                        summary: "",
                        content: "",
                        publishedDate: new Date().toISOString().slice(0, 10),
                        author: "Operations Desk",
                        status: "published",
                      },
                      isNew: true,
                    })
                  }
                  className="px-3.5 py-2 bg-[var(--primary)] hover:bg-[#c84113] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs font-[family-name:var(--font-space-grotesk)]"
                >
                  + Post News Article
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map((art) => (
                  <div
                    key={art.slug}
                    className="p-5 bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl shadow-xs space-y-3 hover:border-[var(--primary)] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] font-[family-name:var(--font-space-grotesk)]">
                          {art.category} &bull; {art.publishedDate}
                        </span>
                        <h4 className="text-sm font-bold text-[var(--adm-text-primary)] mt-1 font-[family-name:var(--font-space-grotesk)]">
                          {art.title}
                        </h4>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          art.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {art.status}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--adm-text-muted)] line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>

                    <div className="flex justify-between items-center pt-3 border-t border-[var(--adm-card-border)]">
                      <Link
                        href={`/news/${art.slug}`}
                        target="_blank"
                        className="text-xs text-[var(--adm-text-muted)] hover:text-[var(--primary)] no-underline font-medium"
                      >
                        Read Article ↗
                      </Link>
                      <div className="flex items-center gap-2">
                        <AdminEditButton
                          onClick={() =>
                            setEditModal({
                              type: "article",
                              item: { ...art },
                              isNew: false,
                            })
                          }
                        />
                        <AdminDeleteButton
                          onClick={() => {
                            if (!confirm(`Delete article: ${art.title}?`))
                              return;
                            const updated = articles.filter(
                              (a) => a.slug !== art.slug,
                            );
                            setArticles(updated);
                            dataStore.saveArticles(updated);
                            showToast("Article deleted & synced to Supabase.");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              9. CAREERS & CADRES
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "careers" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                    Careers Portal &amp; Emergency Cadre Listings ({jobs.length}
                    )
                  </h3>
                  <p className="text-xs text-[var(--adm-text-muted)] font-medium">
                    Powers `/careers` directory and dynamic application forms
                    `/careers/[id]`.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditModal({
                      type: "job",
                      item: {
                        id: `job-${Date.now().toString().slice(-4)}`,
                        title: "",
                        department: "Emergency Operations & Relief",
                        location: "Orlando, Florida / Remote",
                        type: "Cadre / Temporary ($25.00–$35.00/hr)",
                        lastDate: "Open Until Filled",
                        summary: "",
                        description: "",
                        responsibilities: [
                          "Fulfill mission-specific field recovery scope",
                        ],
                        requirements: [
                          "High school diploma or equivalent required",
                        ],
                        postedDate: new Date().toISOString().slice(0, 10),
                        status: "published",
                      },
                      isNew: true,
                    })
                  }
                  className="px-3.5 py-2 bg-[var(--primary)] hover:bg-[#c84113] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs font-[family-name:var(--font-space-grotesk)]"
                >
                  + Post Job Requisition
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl shadow-xs space-y-3 hover:border-[var(--primary)] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] font-[family-name:var(--font-space-grotesk)]">
                          {job.department} &bull; {job.type}
                        </span>
                        <h4 className="text-sm font-bold text-[var(--adm-text-primary)] mt-1 font-[family-name:var(--font-space-grotesk)]">
                          {job.title}
                        </h4>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          job.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[0.72rem] text-[var(--adm-text-muted)] font-medium">
                      <span className="flex items-center gap-1 bg-[var(--adm-card-subtle)] px-2 py-0.5 rounded border border-[var(--adm-card-border)]">
                        📍 {job.location || "Orlando, FL / Remote"}
                      </span>
                      <span className="flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-200 font-semibold">
                        ⏰ Deadline: {job.lastDate || "Open Until Filled"}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--adm-text-muted)] line-clamp-2 leading-relaxed">
                      {job.summary}
                    </p>

                    <div className="flex justify-between items-center pt-3 border-t border-[var(--adm-card-border)]">
                      <Link
                        href={`/careers/${job.id}`}
                        target="_blank"
                        className="text-xs text-[var(--adm-text-muted)] hover:text-[var(--primary)] no-underline font-medium"
                      >
                        Preview Job Form ↗
                      </Link>
                      <div className="flex items-center gap-2">
                        <AdminEditButton
                          onClick={() =>
                            setEditModal({
                              type: "job",
                              item: { ...job },
                              isNew: false,
                            })
                          }
                        />
                        <AdminDeleteButton
                          onClick={() => {
                            if (
                              !confirm(`Delete job requisition: ${job.title}?`)
                            )
                              return;
                            const updated = jobs.filter((j) => j.id !== job.id);
                            setJobs(updated);
                            dataStore.saveJobs(updated);
                            showToast(
                              "Job requisition removed & synced to Supabase.",
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              10. COMMUNITY (INFERNO CARES) & TESTIMONIALS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "community" && (
            <div className="space-y-6 animate-fade-in">
              {/* Community Impact Stories */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                      Inferno Cares Community Impact Initiatives (
                      {communityStories.length})
                    </h3>
                    <p className="text-xs text-[var(--adm-text-muted)] font-medium">
                      Showcased on homepage and `/about` (Kickball relief
                      tournament, Academic scholarships).
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditModal({
                        type: "community",
                        item: {
                          id: `story-${Date.now()}`,
                          title: "",
                          summary: "",
                          content: "",
                          image: "/logo.png",
                          videoUrl: "",
                          gallery: [],
                          featured: true,
                          status: "published",
                        },
                        isNew: true,
                      })
                    }
                    className="px-3.5 py-2 bg-[var(--primary)] hover:bg-[#c84113] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs font-[family-name:var(--font-space-grotesk)]"
                  >
                    + Add Community Story
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {communityStories.map((story) => (
                    <div
                      key={story.id}
                      className="p-4 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-2xl flex gap-4 items-start hover:border-[var(--primary)] transition-colors"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={story.image || "/logo.png"}
                        alt={story.title}
                        className="w-20 h-20 rounded-xl object-cover bg-[var(--adm-card)] shrink-0 border border-[var(--adm-card-border)]"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[var(--adm-text-primary)] truncate font-[family-name:var(--font-space-grotesk)]">
                          {story.title}
                        </h4>
                        <p className="text-xs text-[var(--adm-text-muted)] line-clamp-2 mt-1 leading-relaxed">
                          {story.summary}
                        </p>

                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {story.videoUrl && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[rgba(26,86,196,0.12)] text-[var(--secondary)] border border-[rgba(26,86,196,0.25)]">
                              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>
                              Video Media
                            </span>
                          )}
                          {story.gallery && story.gallery.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[rgba(225,77,24,0.1)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)]">
                              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                <circle cx="9" cy="9" r="2" />
                              </svg>
                              {story.gallery.length} Photos
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--adm-card-border)]">
                          <AdminEditButton
                            onClick={() =>
                              setEditModal({
                                type: "community",
                                item: { ...story },
                                isNew: false,
                              })
                            }
                          />
                          <AdminDeleteButton
                            onClick={() => {
                              if (!confirm(`Delete story: ${story.title}?`))
                                return;
                              const updated = communityStories.filter(
                                (s) => s.id !== story.id,
                              );
                              setCommunityStories(updated);
                              dataStore.saveCommunityStories(updated);
                              showToast(
                                "Community story removed & synced to Supabase.",
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Testimonials */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--secondary)]"></span>
                    Client &amp; Partner Testimonials ({testimonials.length})
                  </h3>
                  <button
                    onClick={() =>
                      setEditModal({
                        type: "testimonial",
                        item: {
                          id: `test-${Date.now()}`,
                          name: "",
                          company: "",
                          role: "",
                          rating: 5,
                          text: "",
                          status: "published",
                        },
                        isNew: true,
                      })
                    }
                    className="px-3.5 py-2 bg-[var(--primary)] hover:bg-[#c84113] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs font-[family-name:var(--font-space-grotesk)]"
                  >
                    + Add Testimonial
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl space-y-2 hover:border-[var(--primary)] transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--primary)] font-bold text-xs">
                          {"★".repeat(t.rating)}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {t.status}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--adm-text-muted)] line-clamp-3 italic leading-relaxed">
                        &ldquo;{t.text}&rdquo;
                      </p>
                      <div className="pt-2 border-t border-[var(--adm-card-border)] flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-[var(--adm-text-primary)]">
                            {t.name}
                          </div>
                          <div className="text-xs text-[var(--adm-text-muted)] font-medium">
                            {t.company}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <AdminEditButton
                            onClick={() =>
                              setEditModal({
                                type: "testimonial",
                                item: { ...t },
                                isNew: false,
                              })
                            }
                          />
                          <AdminDeleteButton
                            onClick={() => {
                              if (
                                !confirm(`Delete testimonial from ${t.name}?`)
                              )
                                return;
                              const updated = testimonials.filter(
                                (item) => item.id !== t.id,
                              );
                              setTestimonials(updated);
                              dataStore.saveTestimonials(updated);
                              showToast(
                                "Testimonial removed & synced to Supabase.",
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              11. FAQ, RESOURCES, CHATBOT Q&A & LEGAL PAGES
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "knowledge" && (
            <div className="space-y-6 animate-fade-in">
              {/* Chatbot Quick Answers CMS */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                      AI Chatbot Quick Answers &amp; Knowledge Base (
                      {chatbotQA.length})
                    </h3>
                    <p className="text-xs text-[var(--adm-text-muted)] font-medium">
                      Powers the floating AI Operations Desk widget and instant
                      preset chips.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditModal({
                        type: "chatbotQA",
                        item: {
                          question: "New Coordination Query?",
                          keywords: ["scope", "assistance"],
                          answer:
                            "The Inferno Group operations desk coordinates...",
                        },
                        isNew: true,
                      })
                    }
                    className="px-3.5 py-2 bg-[var(--primary)] hover:bg-[#c84113] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs font-[family-name:var(--font-space-grotesk)]"
                  >
                    + Add Chatbot Q&amp;A
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {chatbotQA.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl space-y-1.5 hover:border-[var(--primary)] transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
                          💬 {item.question}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <AdminEditButton
                            onClick={() =>
                              setEditModal({
                                type: "chatbotQA",
                                item: { ...item },
                                isNew: false,
                              })
                            }
                          />
                          <AdminDeleteButton
                            onClick={() => {
                              if (!confirm(`Delete Q&A: ${item.question}?`))
                                return;
                              const updated = chatbotQA.filter(
                                (_, i) => i !== idx,
                              );
                              setChatbotQA(updated);
                              dataStore.saveChatbotQA(updated);
                              showToast(
                                "Chatbot question removed & synced to Supabase.",
                              );
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-[var(--adm-text-muted)] line-clamp-2 leading-relaxed">
                        {item.answer}
                      </p>
                      <div className="text-xs text-[var(--adm-text-muted)] font-mono font-medium">
                        Keywords: {item.keywords.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Base CMS */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                      Portal Frequently Asked Questions ({faqs.length})
                    </h3>
                    <p className="text-xs text-[var(--adm-text-muted)] font-medium">
                      Categorized accordion entries on `/faq`.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditModal({
                        type: "faq",
                        item: {
                          id: `faq-${Date.now()}`,
                          question: "",
                          answer: "",
                          category: "credentials",
                          status: "published",
                        },
                        isNew: true,
                      })
                    }
                    className="px-3.5 py-2 bg-[var(--primary)] hover:bg-[#c84113] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs font-[family-name:var(--font-space-grotesk)]"
                  >
                    + Add FAQ
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="p-3.5 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl space-y-1.5 hover:border-[var(--primary)] transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)]">
                            {faq.category}
                          </span>
                          <span className="ml-2 text-xs font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
                            {faq.question}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <AdminEditButton
                            onClick={() =>
                              setEditModal({
                                type: "faq",
                                item: { ...faq },
                                isNew: false,
                              })
                            }
                          />
                          <AdminDeleteButton
                            onClick={() => {
                              if (!confirm(`Delete FAQ?`)) return;
                              const updated = faqs.filter(
                                (f) => f.id !== faq.id,
                              );
                              setFaqs(updated);
                              dataStore.saveFAQs(updated);
                              showToast("FAQ removed & synced to Supabase.");
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-[var(--adm-text-muted)] line-clamp-2 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Downloadable Resources Library */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--secondary)]"></span>
                      Downloadable Resources &amp; Playbooks ({resources.length}
                      )
                    </h3>
                    <p className="text-xs text-[var(--adm-text-muted)] font-medium">
                      Gated resources available on `/resources`.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditModal({
                        type: "resource",
                        item: {
                          id: `res-${Date.now()}`,
                          title: "",
                          description: "",
                          category: "Emergency Playbooks",
                          fileType: "PDF Compliance Guide",
                          fileSize: "2.4 MB",
                          downloads: 120,
                        },
                        isNew: true,
                      })
                    }
                    className="px-3.5 py-2 bg-[var(--primary)] hover:bg-[#c84113] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs font-[family-name:var(--font-space-grotesk)]"
                  >
                    + Add Resource
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resources.map((res) => (
                    <div
                      key={res.id}
                      className="p-3.5 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-xl space-y-1 hover:border-[var(--primary)] transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-[var(--adm-text-primary)] truncate font-[family-name:var(--font-space-grotesk)]">
                          📄 {res.title}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <AdminEditButton
                            onClick={() =>
                              setEditModal({
                                type: "resource",
                                item: { ...res },
                                isNew: false,
                              })
                            }
                          />
                          <AdminDeleteButton
                            onClick={() => {
                              if (!confirm(`Delete resource?`)) return;
                              const updated = resources.filter(
                                (r) => r.id !== res.id,
                              );
                              setResources(updated);
                              dataStore.saveResources(updated);
                              showToast(
                                "Resource removed & synced to Supabase.",
                              );
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-[var(--adm-text-muted)] line-clamp-1">
                        {res.description}
                      </p>
                      <div className="text-xs text-[var(--adm-text-muted)] font-mono font-medium">
                        {res.fileType} &bull; {res.fileSize} &bull;{" "}
                        {res.downloads} downloads
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Pages Editor */}
              {privacy && conduct && (
                <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--navy)]"></span>
                    Legal &amp; Compliance Policy Documentation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                        Privacy Policy Content (/privacy)
                      </label>
                      <textarea
                        rows={8}
                        value={privacy.content}
                        onChange={(e) =>
                          setPrivacy({ ...privacy, content: e.target.value })
                        }
                        className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-3 text-xs outline-none font-mono leading-relaxed"
                      ></textarea>
                      <button
                        onClick={() => {
                          dataStore.saveLegalPrivacy(privacy);
                          showToast(
                            "Privacy policy saved & synced to Supabase.",
                          );
                        }}
                        className="mt-2 px-4 py-1.5 bg-[var(--navy)] hover:opacity-90 text-white rounded-xl text-xs font-semibold cursor-pointer font-[family-name:var(--font-space-grotesk)]"
                      >
                        Save Privacy Policy
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                        Standards of Conduct Content (/conduct)
                      </label>
                      <textarea
                        rows={8}
                        value={conduct.content}
                        onChange={(e) =>
                          setConduct({ ...conduct, content: e.target.value })
                        }
                        className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-3 text-xs outline-none font-mono leading-relaxed"
                      ></textarea>
                      <button
                        onClick={() => {
                          dataStore.saveLegalConduct(conduct);
                          showToast(
                            "Standards of Conduct saved & synced to Supabase.",
                          );
                        }}
                        className="mt-2 px-4 py-1.5 bg-[var(--navy)] hover:opacity-90 text-white rounded-xl text-xs font-semibold cursor-pointer font-[family-name:var(--font-space-grotesk)]"
                      >
                        Save Standards of Conduct
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              13. B2G SOCIOECONOMIC ELIGIBILITY QUIZ CMS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "quiz" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                    Diagnostic Eligibility Questions ({quizQuestions.length})
                  </h3>
                  <p className="text-xs text-[var(--adm-text-muted)] font-medium">
                    Powers the interactive SBA 8(a), HUBZone, WOSB, and VOSB
                    eligibility assessment on `/quiz`.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
                  <Link
                    href="/quiz"
                    target="_blank"
                    className="px-3.5 py-2 border border-[var(--adm-card-border)] bg-[var(--adm-card-subtle)] hover:border-[var(--primary)] rounded-xl text-xs font-semibold text-[var(--adm-text-primary)] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>View /quiz ↗</span>
                  </Link>
                  <button
                    onClick={() =>
                      setEditModal({
                        type: "quiz",
                        item: {
                          id: `custom_${Date.now().toString().slice(-4)}`,
                          text: "",
                          description: "",
                          options: [
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" },
                          ],
                          status: "published",
                        },
                        isNew: true,
                      })
                    }
                    className="px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-[var(--primary)]/20 transition-all flex items-center gap-1.5"
                  >
                    <span>+ Add Diagnostic Question</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {quizQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-5 shadow-xs space-y-3 hover:border-[var(--primary)] transition-colors"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--adm-card-subtle)] font-mono text-xs font-bold text-[var(--adm-text-muted)]">
                          {idx + 1}
                        </span>
                        <span className="py-0.5 px-2 rounded-md font-mono text-[10px] font-bold uppercase bg-[rgba(26,86,196,0.08)] text-[var(--secondary)] border border-[rgba(26,86,196,0.2)]">
                          {q.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            q.status === "published"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AdminEditButton
                          onClick={() =>
                            setEditModal({
                              type: "quiz",
                              item: { ...q },
                              isNew: false,
                            })
                          }
                        />
                        <AdminDeleteButton
                          onClick={() => {
                            if (!confirm(`Delete question "${q.text}"?`))
                              return;
                            const updated = quizQuestions.filter(
                              (item) => item.id !== q.id,
                            );
                            setQuizQuestions(updated);
                            dataStore.saveQuizQuestions(updated);
                            showToast(
                              "Diagnostic question deleted & synced to Supabase.",
                            );
                          }}
                        />
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)]">
                      {q.text}
                    </h4>
                    <p className="text-xs text-[var(--adm-text-muted)] leading-relaxed">
                      {q.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--adm-card-border)]">
                      {q.options.map((opt, optIdx) => (
                        <span
                          key={optIdx}
                          className="px-3 py-1 bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] rounded-lg text-xs font-medium text-[var(--adm-text-secondary)]"
                        >
                          {opt.label} ({opt.value})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              14. GLOBAL SITE, CORPORATE & EMERGENCY SETTINGS CMS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "settings" && siteSettings && (
            <div className="space-y-6 animate-fade-in">
              {/* Emergency Operations Directive Banner */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-4 border-b border-[var(--adm-card-border)] pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                      Emergency Broadcast Alert Banner
                    </h3>
                    <p className="text-xs text-[var(--adm-text-muted)] font-medium">
                      Activates an urgent emergency advisory bar across the top
                      of every public portal page.
                    </p>
                  </div>
                  <label className="flex items-center gap-2.5 cursor-pointer font-[family-name:var(--font-space-grotesk)] text-xs font-bold text-[var(--adm-text-primary)]">
                    <input
                      type="checkbox"
                      checked={siteSettings.emergencyBannerActive}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          emergencyBannerActive: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded accent-[var(--primary)] cursor-pointer"
                    />
                    <span>
                      {siteSettings.emergencyBannerActive
                        ? "Active on Public Site"
                        : "Disabled (Off)"}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Emergency Alert Message
                    </label>
                    <input
                      type="text"
                      value={siteSettings.emergencyBannerMessage}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          emergencyBannerMessage: e.target.value,
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Emergency Dispatch Hotline Phone
                    </label>
                    <input
                      type="text"
                      value={siteSettings.emergencyHotline}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          emergencyHotline: e.target.value,
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Corporate Contact & Departmental Routing */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                  Corporate Headquarters &amp; Departmental Inboxes
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Contracting &amp; Teaming Desk
                    </label>
                    <input
                      type="email"
                      value={siteSettings.contactEmail}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          contactEmail: e.target.value,
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Talent Acquisition &amp; Resumes
                    </label>
                    <input
                      type="email"
                      value={siteSettings.careersEmail}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          careersEmail: e.target.value,
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Inferno Cares Community Desk
                    </label>
                    <input
                      type="email"
                      value={siteSettings.communityEmail}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          communityEmail: e.target.value,
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Primary Phone Line
                    </label>
                    <input
                      type="text"
                      value={siteSettings.phone}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          phone: e.target.value,
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Headquarters Address
                    </label>
                    <input
                      type="text"
                      value={siteSettings.address}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          address: e.target.value,
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Coordination Window
                    </label>
                    <input
                      type="text"
                      value={siteSettings.coordinationWindow}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          coordinationWindow: e.target.value,
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Federal Contracting Identifiers */}
              <div className="bg-[var(--adm-card)] border border-[var(--adm-card-border)] rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--secondary)]"></span>
                  Federal Contracting Identifiers (SAM.gov &amp; SBA)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Unique Entity Identifier (UEI)
                    </label>
                    <input
                      type="text"
                      value={siteSettings.uei}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          uei: e.target.value,
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      CAGE / NCAGE Code
                    </label>
                    <input
                      type="text"
                      value={siteSettings.cageCode}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          cageCode: e.target.value,
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Primary NAICS Code
                    </label>
                    <input
                      type="text"
                      value={siteSettings.primaryNaics}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          primaryNaics: e.target.value,
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      LinkedIn Corporate URL
                    </label>
                    <input
                      type="url"
                      value={siteSettings.linkedinUrl}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          linkedinUrl: e.target.value,
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      X / Twitter Corporate URL
                    </label>
                    <input
                      type="url"
                      value={siteSettings.twitterUrl}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          twitterUrl: e.target.value,
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      dataStore.saveSiteSettings(siteSettings);
                      showToast(
                        "Corporate identity & emergency settings saved & synced to Supabase.",
                      );
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-[var(--primary)]/20 font-[family-name:var(--font-space-grotesk)]"
                  >
                    Save All Corporate Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── GENERIC EDIT MODAL ── */}
      {editModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--adm-card)] rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-scale-up border border-[var(--adm-card-border)]">
            <div className="flex justify-between items-center border-b border-[var(--adm-card-border)] pb-3">
              <h3 className="text-sm font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] capitalize flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                {editModal.isNew ? "Create" : "Edit"}{" "}
                {editModal.type === "chatbotQA"
                  ? "Chatbot Q&A"
                  : editModal.type}
              </h3>
              <AdminModalCloseButton
                onClick={() => setEditModal(null)}
                title="Close modal"
              />
            </div>

            {/* TEAM MEMBER MODAL */}
            {editModal.type === "team" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editModal.item.name}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, name: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Role &amp; Executive Title
                  </label>
                  <input
                    type="text"
                    value={editModal.item.role}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, role: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none"
                  />
                </div>
                <ImageDropzone
                  label="Profile Photo"
                  value={editModal.item.image || ""}
                  onChange={(val) =>
                    setEditModal({
                      ...editModal,
                      item: { ...editModal.item, image: val },
                    })
                  }
                  aspectRatio="square"
                />
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Executive Biography
                  </label>
                  <textarea
                    rows={4}
                    value={editModal.item.bio}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, bio: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none"
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Status
                    </label>
                    <select
                      value={editModal.item.status}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, status: e.target.value },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs outline-none"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Contact Email
                    </label>
                    <input
                      type="text"
                      value={editModal.item.socialLinks?.email || ""}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: {
                            ...editModal.item,
                            socialLinks: {
                              ...editModal.item.socialLinks,
                              email: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SERVICE MODAL */}
            {editModal.type === "service" && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Number (e.g. 01)
                    </label>
                    <input
                      type="text"
                      value={editModal.item.num}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, num: e.target.value },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Badge Tag
                    </label>
                    <input
                      type="text"
                      value={editModal.item.badge}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, badge: e.target.value },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Service Title
                  </label>
                  <input
                    type="text"
                    value={editModal.item.title}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, title: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={editModal.item.headline || ""}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, headline: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Overview Description
                  </label>
                  <textarea
                    rows={3}
                    value={editModal.item.desc}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, desc: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs"
                  ></textarea>
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Capabilities (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={editModal.item.caps.join("\n")}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: {
                          ...editModal.item,
                          caps: e.target.value.split("\n").filter(Boolean),
                        },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs font-mono"
                  ></textarea>
                </div>
              </div>
            )}

            {/* CONTRACT MODAL */}
            {editModal.type === "contract" && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Solicitation Number
                    </label>
                    <input
                      type="text"
                      value={editModal.item.solicitation}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: {
                            ...editModal.item,
                            solicitation: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      NAICS Code
                    </label>
                    <input
                      type="text"
                      value={editModal.item.naics}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, naics: e.target.value },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Contract / Scope Title
                  </label>
                  <input
                    type="text"
                    value={editModal.item.title}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, title: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Issuing Government Agency
                  </label>
                  <input
                    type="text"
                    value={editModal.item.agency}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, agency: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Set-Aside Designation
                    </label>
                    <input
                      type="text"
                      value={editModal.item.setAside}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, setAside: e.target.value },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Submission Deadline
                    </label>
                    <input
                      type="date"
                      value={editModal.item.deadline}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, deadline: e.target.value },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CHATBOT Q&A MODAL */}
            {editModal.type === "chatbotQA" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Preset Chip Question (Quick Answer)
                  </label>
                  <input
                    type="text"
                    value={editModal.item.question}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, question: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Keywords (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={editModal.item.keywords.join(", ")}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: {
                          ...editModal.item,
                          keywords: e.target.value
                            .split(",")
                            .map((k) => k.trim().toLowerCase())
                            .filter(Boolean),
                        },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs font-mono"
                    placeholder="fema, debris, emergency, recovery"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Authoritative Assistant Response
                  </label>
                  <textarea
                    rows={4}
                    value={editModal.item.answer}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, answer: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs leading-relaxed"
                  ></textarea>
                  <span className="text-xs text-[var(--adm-text-muted)] font-medium">
                    Supports markdown links like [Contact page](/contact) or
                    [Services](/services).
                  </span>
                </div>
              </div>
            )}

            {/* ARTICLE MODAL */}
            {editModal.type === "article" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={editModal.item.title}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, title: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={editModal.item.slug}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, slug: e.target.value },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editModal.item.category}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, category: e.target.value },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Summary
                  </label>
                  <textarea
                    rows={2}
                    value={editModal.item.summary}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, summary: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                  ></textarea>
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Full Article Body
                  </label>
                  <textarea
                    rows={6}
                    value={editModal.item.content}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, content: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs font-mono"
                  ></textarea>
                </div>
              </div>
            )}

            {/* JOB MODAL */}
            {editModal.type === "job" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Requisition Title
                  </label>
                  <input
                    type="text"
                    value={editModal.item.title}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, title: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    placeholder="e.g. Case Manager"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Department
                    </label>
                    <input
                      type="text"
                      value={editModal.item.department}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: {
                            ...editModal.item,
                            department: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                      placeholder="e.g. Emergency Operations & Relief"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Rate / Salary &amp; Type
                    </label>
                    <input
                      type="text"
                      value={editModal.item.type}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, type: e.target.value },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                      placeholder="e.g. Cadre / Temporary ($25.00–$35.00/hr)"
                    />
                  </div>
                </div>

                {/* Location & Last Date to Apply */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Location / Deployment Area
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Orlando, Florida / Remote or Nationwide"
                      value={editModal.item.location || ""}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: {
                            ...editModal.item,
                            location: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Last Date to Apply / Deadline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. November 30, 2026 or Open Until Filled"
                      value={editModal.item.lastDate || ""}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: {
                            ...editModal.item,
                            lastDate: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Publication Status
                    </label>
                    <select
                      value={editModal.item.status || "published"}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: {
                            ...editModal.item,
                            status: e.target.value as "published" | "draft",
                          },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Posted Date
                    </label>
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      value={editModal.item.postedDate || ""}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: {
                            ...editModal.item,
                            postedDate: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Summary (Short Excerpt)
                  </label>
                  <textarea
                    rows={2}
                    value={editModal.item.summary}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, summary: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    placeholder="Brief 1-2 sentence overview for careers cards"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Full Role Overview / Description
                  </label>
                  <textarea
                    rows={3}
                    value={editModal.item.description || ""}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, description: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    placeholder="Full detailed job description shown on application page"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Responsibilities (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={(editModal.item.responsibilities || []).join("\n")}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: {
                          ...editModal.item,
                          responsibilities: e.target.value
                            .split("\n")
                            .filter(Boolean),
                        },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs font-mono"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Required Qualifications (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={(editModal.item.requirements || []).join("\n")}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: {
                          ...editModal.item,
                          requirements: e.target.value
                            .split("\n")
                            .filter(Boolean),
                        },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs font-mono"
                  ></textarea>
                </div>
              </div>
            )}

            {/* FAQ MODAL */}
            {editModal.type === "faq" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Question
                  </label>
                  <input
                    type="text"
                    value={editModal.item.question}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, question: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Category
                  </label>
                  <select
                    value={editModal.item.category}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, category: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                  >
                    <option value="credentials">
                      Credentials &amp; HUBZone
                    </option>
                    <option value="emergency">Emergency Management</option>
                    <option value="services">Services &amp; Logistics</option>
                    <option value="partnership">Teaming &amp; Bonding</option>
                    <option value="community">Inferno Cares</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Answer
                  </label>
                  <textarea
                    rows={4}
                    value={editModal.item.answer}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, answer: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs leading-relaxed"
                  ></textarea>
                </div>
              </div>
            )}

            {/* COMMUNITY STORY MODAL */}
            {editModal.type === "community" && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Initiative Title
                  </label>
                  <input
                    type="text"
                    value={editModal.item.title || ""}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, title: e.target.value },
                      })
                    }
                    placeholder="e.g. The Inferno Ignite Scholarship or Kicking for Relief"
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Summary
                    </label>
                    <textarea
                      rows={3}
                      value={editModal.item.summary || ""}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, summary: e.target.value },
                        })
                      }
                      placeholder="Brief overview shown on cards and previews..."
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Detailed Story
                    </label>
                    <textarea
                      rows={3}
                      value={editModal.item.content || ""}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, content: e.target.value },
                        })
                      }
                      placeholder="Full initiative background, eligibility, and impact metrics..."
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs outline-none"
                    ></textarea>
                  </div>
                </div>

                {/* Primary Feature Image */}
                <ImageDropzone
                  label="Story Feature / Cover Image"
                  value={editModal.item.image || ""}
                  onChange={(val) =>
                    setEditModal({
                      ...editModal,
                      item: { ...editModal.item, image: val },
                    })
                  }
                  aspectRatio="wide"
                  placeholderHint="Drop cover photo here, or browse files (saved to /uploads)"
                />

                {/* Presentation Video (Dedicated to Scholarship & Video Initiatives) */}
                <div className="p-4 rounded-2xl bg-[var(--adm-card)] border border-[var(--adm-card-border)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[var(--secondary)]"></span>
                      Official Video Presentation (e.g. Scholarship)
                    </span>
                    <span className="text-[10px] text-[var(--adm-text-muted)] font-mono">
                      MP4 / WebM / MOV
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--adm-text-muted)]">
                    Upload or specify the video file for this initiative. If provided, the initiative player will stream this video with autoplay and audio controls.
                  </p>
                  <VideoDropzone
                    label="Upload or Replace Video File"
                    value={editModal.item.videoUrl || ""}
                    onChange={(val) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, videoUrl: val },
                      })
                    }
                  />
                </div>

                {/* Photo Gallery Manager (Dedicated to Kickball Tournament & Multi-Photo Initiatives) */}
                <div className="p-4 rounded-2xl bg-[var(--adm-card)] border border-[var(--adm-card-border)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--adm-text-primary)] font-[family-name:var(--font-space-grotesk)] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                      Action Photo Gallery (e.g. Kickball Tournament)
                    </span>
                    <span className="text-[10px] text-[var(--adm-text-muted)] font-mono">
                      Multiple Images
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--adm-text-muted)]">
                    Upload tournament action photos, team shots, and event highlights. These render in the interactive gallery on the homepage and about page.
                  </p>
                  <GalleryManager
                    label="Initiative Gallery Photos"
                    gallery={editModal.item.gallery || []}
                    onChange={(val) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, gallery: val },
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* TESTIMONIAL MODAL */}
            {editModal.type === "testimonial" && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={editModal.item.name}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, name: e.target.value },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={editModal.item.company}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, company: e.target.value },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Client Quote
                  </label>
                  <textarea
                    rows={3}
                    value={editModal.item.text}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, text: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                  ></textarea>
                </div>
              </div>
            )}

            {/* RESOURCE MODAL */}
            {editModal.type === "resource" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={editModal.item.title}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, title: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editModal.item.category}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, category: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editModal.item.description}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: {
                          ...editModal.item,
                          description: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                  ></textarea>
                </div>
              </div>
            )}

            {/* CAPABILITY MODAL */}
            {editModal.type === "capability" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Capability Title
                  </label>
                  <input
                    type="text"
                    value={editModal.item.title}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, title: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={editModal.item.desc}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, desc: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                  ></textarea>
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Procurement Advantage Value
                  </label>
                  <input
                    type="text"
                    value={editModal.item.oppVal}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, oppVal: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                  />
                </div>
              </div>
            )}

            {/* PARTNER / SUBCONTRACTING PILLAR MODAL */}
            {editModal.type === "partner" && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Pillar Track Badge
                    </label>
                    <input
                      type="text"
                      value={editModal.item.badge}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, badge: e.target.value },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                      placeholder="e.g. Direct Teaming, Tier-1 Subcontractor"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Status
                    </label>
                    <select
                      value={editModal.item.status}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: {
                            ...editModal.item,
                            status: e.target.value as "published" | "draft",
                          },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Pillar Title
                  </label>
                  <input
                    type="text"
                    value={editModal.item.title}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, title: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs font-semibold"
                    placeholder="e.g. Subcontracting Opportunities"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Scope &amp; Value Proposition Description
                  </label>
                  <textarea
                    rows={4}
                    value={editModal.item.desc}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, desc: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2.5 text-xs leading-relaxed"
                    placeholder="Describe how partners interface with The Inferno Group under this pillar..."
                  ></textarea>
                </div>
              </div>
            )}

            {/* QUIZ DIAGNOSTIC QUESTION MODAL */}
            {editModal.type === "quiz" && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Diagnostic Question Key / ID
                    </label>
                    <input
                      type="text"
                      value={editModal.item.id}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, id: e.target.value },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs font-mono"
                      placeholder="e.g. hubzone_certified, past_perf"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Status
                    </label>
                    <select
                      value={editModal.item.status}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: {
                            ...editModal.item,
                            status: e.target.value as "published" | "draft",
                          },
                        })
                      }
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={editModal.item.text}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: { ...editModal.item, text: e.target.value },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs font-semibold"
                    placeholder="e.g. Does your entity hold active SAM.gov CAGE registration?"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                    Regulatory Context / Guidance
                  </label>
                  <textarea
                    rows={3}
                    value={editModal.item.description}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        item: {
                          ...editModal.item,
                          description: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs leading-relaxed"
                    placeholder="Explain the compliance requirement or diagnostic relevance under FAR/SBA rules..."
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Option A Label (Affirmative)
                    </label>
                    <input
                      type="text"
                      value={editModal.item.options?.[0]?.label ?? "Yes"}
                      onChange={(e) => {
                        const opts = [
                          ...(editModal.item.options || [
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" },
                          ]),
                        ];
                        opts[0] = {
                          ...opts[0],
                          label: e.target.value,
                          value: "yes",
                        };
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, options: opts },
                        });
                      }}
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--adm-text-primary)] mb-1 font-[family-name:var(--font-space-grotesk)]">
                      Option B Label (Negative)
                    </label>
                    <input
                      type="text"
                      value={editModal.item.options?.[1]?.label ?? "No"}
                      onChange={(e) => {
                        const opts = [
                          ...(editModal.item.options || [
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" },
                          ]),
                        ];
                        opts[1] = {
                          ...opts[1],
                          label: e.target.value,
                          value: "no",
                        };
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, options: opts },
                        });
                      }}
                      className="w-full bg-[var(--adm-card-subtle)] border border-[var(--adm-card-border)] focus:bg-[var(--adm-card)] focus:border-[var(--primary)] rounded-xl p-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--adm-card-border)] font-[family-name:var(--font-space-grotesk)]">
              <button
                onClick={() => setEditModal(null)}
                className="px-4 py-2 border border-[var(--adm-card-border)] bg-[var(--adm-card)] text-[var(--adm-text-primary)] hover:border-[var(--primary)] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const { type, item, isNew } = editModal;
                  if (type === "team") {
                    const updated = isNew
                      ? [item, ...team]
                      : team.map((t) => (t.id === item.id ? item : t));
                    setTeam(updated);
                    dataStore.saveTeam(updated);
                  } else if (type === "service") {
                    const updated = isNew
                      ? [...services, item]
                      : services.map((s) => (s.id === item.id ? item : s));
                    setServices(updated);
                    dataStore.saveServices(updated);
                  } else if (type === "contract") {
                    const updated = isNew
                      ? [item, ...contracts]
                      : contracts.map((c) =>
                          c.solicitation === item.solicitation ? item : c,
                        );
                    setContracts(updated);
                    dataStore.saveContracts(updated);
                  } else if (type === "chatbotQA") {
                    const updated = isNew
                      ? [item, ...chatbotQA]
                      : chatbotQA.map((q) =>
                          q.question === item.question ? item : q,
                        );
                    setChatbotQA(updated);
                    dataStore.saveChatbotQA(updated);
                  } else if (type === "article") {
                    const updated = isNew
                      ? [item, ...articles]
                      : articles.map((a) => (a.slug === item.slug ? item : a));
                    setArticles(updated);
                    dataStore.saveArticles(updated);
                  } else if (type === "job") {
                    const updated = isNew
                      ? [item, ...jobs]
                      : jobs.map((j) => (j.id === item.id ? item : j));
                    setJobs(updated);
                    dataStore.saveJobs(updated);
                  } else if (type === "faq") {
                    const updated = isNew
                      ? [item, ...faqs]
                      : faqs.map((f) => (f.id === item.id ? item : f));
                    setFaqs(updated);
                    dataStore.saveFAQs(updated);
                  } else if (type === "community") {
                    const updated = isNew
                      ? [item, ...communityStories]
                      : communityStories.map((s) =>
                          s.id === item.id ? item : s,
                        );
                    setCommunityStories(updated);
                    dataStore.saveCommunityStories(updated);
                  } else if (type === "testimonial") {
                    const updated = isNew
                      ? [item, ...testimonials]
                      : testimonials.map((t) => (t.id === item.id ? item : t));
                    setTestimonials(updated);
                    dataStore.saveTestimonials(updated);
                  } else if (type === "resource") {
                    const updated = isNew
                      ? [item, ...resources]
                      : resources.map((r) => (r.id === item.id ? item : r));
                    setResources(updated);
                    dataStore.saveResources(updated);
                  } else if (type === "capability") {
                    const updated = capabilities.map((c) =>
                      c.id === item.id ? item : c,
                    );
                    setCapabilities(updated);
                    dataStore.saveCapabilities(updated);
                  } else if (type === "partner") {
                    const updated = isNew
                      ? [item, ...partnerCards]
                      : partnerCards.map((p) => (p.id === item.id ? item : p));
                    setPartnerCards(updated);
                    dataStore.savePartnerCards(updated);
                  } else if (type === "quiz") {
                    const updated = isNew
                      ? [...quizQuestions, item]
                      : quizQuestions.map((q) => (q.id === item.id ? item : q));
                    setQuizQuestions(updated);
                    dataStore.saveQuizQuestions(updated);
                  }
                  setEditModal(null);
                  showToast("Changes saved & synced to Supabase.");
                }}
                className="px-5 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-[var(--primary)]/20"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
