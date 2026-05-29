import React from 'react';

export const Card = ({ children, className = '', ...props }: any) => (
  <div className={`bg-white rounded-2xl border border-border/80 shadow-sm p-4 ${className}`} {...props}>{children}</div>
);

export const FI = ({ children, variant = 'gray', size = 'md', className = '' }: any) => {
  const sizeClasses = {
    md: 'w-7 h-7 rounded-lg text-[15px]',
    sm: 'w-[22px] h-[22px] rounded-md text-xs',
    xs: 'w-[18px] h-[18px] rounded-[5px] text-[10px]'
  };
  const variantClasses = {
    pur: 'bg-gradient-to-br from-violet-500 to-fuchsia-400 text-white shadow-[0_3px_8px_rgba(139,92,246,0.25)]',
    teal: 'bg-gradient-to-br from-teal-600 to-teal-400 text-white shadow-[0_3px_8px_rgba(13,148,136,0.25)]',
    amb: 'bg-gradient-to-br from-amber-600 to-amber-400 text-white shadow-[0_3px_8px_rgba(217,119,6,0.25)]',
    blu: 'bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-[0_3px_8px_rgba(37,99,235,0.25)]',
    cor: 'bg-gradient-to-br from-rose-600 to-rose-400 text-white shadow-[0_3px_8px_rgba(225,29,72,0.25)]',
    grn: 'bg-gradient-to-br from-emerald-600 to-emerald-400 text-white shadow-[0_3px_8px_rgba(5,150,105,0.25)]',
    pnk: 'bg-gradient-to-br from-pink-600 to-pink-400 text-white shadow-[0_3px_8px_rgba(219,39,119,0.25)]',
    gray: 'bg-gradient-to-br from-gray-600 to-gray-400 text-white shadow-[0_3px_8px_rgba(75,85,99,0.25)]',
  };
  return <div className={`flex items-center justify-center shrink-0 border-none ${sizeClasses[size as keyof typeof sizeClasses]} ${variantClasses[variant as keyof typeof variantClasses]} ${className}`}>{children}</div>;
};

export const Tag = ({ children, variant = 'tg', className = '' }: any) => {
  const variantClasses = {
    tg: 'bg-green-50 text-green-800',
    tb2: 'bg-blue-50 text-blue-600',
    ta: 'bg-orange-50 text-orange-600',
    tp: 'bg-indigo-50 text-accent',
    tc: 'bg-red-50 text-red-600'
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${variantClasses[variant as keyof typeof variantClasses]} ${className}`}>{children}</span>;
}

export const Dot = ({ color = 'sg' }: { color?: string }) => {
  const colors = {
    sg: 'bg-emerald-500',
    sy: 'bg-amber-500',
    sr: 'bg-red-500',
    sd: 'bg-gray-400'
  };
  return <div className={`w-[7px] h-[7px] rounded-full shrink-0 ${colors[color as keyof typeof colors]}`}></div>;
}

export const Btn = ({ children, variant = 'default', size = 'md', className = '', ...props }: any) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-[3px] text-[10px] rounded-md' : 'px-[11px] py-[5px] text-[11px] rounded-lg';
  const variantClasses = variant === 'pur' 
    ? 'bg-gradient-to-br from-accent to-blue-400 text-white border-none shadow-[0_2px_6px_rgba(55,138,221,0.25)] hover:shadow-[0_4px_10px_rgba(55,138,221,0.35)]'
    : 'bg-white border border-border text-gray-900 hover:bg-hover';
  return <button className={`inline-flex items-center justify-center gap-1.5 font-medium transition-all cursor-pointer whitespace-nowrap ${sizeClasses} ${variantClasses} ${className}`} {...props}>{children}</button>
}

export const Toggle = ({ on, onClick }: any) => (
  <div onClick={onClick} className={`w-9 h-5 rounded-full relative cursor-pointer shrink-0 transition-colors ${on ? 'bg-accent' : 'bg-gray-300'}`}>
    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${on ? 'right-0.5' : 'left-0.5'}`}></div>
  </div>
);
