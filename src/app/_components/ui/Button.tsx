import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BaseButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "ghost";
}

interface ButtonProps extends BaseButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

interface LinkButtonProps extends BaseButtonProps {
  href: string;
}

type CombinedButtonProps = ButtonProps | LinkButtonProps;

const sizeClasses = {
  small: "px-3 py-1.5 text-sm",
  medium: "px-4 py-2 text-sm",
  large: "px-6 py-3 text-base",
};

const variantClasses = {
  primary: "bg-[#D4AF37] text-[#1F2937] hover:bg-[#B4891E] shadow-sm",
  secondary: "bg-white text-[#1F2937] border border-[#E5E9EF] hover:bg-[#F4EDE2] shadow-sm",
  ghost: "bg-transparent text-[#6B7280] hover:bg-[#F4EDE2] hover:text-[#1F2937]",
};

export function Button(props: CombinedButtonProps) {
  const {
    children,
    className = "",
    disabled = false,
    isLoading = false,
    size = "medium",
    variant = "primary",
  } = props;

  const baseClasses = cn(
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  if ("href" in props) {
    return (
      <Link
        href={props.href}
        className={baseClasses}
        aria-disabled={disabled}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </Link>
    );
  }

  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      disabled={disabled || isLoading}
      className={baseClasses}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
