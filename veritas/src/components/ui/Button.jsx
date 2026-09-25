const VARIANTS = {
  primary:
    'bg-signal text-ink-950 hover:bg-cyan-300 disabled:bg-signal/40 disabled:text-ink-950/60',
  ghost:
    'border border-line bg-ink-800/60 text-frost hover:border-signal/50 hover:text-signal disabled:opacity-50',
  quiet: 'text-mist hover:text-frost disabled:opacity-50',
  danger:
    'border border-verdict-false/30 text-verdict-false hover:bg-verdict-false/10 disabled:opacity-50',
};

const SIZES = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
        'transition-colors duration-150 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Component>
  );
}
