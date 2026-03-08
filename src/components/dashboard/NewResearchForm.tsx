"use client";

import { useState } from "react";

interface NewResearchFormProps {
  onSubmit: (companyName: string, role?: string) => void;
  isLoading: boolean;
}

export function NewResearchForm({ onSubmit, isLoading }: NewResearchFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [showRole, setShowRole] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    onSubmit(companyName.trim(), role.trim() || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="space-y-3">
        <div>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name..."
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-navy placeholder-slate-400 outline-none transition-colors focus:border-emerald focus:ring-2 focus:ring-emerald/20"
            disabled={isLoading}
            autoFocus
          />
        </div>

        {showRole ? (
          <div>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role you're applying for (optional)"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-navy placeholder-slate-400 outline-none transition-colors focus:border-emerald focus:ring-2 focus:ring-emerald/20"
              disabled={isLoading}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowRole(true)}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            + Add specific role
          </button>
        )}

        <button
          type="submit"
          disabled={!companyName.trim() || isLoading}
          className="w-full rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Researching...
            </span>
          ) : (
            "Start Research"
          )}
        </button>
      </div>
    </form>
  );
}
