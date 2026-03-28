import { useState, useCallback, useRef } from 'react'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import InspectorPanel from './components/InspectorPanel'
import ChatPage from './components/ChatPage'
import { nodes, edges, simulationSteps } from './data/workflow'

export default function App() {
  const [page, setPage] = useState('workflow') // 'workflow' | 'chat'
  const [nodeStatuses, setNodeStatuses] = useState({})
  const [activeEdges, setActiveEdges] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [activeNodeId, setActiveNodeId] = useState(null)
  const timeoutsRef = useRef([])

  const activateEdgesFor = useCallback((completedNodeIds) => {
    setActiveEdges((prev) => {
      const newEdges = edges.filter(
        (e) => completedNodeIds.includes(e.from)
      )
      return [...prev, ...newEdges]
    })
  }, [])

  const runSimulation = useCallback(() => {
    setIsRunning(true)
    setIsComplete(false)
    setNodeStatuses({})
    setActiveEdges([])
    setActiveNodeId(null)

    const totalDuration =
      simulationSteps[simulationSteps.length - 1].delay +
      simulationSteps[simulationSteps.length - 1].duration

    simulationSteps.forEach((step) => {
      const t1 = setTimeout(() => {
        setNodeStatuses((prev) => {
          const next = { ...prev }
          step.nodeIds.forEach((id) => { next[id] = 'running' })
          return next
        })
        setActiveNodeId(step.nodeIds[0])
      }, step.delay)

      const t2 = setTimeout(() => {
        setNodeStatuses((prev) => {
          const next = { ...prev }
          step.nodeIds.forEach((id) => { next[id] = 'completed' })
          return next
        })
        activateEdgesFor(step.nodeIds)
      }, step.delay + step.duration)

      timeoutsRef.current.push(t1, t2)
    })

    const t3 = setTimeout(() => {
      setIsRunning(false)
      setIsComplete(true)
    }, totalDuration)
    timeoutsRef.current.push(t3)
  }, [activateEdgesFor])

  const resetSimulation = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setNodeStatuses({})
    setActiveEdges([])
    setIsRunning(false)
    setIsComplete(false)
    setActiveNodeId(null)
  }, [])

  return (
    <div className="flex h-screen w-screen flex-col bg-surface font-sans text-on-surface">
      <TopBar page={page} onPageChange={setPage} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar page={page} onPageChange={setPage} />

        {page === 'workflow' ? (
          <div className="flex flex-1 flex-col overflow-hidden">
            <Canvas
              nodes={nodes}
              edges={edges}
              activeEdges={activeEdges}
              nodeStatuses={nodeStatuses}
              selectedNodeId={activeNodeId}
              onRun={runSimulation}
              onReset={resetSimulation}
              isRunning={isRunning}
              isComplete={isComplete}
            />
            <InspectorPanel activeNodeId={activeNodeId} nodeStatuses={nodeStatuses} />
          </div>
        ) : (
          <ChatPage />
        )}
      </div>
    </div>
  )
}
