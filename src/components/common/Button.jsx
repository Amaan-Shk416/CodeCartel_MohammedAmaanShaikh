import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-kaarya-purple to-kaarya-pink text-white hover:opacity-95 shadow-md shadow-kaarya-purple/20 focus:ring-kaarya-purple active:scale-95',
    secondary:
      'bg-kaarya-lavender text-kaarya-purple hover:bg-kaarya-purple/15 focus:ring-kaarya-purple',
    outline:
      'border border-gray-300 text-kaarya-navy hover:bg-gray-50 focus:ring-kaarya-purple',
    dark:
      'bg-kaarya-navy text-white hover:bg-kaarya-navy/90 focus:ring-kaarya-navy',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
