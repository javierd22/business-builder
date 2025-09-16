import React from "react";
import { cn } from "@/lib/utils";

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
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
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
    <div
      className={cn(
        "bg-white border border-[#E5E9EF] rounded-xl shadow-sm p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ 
  children, 
  className = "", 
  as: Component = "h3" 
}: CardTitleProps) {
  return (
    <Component 
      className={cn("text-lg font-semibold text-[#1F2937]", className)}
    >
      {children}
    </Component>
  );
}

export function CardDescription({ 
  children, 
  className = "" 
}: CardDescriptionProps) {
  return (
    <p className={cn("text-sm text-[#6B7280] mt-1", className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-[#E5E9EF]", className)}>
      {children}
    </div>
  );
}
