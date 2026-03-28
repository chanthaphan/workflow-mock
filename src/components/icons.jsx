const s = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function UserSubmitIcon(props) {
  return (
    <svg {...s} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6" />
      <path d="M22 11h-6" />
    </svg>
  )
}

export function FolderSearchIcon(props) {
  return (
    <svg {...s} {...props}>
      <path d="M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2A2 2 0 0 0 12.07 6H20a2 2 0 0 1 2 2v4" />
      <circle cx="17" cy="17" r="3" />
      <path d="m21 21-1.5-1.5" />
    </svg>
  )
}

export function DocumentScanIcon(props) {
  return (
    <svg {...s} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
      <circle cx="8" cy="13" r="0" />
    </svg>
  )
}

export function UserCheckIcon(props) {
  return (
    <svg {...s} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  )
}

export function BarChartIcon(props) {
  return (
    <svg {...s} {...props}>
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7" width="4" height="14" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  )
}

export function CheckCircleIcon(props) {
  return (
    <svg {...s} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export function BellNotifyIcon(props) {
  return (
    <svg {...s} {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      <path d="M19 2l2 2-2 2" />
    </svg>
  )
}

// Navigation icons
export function DashboardIcon(props) {
  return (
    <svg {...s} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

export function ApplicationsIcon(props) {
  return (
    <svg {...s} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12 12v6" />
      <path d="M9 15h6" />
    </svg>
  )
}

export function CustomersIcon(props) {
  return (
    <svg {...s} {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function ReportsIcon(props) {
  return (
    <svg {...s} {...props}>
      <path d="M3 3v18h18" />
      <path d="M7 16l4-8 4 4 4-8" />
    </svg>
  )
}

export function SettingsIcon(props) {
  return (
    <svg {...s} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

export function BellIcon(props) {
  return (
    <svg {...s} {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export function ChevronDownIcon(props) {
  return (
    <svg {...s} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export const nodeIcons = {
  userSubmit: UserSubmitIcon,
  folderSearch: FolderSearchIcon,
  documentScan: DocumentScanIcon,
  userCheck: UserCheckIcon,
  barChart: BarChartIcon,
  checkCircle: CheckCircleIcon,
  bellNotify: BellNotifyIcon,
}
