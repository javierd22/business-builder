import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className = "", type = "text", ...props }, ref) => {
    const id = props.id || `input-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={id}
            className="block text-sm font-medium text-[#1F2937]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={id}
          className={cn(
            "w-full px-3 py-2 border border-[#E5E9EF] rounded-lg shadow-sm",
            "bg-white text-[#1F2937] placeholder:text-[#6B7280]",
            "focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F4EDE2]",
            error && "border-red-300 focus:ring-red-500 focus:border-red-500",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${id}-error` : helpText ? `${id}-help` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={`${id}-help`} className="text-sm text-[#6B7280]">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
