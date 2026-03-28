import { useState, useRef, useEffect, useCallback } from 'react'

/* ─── constants ─── */
const PROMPT_TEXT = `A corporate customer is looking to transfer fund from an entity in USA for its upcoming m&a deal in Thailand. What service and recommendation should i, as banking relationship officer, give to the company?`

const RESPONSE_PARTS = [
  { type: 'text', content: 'As the Relationship Officer, focus on three pillars: **Liquidity, Risk, and Compliance.**' },
  { type: 'heading', content: '1. Product Recommendations' },
  { type: 'bullet', content: '**USD FCD Account (Foreign Currency Deposit):** Allow the client to receive and hold USD in Thailand. This avoids immediate conversion and provides flexibility for timing the FX.' },
  { type: 'bullet', content: '**Escrow & Paying Agent:** The bank acts as a neutral third party, releasing the acquisition funds only when the Conditions Precedent (CPs) in the Sale and Purchase Agreement (SPA) are met.' },
  { type: 'bullet', content: '**FX Forward Contracts:** Lock in the USD/THB rate now to protect the client\'s acquisition budget from currency volatility during the deal\'s closing window.' },
  { type: 'heading', content: '2. Regulatory & Execution Roadmap' },
  { type: 'bullet', content: '**Documentary Evidence:** For transfers exceeding USD 200,000, the Bank of Thailand (BOT) requires the SPA or Board Resolutions to verify the "Purpose of Transfer."' },
  { type: 'bullet', content: '**Tax Compliance:** Advise the client to consult on withholding tax (WHT) implications for any cross-border advisory fees related to the deal.' },
  { type: 'heading', content: '3. Action Summary' },
  { type: 'table', content: [
    ['Objective', 'Service'],
    ['Inbound Transfer', 'USD FCD Account'],
    ['Price Protection', 'FX Forward Contract'],
    ['Deal Security', 'Escrow Service'],
  ]},
]

/* ─── Second conversation turn ─── */
const PROMPT_TEXT_2 = `บัตรทราเวลการ์ดมีสิทธิพิเศษอะไรบ้าง`

const RESPONSE_PARTS_2 = [
  { type: 'text', content: '**Bangkok Bank Travel Card** มีสิทธิประโยชน์สำหรับสายเที่ยวต่างประเทศดังนี้:' },
  { type: 'heading', content: '✈️ สิทธิประโยชน์' },
  { type: 'bullet', content: '**ฟรีค่าธรรมเนียมแรกเข้า** (จนถึงสิ้นปี 69) และ **ไม่มีค่ารายปี**' },
  { type: 'bullet', content: '**รองรับ 11 สกุลเงิน** — AUD, CAD, CNY, CHF, EUR, GBP, HKD, JPY, NZD, SGD และ USD สกุลอื่นๆ ก็ใช้ได้ แต่แค่แลกเก็บไว้ก่อนไม่ได้' },
  { type: 'bullet', content: '**เงินคืน 3%** เมื่อใช้จ่ายต่างประเทศ (สูงสุด 1,500 บาท)' },
  { type: 'bullet', content: '**Miracle Lounge ฟรี** เมื่อใช้จ่ายขั้นต่ำ 50,000 บาท' },
  { type: 'bullet', content: '**ส่วนลด AIS SIM2FLY** 200 บาท' },
  { type: 'heading', content: '💳 สรุปสิทธิประโยชน์' },
  { type: 'table', content: [
    ['สิทธิประโยชน์', 'รายละเอียด'],
    ['ค่าธรรมเนียม', 'ฟรีแรกเข้า + ไม่มีรายปี'],
    ['สกุลเงิน', '11 สกุลเงินหลัก'],
    ['เงินคืน', '3% (สูงสุด 1,500 บาท)'],
    ['Miracle Lounge', 'ฟรี เมื่อใช้ 50,000 บาท'],
    ['AIS SIM2FLY', 'ส่วนลด 200 บาท'],
  ]},
  { type: 'text', content: 'สมัครบัตรฟรีได้แล้ววันนี้ที่ **bangkokbank.com/th-TH/Personal/Cards/Travel-Card**' },
]

