import type { TaxBreakdownRow } from '../tax/types'
import i18n from '../../i18n/config'

export type ReceiptSource = 'manual' | 'bulk'

export type ReceiptTaxType = 'pph21' | 'pph26'

export interface TaxReceiptSummary {
  totalTax: number
  takeHomeAnnual?: number
  takeHomePerPeriod?: number
  terPerPeriod?: number
  decemberAdjustment?: number
}

export interface TaxReceipt {
  id: string
  type: ReceiptTaxType
  subjectType?: string
  title: string
  identifier?: string
  groupId?: string
  groupName?: string
  batchId?: string
  createdAt: string
  source: ReceiptSource
  locale: string
  formSnapshot: Record<string, string | number | boolean>
  summary: TaxReceiptSummary
  breakdown: Array<TaxBreakdownRow>
}

export interface ReceiptBatch {
  id: string
  label: string
  type: ReceiptTaxType | 'mixed'
  createdAt: string
  recordIds: Array<string>
  fileName?: string
  templateVersion: string
}

const RECEIPTS_KEY = 'openPajak.receipts'
const BATCHES_KEY = 'openPajak.receiptBatches'

const hasWindow = typeof window !== 'undefined'

const readStorage = <T>(key: string, fallback: T): T => {
  if (!hasWindow) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch (error) {
    console.warn(`[receipt-storage] Failed to read ${key}`, error)
    return fallback
  }
}

const writeStorage = <T>(key: string, value: T) => {
  if (!hasWindow) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`[receipt-storage] Failed to write ${key}`, error)
  }
}

const generateId = () => {
  if (hasWindow && typeof window.crypto?.randomUUID === 'function') {
    return window.crypto.randomUUID()
  }
  return `rcpt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export const getStoredReceipts = () => readStorage<Array<TaxReceipt>>(RECEIPTS_KEY, [])

export const getStoredBatches = () => readStorage<Array<ReceiptBatch>>(BATCHES_KEY, [])

export const persistReceipts = (receipts: Array<TaxReceipt>) => {
  writeStorage(RECEIPTS_KEY, receipts)
}

export const persistBatches = (batches: Array<ReceiptBatch>) => {
  writeStorage(BATCHES_KEY, batches)
}

export type ReceiptDraft = Omit<TaxReceipt, 'id' | 'createdAt' | 'locale'> & {
  id?: string
  createdAt?: string
  locale?: string
}

export const addReceipt = (
  draft: ReceiptDraft,
  current: Array<TaxReceipt>,
): { record: TaxReceipt; all: Array<TaxReceipt> } => {
  const record: TaxReceipt = {
    ...draft,
    id: draft.id ?? generateId(),
    createdAt: draft.createdAt ?? new Date().toISOString(),
    locale: draft.locale ?? i18n.language ?? 'id',
  }
  const all = [...current.filter((entry) => entry.id !== record.id), record]
  persistReceipts(all)
  return { record, all }
}

export const removeReceipt = (id: string, current: Array<TaxReceipt>) => {
  const next = current.filter((entry) => entry.id !== id)
  persistReceipts(next)
  return next
}

export type ReceiptBatchDraft = Omit<ReceiptBatch, 'id' | 'createdAt'> & {
  id?: string
  createdAt?: string
}

export const addBatch = (
  draft: ReceiptBatchDraft,
  current: Array<ReceiptBatch>,
) => {
  const record: ReceiptBatch = {
    ...draft,
    id: draft.id ?? generateId(),
    createdAt: draft.createdAt ?? new Date().toISOString(),
  }
  const all = [...current.filter((entry) => entry.id !== record.id), record]
  persistBatches(all)
  return { batch: record, all }
}
