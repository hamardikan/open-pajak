import { useCallback, useMemo, useState } from 'react'
import {
  type ReceiptBatch,
  type ReceiptBatchDraft,
  type ReceiptDraft,
  type TaxReceipt,
  addBatch,
  addReceipt,
  getStoredBatches,
  getStoredReceipts,
  persistBatches,
  removeReceipt,
} from '../storage/receipts'

export function useReceipts() {
  const [receipts, setReceipts] = useState<Array<TaxReceipt>>(() =>
    getStoredReceipts(),
  )
  const [batches, setBatches] = useState<Array<ReceiptBatch>>(() =>
    getStoredBatches(),
  )

  const saveReceipt = useCallback(
    (draft: ReceiptDraft) => {
      const { record, all } = addReceipt(draft, receipts)
      setReceipts(all)
      return record
    },
    [receipts],
  )

  const deleteReceipt = useCallback(
    (id: string) => {
      const next = removeReceipt(id, receipts)
      setReceipts(next)
    },
    [receipts],
  )

  const saveBatch = useCallback(
    (draft: ReceiptBatchDraft) => {
      const { batch, all } = addBatch(draft, batches)
      setBatches(all)
      return batch
    },
    [batches],
  )

  const clearBatches = useCallback(() => {
    setBatches([])
    persistBatches([])
  }, [])

  const groupedReceipts = useMemo(() => {
    return receipts.reduce<Record<string, Array<TaxReceipt>>>((acc, entry) => {
      const key = entry.groupId ?? 'ungrouped'
      if (!acc[key]) acc[key] = []
      acc[key].push(entry)
      return acc
    }, {})
  }, [receipts])

  return {
    receipts,
    batches,
    groupedReceipts,
    saveReceipt,
    deleteReceipt,
    saveBatch,
    clearBatches,
    setReceipts,
    setBatches,
  }
}