const SOURCES_2 = [
  { type: 'web', title: 'Bangkok Bank Travel Card', subtitle: 'bangkokbank.com' },
  { type: 'doc', title: 'Travel Card Product Guide', subtitle: 'Internal KB • 2026' },
  { type: 'web', title: 'BBL Travel Card สิทธิพิเศษ', subtitle: 'brandbuffet.in.th' },
]

/* ─── Thinking step data ─── */
const THINKING_STEPS = [
  { label: 'Analyzing query context...', duration: 300 },
  { label: 'Searching internal documents...', icon: 'doc', duration: 350 },
  { label: 'Retrieving web sources...', icon: 'web', duration: 400 },
  { label: 'Reasoning with Deep Think...', icon: 'brain', duration: 450 },
  { label: 'Composing response...', duration: 250 },
]

/* ─── phases ─── */
const PHASE = { LANDING: 'landing', TYPING: 'typing', TOGGLING: 'toggling', SENDING: 'sending', SENT: 'sent', THINKING: 'thinking', STREAMING: 'streaming', DONE: 'done' }

/* ─── icons ─── */
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13" /><path d="M22 2 15 22 11 13 2 9z" />
    </svg>
  )
}

function DocToggleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function WebIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
    </svg>
  )
}

function BrainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a6 6 0 0 0-6 6c0 1.66.68 3.16 1.76 4.24L12 16l4.24-3.76A6 6 0 0 0 12 2z" />
      <path d="M12 16v6" />
      <path d="M8 22h8" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

/* ─── sub-components ─── */

