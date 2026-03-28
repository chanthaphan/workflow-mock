const variants = {
  primary:
    'btn-gradient text-white font-semibold hover:brightness-110 active:brightness-95',
  secondary:
    'bg-tertiary text-white hover:brightness-110 active:brightness-95',
  tertiary:
    'bg-transparent text-on-surface-variant hover:bg-surface-container-high active:bg-surface-container-highest',
}

export default function Button({ variant = 'primary', children, className = '', ...props }) {
  return (
    <button
      className={`rounded-inner px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
