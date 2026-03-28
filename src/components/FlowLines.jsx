import FlowLine from './FlowLine'
import { NODE_WIDTH, NODE_HEIGHT } from '../data/workflow'

function getAnchors(from, to) {
  const fcx = from.x + NODE_WIDTH / 2
  const fcy = from.y + NODE_HEIGHT / 2
  const tcx = to.x + NODE_WIDTH / 2
  const tcy = to.y + NODE_HEIGHT / 2

  const dx = tcx - fcx
  const dy = tcy - fcy
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)

  // Determine primary direction
  if (absDy > absDx) {
    // Vertical connection
    if (dy > 0) {
      // Going down
      return {
        x1: fcx, y1: from.y + NODE_HEIGHT,
        x2: tcx, y2: to.y,
        direction: 'down',
      }
    } else {
      // Going up
      return {
        x1: fcx, y1: from.y,
        x2: tcx, y2: to.y + NODE_HEIGHT,
        direction: 'up',
      }
    }
  } else {
    // Horizontal connection
    if (dx > 0) {
      // Going right
      return {
        x1: from.x + NODE_WIDTH, y1: fcy,
        x2: to.x, y2: tcy,
        direction: 'right',
      }
    } else {
      // Going left
      return {
        x1: from.x, y1: fcy,
        x2: to.x + NODE_WIDTH, y2: tcy,
        direction: 'left',
      }
    }
  }
}

export default function FlowLines({ edges, nodes, activeEdges }) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]))
  const activeSet = new Set(activeEdges.map((e) => `${e.from}-${e.to}`))

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      {edges.map((edge) => {
        const from = nodeMap[edge.from]
        const to = nodeMap[edge.to]
        if (!from || !to) return null

        const anchors = getAnchors(from, to)

        return (
          <FlowLine
            key={`${edge.from}-${edge.to}`}
            x1={anchors.x1}
            y1={anchors.y1}
            x2={anchors.x2}
            y2={anchors.y2}
            direction={anchors.direction}
            active={activeSet.has(`${edge.from}-${edge.to}`)}
          />
        )
      })}
    </svg>
  )
}