function ToggleChip({ icon, label, active, onClick, isBeingClicked }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
        isBeingClicked
          ? 'bg-primary/15 text-primary ring-2 ring-primary/40 scale-95'
          : active
            ? 'bg-primary/8 text-primary ring-1 ring-primary/20'
            : 'bg-surface-container-low text-on-surface-variant/60 hover:bg-surface-container hover:text-on-surface-variant'
      }`}
    >
      {icon}
      <span>{label}</span>
      <span className={`ml-0.5 h-1.5 w-1.5 rounded-full transition-all duration-200 ${active || isBeingClicked ? 'bg-primary' : 'bg-on-surface-variant/30'}`} />
    </button>
  )
}

function ThinkingPanel({ steps, currentStep }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-4 mb-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-on-surface mb-1">
        <div className="relative flex items-center justify-center">
          <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
            <SparkleIcon />
          </span>
          <span className="absolute inset-0 h-5 w-5 rounded-full animate-ping bg-primary/20" />
        </div>
        AI is thinking...
      </div>
      {steps.map((step, i) => {
        const done = i < currentStep
        const active = i === currentStep
        return (
          <div key={i} className={`flex items-center gap-2 text-xs transition-all duration-300 ${
            done ? 'text-tertiary' : active ? 'text-on-surface' : 'text-on-surface-variant/40'
          }`}>
            {done ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : active ? (
              <span className="flex items-center gap-0.5 shrink-0">
                <span className="h-1 w-1 rounded-full bg-primary animate-bounce-dot" style={{ animationDelay: '0s' }} />
                <span className="h-1 w-1 rounded-full bg-primary animate-bounce-dot" style={{ animationDelay: '0.15s' }} />
                <span className="h-1 w-1 rounded-full bg-primary animate-bounce-dot" style={{ animationDelay: '0.3s' }} />
              </span>
            ) : (
              <span className="h-3.5 w-3.5 rounded-full border border-outline-variant/40 shrink-0" />
            )}
            <span className={active ? 'font-medium' : ''}>{step.label}</span>
            {done && <span className="text-[10px] text-tertiary/60">Done</span>}
          </div>
        )
      })}
    </div>
  )
}

/* ─── markdown-ish renderer ─── */
function renderBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-on-surface">{part}</strong> : <span key={i}>{part}</span>
  )
}

function StreamedContent({ parts, visibleCount }) {
  return (
    <div className="space-y-2 text-sm text-on-surface leading-relaxed">
      {parts.slice(0, visibleCount).map((part, i) => {
        const isLast = i === visibleCount - 1
        if (part.type === 'heading') {
          return <h3 key={i} className="font-display font-bold text-on-surface mt-3 text-[15px]">{part.content}</h3>
        }
        if (part.type === 'bullet') {
          return (
            <div key={i} className="flex gap-2 pl-3">
              <span className="text-primary mt-1 shrink-0">•</span>
              <span className="text-on-surface-variant">{renderBold(part.content)}{isLast && <CursorBlink />}</span>
            </div>
          )
        }
        if (part.type === 'table') {
          const rows = part.content
          return (
            <div key={i} className="mt-2 overflow-hidden rounded-lg border border-outline-variant/20">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-surface-container-high">
                    {rows[0].map((h, hi) => (
                      <th key={hi} className="px-4 py-2 text-left font-semibold text-on-surface">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(1).map((row, ri) => (
                    <tr key={ri} className="border-t border-outline-variant/10">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-2 text-on-surface-variant">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        return <p key={i} className="text-on-surface-variant">{renderBold(part.content)}{isLast && <CursorBlink />}</p>
      })}
    </div>
  )
}

function CursorBlink() {
  return <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle animate-pulse" />
}

/* ─── source cards ─── */
function SourceCards() {
  const sources = [
    { type: 'doc', title: 'FX Forward Product Guide', subtitle: 'Internal KB • Updated Mar 2026' },
    { type: 'doc', title: 'BOT Regulation: Cross-border Transfer', subtitle: 'Compliance Library' },
    { type: 'web', title: 'Thailand M&A Regulatory Framework', subtitle: 'bangkokpost.com' },
  ]
  return (
    <div className="mt-4 pt-3 border-t border-outline-variant/15">
      <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/60 font-semibold mb-2">Sources</p>
      <div className="flex gap-2 flex-wrap">
        {sources.map((s, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg bg-surface-container px-3 py-1.5 text-[11px]">
            {s.type === 'doc' ? <DocToggleIcon /> : <WebIcon />}
            <div>
              <span className="font-medium text-on-surface">{s.title}</span>
              <span className="ml-1 text-on-surface-variant/60">{s.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


/* ════════════════════════════════════════════
   Main ChatPage
   ════════════════════════════════════════════ */
export default function ChatPage() {
  const [phase, setPhase] = useState(PHASE.LANDING)
  const [turn, setTurn] = useState(1) // 1 or 2
  const [inputText, setInputText] = useState('')
  const [toggles, setToggles] = useState({ doc: false, web: false, deep: false })
  const [activeToggle, setActiveToggle] = useState(null)
  const [thinkStep, setThinkStep] = useState(0)
  const [visibleParts, setVisibleParts] = useState(0)
  // Turn 2 state
  const [turn2Phase, setTurn2Phase] = useState('idle') // idle | typing | toggling | sending | thinking | streaming | done
  const [turn2ThinkStep, setTurn2ThinkStep] = useState(0)
  const [turn2VisibleParts, setTurn2VisibleParts] = useState(0)
  const [turn2InputText, setTurn2InputText] = useState('')

  const chatEndRef = useRef(null)
  const typeTimer = useRef(null)

  const currentPrompt = turn === 1 ? PROMPT_TEXT : PROMPT_TEXT_2
  const currentParts = turn === 1 ? RESPONSE_PARTS : RESPONSE_PARTS_2

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [phase, visibleParts, thinkStep, turn2Phase, turn2VisibleParts, turn2ThinkStep, scrollToBottom])

  /* ── Start turn 2 after turn 1 completes ── */
  useEffect(() => {
    if (phase === PHASE.DONE && turn === 1) {
      const t = setTimeout(() => startTurn2(), 1500)
      return () => clearTimeout(t)
    }
  }, [phase, turn])

  const startTurn2 = useCallback(() => {
    setTurn(2)
    // Type turn 2 prompt
    setTurn2Phase('typing')
    setTurn2InputText('')
    let i = 0
    const tick = () => {
      if (i < PROMPT_TEXT_2.length) {
        setTurn2InputText(PROMPT_TEXT_2.slice(0, i + 1))
        i++
        typeTimer.current = setTimeout(tick, 20)
      } else {
        setTimeout(() => {
          // Send turn 2
          setTurn2Phase('sending')
          setTimeout(() => {
            setTurn2Phase('thinking')
            // step through thinking
            let step = 0
            setTurn2ThinkStep(0)
            const advanceThink = () => {
              if (step < THINKING_STEPS.length - 1) {
                step++
                setTurn2ThinkStep(step)
                setTimeout(advanceThink, THINKING_STEPS[step].duration)
              } else {
                setTimeout(() => {
                  setTurn2Phase('streaming')
                  // stream turn 2 response
                  let count = 0
                  const streamTick = () => {
                    if (count < RESPONSE_PARTS_2.length) {
                      count++
                      setTurn2VisibleParts(count)
                      setTimeout(streamTick, 200 + Math.random() * 150)
                    } else {
                      setTurn2Phase('done')
                    }
                  }
                  streamTick()
                }, 300)
              }
            }
            setTimeout(advanceThink, THINKING_STEPS[0].duration)
          }, 300)
        }, 400)
      }
    }
    tick()
  }, [])

  /* ── Phase: sequentially click toggles ── */
  const startToggleSequence = useCallback(() => {
    setPhase(PHASE.TOGGLING)
    const toggleKeys = ['doc', 'web', 'deep']
    let idx = 0
    const nextToggle = () => {
      if (idx < toggleKeys.length) {
        const key = toggleKeys[idx]
        setActiveToggle(key)
        setTimeout(() => {
          setToggles((p) => ({ ...p, [key]: true }))
          setActiveToggle(null)
          idx++
          setTimeout(nextToggle, 80)
        }, 150)
      } else {
        setTimeout(() => {
          setPhase(PHASE.SENDING)
          setTimeout(() => handleSend(), 250)
        }, 200)
      }
    }
    setTimeout(nextToggle, 100)
  }, [])

  /* ── Phase: auto-type prompt ── */
  const startTyping = useCallback(() => {
    setPhase(PHASE.TYPING)
    setInputText('')
    setToggles({ doc: false, web: false, deep: false })
    setTurn(1)
    setTurn2Phase('idle')
    setTurn2VisibleParts(0)
    setTurn2ThinkStep(0)
    setTurn2InputText('')
    let i = 0
    const tick = () => {
      if (i < PROMPT_TEXT.length) {
        setInputText(PROMPT_TEXT.slice(0, i + 1))
        i++
        const delay = PROMPT_TEXT[i - 1] === ' ' ? 8 : 4
        typeTimer.current = setTimeout(tick, delay)
      } else {
        setTimeout(() => startToggleSequence(), 150)
      }
    }
    tick()
  }, [])

  /* ── Phase: send → thinking → streaming ── */
  const handleSend = useCallback(() => {
    setPhase(PHASE.THINKING)

    let step = 0
    setThinkStep(0)
    const advanceThink = () => {
      if (step < THINKING_STEPS.length - 1) {
        step++
        setThinkStep(step)
        setTimeout(advanceThink, THINKING_STEPS[step].duration)
      } else {
        setTimeout(() => {
          setPhase(PHASE.STREAMING)
          streamResponse()
        }, 300)
      }
    }
    setTimeout(advanceThink, THINKING_STEPS[0].duration)
  }, [])

  const streamResponse = useCallback(() => {
    let count = 0
    const tick = () => {
      if (count < RESPONSE_PARTS.length) {
        count++
        setVisibleParts(count)
        setTimeout(tick, 200 + Math.random() * 150)
      } else {
        setPhase(PHASE.DONE)
      }
    }
    tick()
  }, [])

  const toggle = (key) => setToggles((p) => ({ ...p, [key]: !p[key] }))

  const isLanding = phase === PHASE.LANDING
  const showChat = phase !== PHASE.LANDING

  // During toggling phase, show the input bar with prompt text visible
  const showInputText = phase === PHASE.TOGGLING || phase === PHASE.TYPING

  return (
    <div className="flex flex-1 flex-col overflow-hidden relative">
      {/* Start Demo – pinned top-right, outside app chrome */}
      {isLanding && (
        <button
          onClick={startTyping}
          className="absolute top-2 right-4 z-50 flex items-center gap-2 btn-gradient text-white px-5 py-2 rounded-full text-xs font-semibold shadow-ambient-lg hover:opacity-90 transition-opacity"
        >
          <PlayIcon />
          Start Demo
        </button>
      )}

      {/* ── Landing hero ── */}
      {isLanding && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8">
          <div className="flex items-center gap-2 text-primary">
            <SparkleIcon />
            <h1 className="font-display text-2xl font-bold text-on-surface">BBL Knowledge Assistant</h1>
          </div>
          <p className="max-w-md text-center text-sm text-on-surface-variant leading-relaxed">
            Your intelligent relationship officer assistant. Ask questions about banking products,
            regulatory requirements, and client advisory strategies.
          </p>

          {/* quick-start cards */}
          <div className="mt-2 grid grid-cols-3 gap-3 max-w-2xl w-full">
            {[
              { title: 'Cross-border Payments', desc: 'FX, remittance & compliance' },
              { title: 'Trade Finance', desc: 'LC, guarantees & supply chain' },
              { title: 'M&A Advisory', desc: 'Escrow, FCD & deal support' },
            ].map((c, i) => (
              <div key={i} className="rounded-xl bg-surface-container-low p-4 hover:bg-surface-container transition-colors cursor-pointer group">
                <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{c.title}</p>
                <p className="text-xs text-on-surface-variant mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Chat area ── */}
      {showChat && (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Chat header */}
          <div className="shrink-0 flex items-center justify-between px-8 py-3 border-b border-outline-variant/10 bg-surface-container-low/40 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <img src="/bbl-logo.png" alt="BBL" className="h-8 w-8 rounded-lg object-contain" />
              <div>
                <h2 className="font-display text-lg font-bold text-on-surface">BBL Knowledge Assistant</h2>
                <p className="text-[11px] text-on-surface-variant">Powered by Agentic AI · Documents, Web & Deep Think enabled</p>
              </div>
            </div>
            <button
              onClick={() => { setPhase(PHASE.LANDING); setInputText(''); setVisibleParts(0); setThinkStep(0); setToggles({ doc: false, web: false, deep: false }); setActiveToggle(null); setTurn(1); setTurn2Phase('idle'); setTurn2VisibleParts(0); setTurn2ThinkStep(0); setTurn2InputText('') }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-3xl">

              {/* User message bubble – only after send is pressed (THINKING, STREAMING, DONE) */}
              {(phase === PHASE.THINKING || phase === PHASE.STREAMING || phase === PHASE.DONE) && (
                <div className="flex justify-end items-end gap-2">
                  <span className="text-[10px] text-on-surface-variant/40 mb-1">You</span>
                  <div className="max-w-[75%] rounded-3xl rounded-br-lg bg-gradient-to-br from-primary/8 to-primary/15 text-on-surface text-sm leading-relaxed shadow-[0_2px_16px_rgba(37,99,235,0.08)] ring-1 ring-primary/10 backdrop-blur-sm" style={{ padding: '0.625rem 1rem' }}>
                    {PROMPT_TEXT}
                  </div>
                </div>
              )}

              {/* Spacer between bubbles */}
              {(phase === PHASE.THINKING || phase === PHASE.STREAMING || phase === PHASE.DONE) && (
                <div className="h-4" />
              )}

              {/* AI response area */}
              {(phase === PHASE.THINKING || phase === PHASE.STREAMING || phase === PHASE.DONE) && (
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0 mt-0.5 shadow-sm ring-1 ring-primary/10">
                    <SparkleIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-on-surface-variant/40 ml-1 mb-1.5 block">BBL AI Advisor</span>
                    {/* thinking steps */}
                    {phase === PHASE.THINKING && (
                      <ThinkingPanel steps={THINKING_STEPS} currentStep={thinkStep} />
                    )}

                    {/* streamed response */}
                    {(phase === PHASE.STREAMING || phase === PHASE.DONE) && (
                      <div className="rounded-3xl rounded-tl-lg bg-white/80 backdrop-blur-sm shadow-[0_2px_20px_rgba(148,163,184,0.12)] ring-1 ring-outline-variant/10" style={{ padding: '1rem 1.25rem' }}>
                        <StreamedContent parts={RESPONSE_PARTS} visibleCount={visibleParts} />
                        {phase === PHASE.DONE && <SourceCards />}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ═══ Turn 2 ═══ */}
              {turn2Phase !== 'idle' && (
                <>
                  <div className="h-4" />
                  {/* Turn 2 user bubble */}
                  {(turn2Phase === 'thinking' || turn2Phase === 'streaming' || turn2Phase === 'done') && (
                    <div className="flex justify-end items-end gap-2">
                      <span className="text-[10px] text-on-surface-variant/40 mb-1">You</span>
                      <div className="max-w-[75%] rounded-3xl rounded-br-lg bg-gradient-to-br from-primary/8 to-primary/15 text-on-surface text-sm leading-relaxed shadow-[0_2px_16px_rgba(37,99,235,0.08)] ring-1 ring-primary/10 backdrop-blur-sm" style={{ padding: '0.625rem 1rem' }}>
                        {PROMPT_TEXT_2}
                      </div>
                    </div>
                  )}

                  {(turn2Phase === 'thinking' || turn2Phase === 'streaming' || turn2Phase === 'done') && (
                    <div className="h-4" />
                  )}

                  {/* Turn 2 AI response */}
                  {(turn2Phase === 'thinking' || turn2Phase === 'streaming' || turn2Phase === 'done') && (
                    <div className="flex gap-4 items-start">
                      <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0 mt-0.5 shadow-sm ring-1 ring-primary/10">
                        <SparkleIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-on-surface-variant/40 ml-1 mb-1.5 block">BBL AI Advisor</span>
                        {turn2Phase === 'thinking' && (
                          <ThinkingPanel steps={THINKING_STEPS} currentStep={turn2ThinkStep} />
                        )}
                        {(turn2Phase === 'streaming' || turn2Phase === 'done') && (
                          <div className="rounded-3xl rounded-tl-lg bg-white/80 backdrop-blur-sm shadow-[0_2px_20px_rgba(148,163,184,0.12)] ring-1 ring-outline-variant/10" style={{ padding: '1rem 1.25rem' }}>
                            <StreamedContent parts={RESPONSE_PARTS_2} visibleCount={turn2VisibleParts} />
                            {turn2Phase === 'done' && (
                              <div className="mt-4 pt-3 border-t border-outline-variant/15">
                                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/60 font-semibold mb-2">Sources</p>
                                <div className="flex gap-2 flex-wrap">
                                  {SOURCES_2.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 rounded-lg bg-surface-container px-3 py-1.5 text-[11px]">
                                      {s.type === 'doc' ? <DocToggleIcon /> : <WebIcon />}
                                      <div>
                                        <span className="font-medium text-on-surface">{s.title}</span>
                                        <span className="ml-1 text-on-surface-variant/60">{s.subtitle}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>

          {/* ── Input bar ── */}
          <div className="shrink-0 bg-gradient-to-t from-surface via-surface/95 to-surface/0 px-8 pt-2 pb-5">
            <div className="mx-auto max-w-3xl">
              {/* Main input container */}
              <div className="rounded-3xl bg-white shadow-[0_2px_24px_rgba(148,163,184,0.15)] ring-1 ring-outline-variant/10 p-3">
                {/* Input area */}
                <div className="px-4 py-3 min-h-[48px] text-base text-on-surface leading-relaxed">
                  {turn2Phase === 'typing' ? (
                    <span>{turn2InputText}<CursorBlink /></span>
                  ) : turn2Phase === 'sending' ? (
                    <span className="text-on-surface">{PROMPT_TEXT_2}</span>
                  ) : phase === PHASE.TYPING ? (
                    <span>{inputText}<CursorBlink /></span>
                  ) : (phase === PHASE.TOGGLING || phase === PHASE.SENDING) ? (
                    <span className="text-on-surface">{PROMPT_TEXT}</span>
                  ) : (
                    <span className="text-on-surface-variant/40">Ask anything about banking services...</span>
                  )}
                </div>

                {/* Bottom row: toggles + send */}
                <div className="flex items-center justify-between mt-1 pl-2">
                  <div className="flex items-center gap-2">
                    <ToggleChip icon={<DocToggleIcon />} label="Documents" active={toggles.doc} onClick={() => toggle('doc')} isBeingClicked={activeToggle === 'doc'} />
                    <ToggleChip icon={<WebIcon />} label="Web Search" active={toggles.web} onClick={() => toggle('web')} isBeingClicked={activeToggle === 'web'} />
                    <ToggleChip icon={<BrainIcon />} label="Deep Think" active={toggles.deep} onClick={() => toggle('deep')} isBeingClicked={activeToggle === 'deep'} />
                  </div>
                  <button
                    disabled={phase !== PHASE.DONE && phase !== PHASE.SENDING}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl btn-gradient text-white shrink-0 transition-all duration-150 ${
                      phase === PHASE.SENDING
                        ? 'scale-90 ring-4 ring-primary/30 opacity-100'
                        : phase === PHASE.DONE
                          ? 'opacity-100 hover:scale-105'
                          : 'opacity-30'
                    }`}
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
