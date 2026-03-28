import { nodeIcons } from './icons'
import StatusBadge from './StatusBadge'
import { NODE_WIDTH, NODE_HEIGHT } from '../data/workflow'

const typeLabels = {
  source: 'Customer',
  retrieval: 'Data Retrieval',
  ocr: 'AI Agent - OCR',
  identity: 'AI Agent - KYC',
  summary: 'Analysis',
  approval: 'Decision',
  notify: 'Notification',
}

const isAgentNode = (type) => type === 'ocr' || type === 'identity'

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 mt-1">
      <span className="text-[10px] text-primary font-medium">AI is processing</span>
      <span
        className="h-1 w-1 rounded-full bg-primary animate-bounce-dot"
        style={{ animationDelay: '0s' }}
      />
      <span
        className="h-1 w-1 rounded-full bg-primary animate-bounce-dot"
        style={{ animationDelay: '0.2s' }}
      />
      <span
        className="h-1 w-1 rounded-full bg-primary animate-bounce-dot"
        style={{ animationDelay: '0.4s' }}
      />
    </div>
  )
}

export default function AINode({ node, status = 'idle', selected }) {
  const Icon = nodeIcons[node.icon]
  const showLLM = isAgentNode(node.type) && status === 'running'

  return (
    <div
      className={`absolute flex flex-col items-center justify-center glass rounded-outer p-3 transition-all duration-500 ${
        selected
          ? 'ring-2 ring-primary/50 shadow-ambient-lg'
          : status === 'running'
          ? 'ring-2 ring-primary/30 animate-pulse-ring shadow-ambient-lg'
          : 'shadow-ambient hover:shadow-ambient-lg'
      }`}
      style={{
        left: node.x,
        top: node.y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-inner transition-colors duration-500 ${
          status === 'completed'
            ? 'bg-tertiary/15 text-tertiary'
            : status === 'running'
            ? 'bg-primary/15 text-primary'
            : 'bg-surface-container-high text-on-surface-variant'
        }`}>
          {Icon && <Icon />}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-on-surface leading-tight">
            {node.name}
          </div>
          <div className="text-[11px] text-on-surface-variant">
            {typeLabels[node.type] || node.type}
          </div>
        </div>
      </div>

      {/* Bouncing dots for AI agent nodes, normal status badge for others */}
      {showLLM ? (
        <ThinkingDots />
      ) : (
        <div className="mt-1.5">
          <StatusBadge status={status} />
        </div>
      )}
    </div>
  )
}
