import React from 'react';

export function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconClick,
  disabled = false,
  className = '',
  required = false,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-300 tracking-wide">
          {label} {required && <span className="text-brand-400">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full rounded-xl text-sm transition-all duration-200
            glass-input text-slate-100 placeholder-slate-500
            ${LeftIcon ? 'pl-10' : 'pl-3.5'}
            ${RightIcon ? 'pr-10' : 'pr-3.5'}
            py-2.5
            ${error ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            tabIndex={onRightIconClick ? 0 : -1}
            className={`absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors ${
              !onRightIconClick ? 'pointer-events-none' : 'cursor-pointer'
            }`}
          >
            <RightIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
      {helperText && !error && <span className="text-xs text-slate-400">{helperText}</span>}
    </div>
  );
}
