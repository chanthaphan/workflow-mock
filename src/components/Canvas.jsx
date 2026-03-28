import AINode from './AINode'
import FlowLines from './FlowLines'
import Button from './Button'
import StatusBadge from './StatusBadge'

export default function Canvas({ nodes, edges, activeEdges, nodeStatuses, selectedNodeId, onRun, onReset, isRunning, isComplete }) {
  return (
    <div className="relative flex-1 overflow-auto bg-surface dot-grid">
      {/* Toolbar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-xl font-bold text-on-surface">
            Banking Service Application Pipeline
          </h1>
          {isRunning && <StatusBadge status="running" />}
          {isComplete && <StatusBadge status="completed" />}
          {!isRunning && !isComplete && <StatusBadge status="idle" />}
        </div>
      </div>

      {/* Pinned action button – top right */}
      <div className="absolute top-2 right-4 z-20">
        {isComplete ? (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Reset
          </button>
        ) : (
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-2 btn-gradient text-white px-5 py-2 rounded-full text-xs font-semibold shadow-ambient-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <span className="h-1 w-1 rounded-full bg-white animate-bounce-dot" style={{ animationDelay: '0s' }} />
                <span className="h-1 w-1 rounded-full bg-white animate-bounce-dot" style={{ animationDelay: '0.15s' }} />
                <span className="h-1 w-1 rounded-full bg-white animate-bounce-dot" style={{ animationDelay: '0.3s' }} />
                Processing...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                Submit Request
              </>
            )}
          </button>
        )}
      </div>

      {/* Flow lines (SVG layer) */}
      <FlowLines edges={edges} nodes={nodes} activeEdges={activeEdges} />

      {/* Nodes */}
      {nodes.map((node) => (
        <AINode
          key={node.id}
          node={node}
          status={nodeStatuses[node.id] || 'idle'}
          selected={node.id === selectedNodeId}
        />
      ))}
    </div>
  )
}
