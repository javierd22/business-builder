"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}>({
  isOpen: false,
  setIsOpen: () => {},
  triggerRef: React.createRef<HTMLButtonElement | null>()
});

export function Select({ value, onValueChange, children, disabled, className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen, triggerRef }}>
      <div className={cn('relative', className)}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className, ...props }: SelectTriggerProps) {
  const { isOpen, setIsOpen, triggerRef } = React.useContext(SelectContext);

  return (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="select-content"
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-[#E5D5B7] bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#F7DC6F] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectContent({ children, className }: SelectContentProps) {
  const { isOpen } = React.useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <div
      id="select-content"
      role="listbox"
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-[#E5D5B7] bg-white p-1 text-[#8B6914] shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, children, className, ...props }: SelectItemProps) {
  const { value: selectedValue, onValueChange, setIsOpen } = React.useContext(SelectContext);

  const handleClick = () => {
    onValueChange?.(value);
    setIsOpen(false);
  };

  return (
    <div
      role="option"
      aria-selected={selectedValue === value}
      onClick={handleClick}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-[#F5F0E8] focus:bg-[#F5F0E8] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        selectedValue === value && 'bg-[#F5F0E8]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
  const { value } = React.useContext(SelectContext);

  return (
    <span className={cn('block truncate', className)}>
      {value || placeholder}
    </span>
  );
}
