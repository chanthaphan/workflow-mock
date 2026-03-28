const config = {
  running: {
    dot: 'bg-primary animate-pulse-dot',
    text: 'text-primary',
    bg: 'bg-primary/10',
    label: 'Processing...',
  },
  completed: {
    dot: 'bg-tertiary',
    text: 'text-tertiary',
    bg: 'bg-tertiary/10',
    label: 'Completed',
  },
  error: {
    dot: 'bg-error',
    text: 'text-error',
    bg: 'bg-error/10',
    label: 'Error',
  },
  idle: {
    dot: 'border border-on-surface-variant/40 bg-transparent',
    text: 'text-on-surface-variant',
    bg: 'bg-surface-container-high',
    label: 'Waiting',
  },
}

export default function StatusBadge({ status }) {
  const c = config[status] || config.idle
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}
