"use client";

const variants = {
  positive: "bg-emerald-light text-emerald-dark",
  negative: "bg-red-light text-red",
  neutral: "bg-slate-100 text-slate-600",
  accent: "bg-emerald/10 text-emerald-dark",
  default: "bg-slate-100 text-slate-700",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
