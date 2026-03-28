export const NODE_WIDTH = 180
export const NODE_HEIGHT = 96

export const nodes = [
  {
    id: 'submit-request',
    name: 'Customer Submits Request',
    type: 'source',
    icon: 'userSubmit',
    x: 50,
    y: 80,
  },
  {
    id: 'retrieve-data',
    name: 'Retrieve Data',
    type: 'retrieval',
    icon: 'folderSearch',
    x: 280,
    y: 80,
  },
  {
    id: 'doc-processing',
    name: 'Document Processing Agent',
    type: 'ocr',
    icon: 'documentScan',
    x: 520,
    y: 15,
  },
  {
    id: 'identity-verify',
    name: 'Identity Verification Agent',
    type: 'identity',
    icon: 'userCheck',
    x: 520,
    y: 170,
  },
  {
    id: 'financial-summary',
    name: 'Financial Summary',
    type: 'summary',
    icon: 'barChart',
    x: 770,
    y: 80,
  },
  {
    id: 'approval',
    name: 'Approval',
    type: 'approval',
    icon: 'checkCircle',
    x: 770,
    y: 290,
  },
  {
    id: 'notify-customer',
    name: 'Notify Customer',
    type: 'notify',
    icon: 'bellNotify',
    x: 50,
    y: 290,
  },
]

export const edges = [
  { from: 'submit-request', to: 'retrieve-data' },
  { from: 'retrieve-data', to: 'doc-processing' },
  { from: 'retrieve-data', to: 'identity-verify' },
  { from: 'doc-processing', to: 'financial-summary' },
  { from: 'identity-verify', to: 'financial-summary' },
  { from: 'financial-summary', to: 'approval' },
  { from: 'approval', to: 'notify-customer' },
]

export const nodeDetails = {
  'submit-request': {
    subtitle: 'Customer Portal',
    description: 'Customer initiates a loan application through the online banking portal. Application form data, uploaded documents, and consent are captured.',
    details: [
      { label: 'Application Type', value: 'Personal Loan' },
      { label: 'Requested Amount', value: '500,000 THB' },
      { label: 'Term', value: '36 months' },
      { label: 'Channel', value: 'Mobile Banking' },
    ],
  },
  'retrieve-data': {
    subtitle: 'Core Banking Integration',
    description: 'Pull customer records from the core banking system including account history, existing obligations, and KYC documents on file.',
    details: [
      { label: 'Customer ID', value: 'CUS-2024-88412' },
      { label: 'Account Age', value: '4 years, 7 months' },
      { label: 'Existing Products', value: 'Savings, Credit Card' },
      { label: 'Data Sources', value: '3 systems queried' },
    ],
  },
  'doc-processing': {
    subtitle: 'AI Agent - OCR Processing',
    model: 'Claude 3.5 Sonnet',
    confidence: '98.7%',
    description: 'AI agent extracts and analyzes financial data from uploaded payslips, bank statements, and tax documents using OCR.',
    financialData: {
      totalIncome: '120,000',
      totalExpense: '85,000',
      abilityToPay: '35,000',
      currency: 'THB/month',
    },
    stats: {
      tokens: '3,241',
      latency: '2.3s',
      cost: '$0.0058',
    },
  },
  'identity-verify': {
    subtitle: 'AI Agent - KYC/AML',
    model: 'Claude 3.5 Sonnet',
    confidence: '99.2%',
    description: 'AI agent performs identity verification, document authenticity check, and AML screening against watchlists.',
    details: [
      { label: 'ID Match', value: 'Verified' },
      { label: 'Liveness Check', value: 'Passed' },
      { label: 'AML Screening', value: 'Clear' },
      { label: 'PEP Status', value: 'Not flagged' },
    ],
    stats: {
      tokens: '1,872',
      latency: '1.8s',
      cost: '$0.0034',
    },
  },
  'financial-summary': {
    subtitle: 'Consolidated Analysis',
    description: 'Aggregated financial assessment combining OCR-extracted data and verification results for the approval decision.',
    financialData: {
      totalIncome: '120,000',
      totalExpense: '85,000',
      abilityToPay: '35,000',
      currency: 'THB/month',
    },
    details: [
      { label: 'Debt-to-Income', value: '28.3%' },
      { label: 'Risk Score', value: 'Low-Medium' },
      { label: 'Max Eligible', value: '630,000 THB' },
    ],
  },
  'approval': {
    subtitle: 'Decision Engine',
    description: 'Final approval decision based on financial summary, risk assessment, and policy rules.',
    result: 'approved',
    details: [
      { label: 'Decision', value: 'Approved' },
      { label: 'Approved Amount', value: '500,000 THB' },
      { label: 'Interest Rate', value: '8.5% p.a.' },
      { label: 'Monthly Payment', value: '15,763 THB' },
    ],
  },
  'notify-customer': {
    subtitle: 'Notification Service',
    description: 'Send the approval result and loan terms to the customer via their preferred communication channel.',
    details: [
      { label: 'SMS', value: 'Sent' },
      { label: 'Email', value: 'Sent' },
      { label: 'In-App Push', value: 'Sent' },
      { label: 'Reference No.', value: 'LN-2024-00412' },
    ],
  },
}

// Simulation step definitions: [nodeIds[], delay before step starts (ms), duration (ms)]
export const simulationSteps = [
  { nodeIds: ['submit-request'], delay: 0, duration: 800 },
  { nodeIds: ['retrieve-data'], delay: 800, duration: 1200 },
  { nodeIds: ['doc-processing', 'identity-verify'], delay: 2000, duration: 2500 },
  { nodeIds: ['financial-summary'], delay: 4500, duration: 1000 },
  { nodeIds: ['approval'], delay: 5500, duration: 800 },
  { nodeIds: ['notify-customer'], delay: 6300, duration: 800 },
]
