import { nodes, nodeDetails } from '../data/workflow'
import { nodeIcons } from './icons'
import StatusBadge from './StatusBadge'

function FinancialDataCard({ data }) {
  return (
    <div className="rounded-inner bg-surface-container-lowest p-3 ghost-border space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">Total Income</span>
        <span className="text-sm font-semibold text-on-surface">
          {data.totalIncome} <span className="text-[10px] text-on-surface-variant">{data.currency}</span>
        </span>
      </div>
      <div className="h-px bg-outline-variant/20" />
      <div className="flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">Total Expense</span>
        <span className="text-sm font-semibold text-on-surface">
          {data.totalExpense} <span className="text-[10px] text-on-surface-variant">{data.currency}</span>
        </span>
      </div>
      <div className="h-px bg-outline-variant/20" />
      <div className="flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">Ability to Pay</span>
        <span className="text-sm font-bold text-tertiary">
          {data.abilityToPay} <span className="text-[10px] font-normal text-on-surface-variant">{data.currency}</span>
        </span>
      </div>
    </div>
  )
}

function DetailsList({ details }) {
  return (
    <div className="rounded-inner bg-surface-container-lowest p-3 ghost-border">
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
        {details.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">{item.label}</span>
            <span className="text-xs font-semibold text-on-surface">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatsGrid({ stats }) {
  return (
    <div className="flex gap-2">
      {[
        { label: 'Tokens', value: stats.tokens },
        { label: 'Latency', value: stats.latency },
        { label: 'Cost', value: stats.cost },
      ].map((stat) => (
        <div
          key={stat.label}
          className="rounded-inner bg-surface-container-lowest px-3 py-2 text-center ghost-border"
        >
          <div className="text-sm font-semibold text-on-surface font-display">{stat.value}</div>
          <div className="text-[9px] uppercase tracking-wider text-on-surface-variant">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

export default function InspectorPanel({ activeNodeId, nodeStatuses }) {
  const node = nodes.find((n) => n.id === activeNodeId)
  const detail = activeNodeId ? nodeDetails[activeNodeId] : null
  const status = nodeStatuses?.[activeNodeId] || 'idle'

  if (!node || !detail) {
    return (
      <div className="shrink-0 h-[180px] bg-surface-container-low flex items-center justify-center">
        <p className="text-sm text-on-surface-variant">
          Click <span className="font-semibold text-primary">Submit Request</span> to start the loan application pipeline
        </p>
      </div>
    )
  }

  const Icon = nodeIcons[node.icon]

  return (
    <div className="shrink-0 h-[180px] bg-surface-container-low overflow-hidden">
      <div className="flex h-full gap-6 px-6 py-4">
        {/* Left: Header + Description */}
        <div className="flex flex-col justify-center w-[280px] shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className={`flex h-9 w-9 items-center justify-center rounded-inner transition-colors duration-500 ${
              status === 'completed'
                ? 'bg-tertiary/15 text-tertiary'
                : status === 'running'
                ? 'bg-primary/15 text-primary'
                : 'bg-surface-container-high text-on-surface-variant'
            }`}>
              {Icon && <Icon />}
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-on-surface leading-tight">
                {node.name}
              </h2>
              <span className="text-[11px] text-on-surface-variant">{detail.subtitle}</span>
            </div>
          </div>
          <StatusBadge status={status} />
          <p className="mt-2 text-[11px] leading-relaxed text-on-surface-variant line-clamp-3">
            {detail.description}
          </p>
        </div>

        {/* Vertical divider */}
        <div className="w-px bg-outline-variant/20 shrink-0" />

        {/* Middle: Financial Data or Details */}
        <div className="flex flex-col justify-center min-w-[240px]">
          {detail.financialData && (
            <div>
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                {activeNodeId === 'doc-processing' ? 'Extracted Financial Data (OCR)' : 'Financial Assessment'}
              </h3>
              <FinancialDataCard data={detail.financialData} />
            </div>
          )}
          {detail.details && !detail.financialData && (
            <div>
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                {activeNodeId === 'approval' ? 'Approval Result' : 'Details'}
              </h3>
              <DetailsList details={detail.details} />
            </div>
          )}
          {detail.financialData && detail.details && (
            <div className="mt-2">
              <DetailsList details={detail.details} />
            </div>
          )}
        </div>

        {/* Vertical divider */}
        {(detail.model || detail.stats) && <div className="w-px bg-outline-variant/20 shrink-0" />}

        {/* Right: Agent Config + Stats */}
        {(detail.model || detail.stats) && (
          <div className="flex flex-col justify-center gap-3">
            {detail.model && (
              <div>
                <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  Agent
                </h3>
                <div className="flex items-center gap-3">
                  <div className="rounded-inner bg-surface-container-lowest ghost-border px-3 py-1.5 text-xs text-on-surface">
                    {detail.model}
                  </div>
                  {detail.confidence && (
                    <span className="text-xs font-medium text-tertiary">{detail.confidence}</span>
                  )}
                </div>
              </div>
            )}
            {detail.stats && (
              <div>
                <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  Stats
                </h3>
                <StatsGrid stats={detail.stats} />
              </div>
            )}
          </div>
        )}

        {/* Approval banner */}
        {detail.result === 'approved' && status === 'completed' && (
          <>
            <div className="w-px bg-outline-variant/20 shrink-0" />
            <div className="flex items-center justify-center px-6">
              <div className="rounded-inner bg-tertiary/10 px-8 py-4 text-center">
                <div className="text-2xl font-display font-bold text-tertiary">Approved!</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
