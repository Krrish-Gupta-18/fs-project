import React from 'react';
import { getInitials } from '../../utils/formatters';

export function Avatar({
  src,
  name = 'User',
  status = null, // 'online' | 'away' | 'busy' | 'offline'
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className = '',
}) {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const badgeSizes = {
    xs: 'w-2 h-2 border',
    sm: 'w-2.5 h-2.5 border',
    md: 'w-3 h-3 border-2',
    lg: 'w-3.5 h-3.5 border-2',
    xl: 'w-4 h-4 border-2',
  };

  const statusColors = {
    online: 'bg-emerald-500 shadow-emerald-500/50',
    away: 'bg-amber-500 shadow-amber-500/50',
    busy: 'bg-rose-500 shadow-rose-500/50',
    offline: 'bg-slate-500 shadow-slate-500/50',
    active: 'bg-emerald-500 shadow-emerald-500/50',
  };

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-slate-800/80 shadow-md`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full bg-gradient-to-tr from-brand-700 to-violet-600 text-white font-bold flex items-center justify-center ring-2 ring-slate-800 shadow-md`}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-dark-950 shadow-sm ${
            badgeSizes[size]
          } ${statusColors[status] || statusColors.offline}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
}
