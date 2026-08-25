export type MaxRetentionMode = 'none' | 'percent' | 'maximum'

export interface DistributionContact {
  id: string
  responsiblePerson: string
  respPersonName: string
  sendToFirm: string
  sendToFirmName: string
  sendToContact: string
  contactName: string
  send: boolean
  preferredMethod: string
  sendType: string
  dateSent: string
  dateSigned: string
  notes: string
}

export interface SubcontractRecord {
  id: string
  subcontract: string
  slDescription: string
  documentType: string
  vendor: string
  vendorName: string
  holdCode: string
  holdCodeDesc: string
  payTerms: string
  payTermsDesc: string
  compGroup: string
  compGroupDesc: string
  totalOrigSubct: number
  totalCurrSubct: number
  startDate: string
  approved: boolean
  approvedBy: string
  claimApprovalRequired: boolean
  slStatus: string
  slJob: string
  slJobDesc: string
  percentOfContract: number
  maxRetgAmt: number
  percentOfContAmt: number
  inclAcoInMaxRetg: boolean
  maxRetDistStyle: string
  notes: string
  exhibitAJobsiteRules: boolean
  exhibitBLeedRequirements: boolean
  exhibitCInsurance: boolean
  exhibitDBillingProcedures: boolean
  exhibitESchedule: boolean
  exhibitFPlansAndSpecs: boolean
  bondRequired: boolean
  jhasRequired: boolean
  jhasReqByDate: string
  plansAndSpecsIndexFilepath: string
  maxRetentionMode: MaxRetentionMode
  percentOfSubcontract: number
  retentionAmount: number
  maxAmtByPercent: number
  includeChgOrdersInMaxRetention: boolean
  retentionApprove: boolean
  adjustMaximumInvoice: string
  distribution: DistributionContact[]
}

export const PROJECT_NUMBER = '0-2'
export const PROJECT_DESCRIPTION = 'Main Campus Renovation — Phase 2'

export type SubcontractColumnKey = keyof SubcontractRecord | 'actions'

export interface SubcontractColumnDef {
  key: SubcontractColumnKey
  header: string
  width?: string
  numeric?: boolean
  boolean?: boolean
  required?: boolean
}
