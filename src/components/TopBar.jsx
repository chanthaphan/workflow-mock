import { BellIcon } from './icons'

function WorkflowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="9" y="15" width="6" height="6" rx="1" />
      <path d="M6 9v3a1 1 0 0 0 1 1h4" />
      <path d="M18 9v3a1 1 0 0 1-1 1h-4" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
    </svg>
  )
}

export default function TopBar({ page, onPageChange }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between bg-surface-container-low px-8">
      <div className="flex items-center gap-3 ml-4">
        <img
          src="/bbl-logo.png"
          alt="Bangkok Bank"
          className="h-9 rounded-lg object-contain"
        />
        <span className="font-display text-lg font-bold text-on-surface">
          Bangkok Bank AI Application Mock Up
        </span>

        {/* page tabs */}
        <div className="ml-6 flex items-center gap-1 rounded-2xl bg-surface-container p-1 shadow-inner ring-1 ring-outline-variant/10">
          <button
            onClick={() => onPageChange('workflow')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
              page === 'workflow'
                ? 'bg-white text-primary shadow-[0_1px_6px_rgba(37,99,235,0.12)] ring-1 ring-primary/10'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
            }`}
          >
            <WorkflowIcon />
            Workflow
          </button>
          <button
            onClick={() => onPageChange('chat')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
              page === 'chat'
                ? 'bg-white text-primary shadow-[0_1px_6px_rgba(37,99,235,0.12)] ring-1 ring-primary/10'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
            }`}
          >
            <ChatIcon />
            AI Chat
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-on-surface-variant transition-colors hover:text-on-surface">
          <BellIcon />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-xs font-semibold text-on-surface-variant">
          AT
        </div>
      </div>
    </header>
  )
}
