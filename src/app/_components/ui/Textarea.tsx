import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helpText?: string;
  error?: string;
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helpText, error, className = "", ...props }, ref) => {
    const textareaId = React.useId();
    const helpId = React.useId();
    const errorId = React.useId();

    const textareaClasses = `
      w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-y
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
          <label htmlFor={textareaId} className="block text-sm font-medium text-text-DEFAULT">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClasses}
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

Textarea.displayName = "Textarea";