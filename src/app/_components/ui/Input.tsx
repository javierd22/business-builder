import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helpText?: string;
  error?: string;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helpText, error, className = "", ...props }, ref) => {
    const inputId = React.useId();
    const helpId = React.useId();
    const errorId = React.useId();

    const inputClasses = `
      w-full px-4 py-3 rounded-xl border transition-all duration-200
      bg-white placeholder:text-text-muted text-text-DEFAULT
      focus:outline-none focus:ring-2 focus:ring-ring-gold focus:border-ring-gold
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error 
        ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
        : "border-metal-silverLight"
      }
      ${className}
    `.trim();

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text-DEFAULT">
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-describedby={helpText ? helpId : error ? errorId : undefined}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />
        
        {helpText && !error && (
          <p id={helpId} className="text-sm text-text-muted">
            {helpText}
          </p>
        )}
        
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";