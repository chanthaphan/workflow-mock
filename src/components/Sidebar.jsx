import {
  DashboardIcon,
  ApplicationsIcon,
  CustomersIcon,
  ReportsIcon,
  SettingsIcon,
} from './icons'

/* Chat icon */
function ChatIcon(props) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

const navItems = [
  { icon: DashboardIcon, label: 'Dashboard', page: null },
  { icon: ApplicationsIcon, label: 'Workflow', page: 'workflow' },
  { icon: ChatIcon, label: 'AI Chat', page: 'chat' },
  { icon: CustomersIcon, label: 'Customers', page: null },
  { icon: ReportsIcon, label: 'Reports', page: null },
  { icon: SettingsIcon, label: 'Settings', page: null },
]

export default function Sidebar({ page, onPageChange }) {
  return (
    <nav className="flex w-[60px] shrink-0 flex-col items-center bg-surface-container-low py-4">
      <div className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const isActive = item.page && item.page === page
          return (
            <button
              key={item.label}
              title={item.label}
              onClick={() => item.page && onPageChange(item.page)}
              className={`flex h-10 w-10 items-center justify-center rounded-inner transition-colors duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <item.icon />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
