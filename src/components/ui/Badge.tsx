import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "active" | "draft" | "published" | "default";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variants = {
    active: "bg-emerald-100 text-emerald-700",
    published: "bg-blue-100 text-blue-700",
    draft: "bg-amber-100 text-amber-700",
    default: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
