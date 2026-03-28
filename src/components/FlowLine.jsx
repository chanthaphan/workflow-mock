function buildPath(x1, y1, x2, y2, direction) {
  if (direction === 'down') {
    const midY = (y1 + y2) / 2
    return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`
  }
  if (direction === 'up') {
    const midY = (y1 + y2) / 2
    return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`
  }
  if (direction === 'left') {
    const midX = (x1 + x2) / 2
    return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`
  }
  // right (default)
  const midX = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`
}

export default function FlowLine({ x1, y1, x2, y2, active, direction = 'right' }) {
  const d = buildPath(x1, y1, x2, y2, direction)

  return (
    <>
      {/* Glow layer (rendered behind the main path) */}
      {active && (
        <path
          d={d}
          fill="none"
          stroke="#2563eb"
          strokeOpacity={0.3}
          strokeWidth={8}
          strokeLinecap="round"
        />
      )}
      {/* Main path */}
      <path
        d={d}
        fill="none"
        stroke={active ? '#2563eb' : '#94a3b8'}
        strokeOpacity={active ? 1 : 0.5}
        strokeWidth={active ? 2.5 : 2}
        strokeLinecap="round"
        style={{ transition: 'stroke 0.6s ease, stroke-opacity 0.6s ease, stroke-width 0.4s ease' }}
      />
      {/* Animated dot */}
      {active && (
        <circle r="4" fill="#2563eb" opacity="0.9">
          <animateMotion dur="1.5s" repeatCount="indefinite" path={d} />
        </circle>
      )}
    </>
  )
}
