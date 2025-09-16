import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white border border-metal-silverLight rounded-2xl shadow-soft p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, as: Component = "h2", className = "" }: CardTitleProps) {
  return (
    <Component className={`text-xl font-bold text-text-DEFAULT ${className}`}>
      {children}
    </Component>
  );
}

export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return (
    <p className={`text-text-muted mt-2 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`mt-6 pt-6 border-t border-metal-silverLight ${className}`}>
      {children}
    </div>
  );
}