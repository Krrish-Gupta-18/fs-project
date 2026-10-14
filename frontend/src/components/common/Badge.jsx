import React from 'react';

export function Badge({
  children,
  variant = 'brand', // 'brand' | 'success' | 'warning' | 'danger' | 'neutral'
  size = 'md', // 'sm' | 'md'
  className = '',
}) {
  const variants = {
    brand: 'bg-brand-500/20 text-brand-300 border border-brand-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    danger: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px] rounded-full font-semibold',
    md: 'px-2 py-0.5 text-xs rounded-full font-medium',
  };

  return (
    <span
      className={`inline-flex items-center justify-center ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
