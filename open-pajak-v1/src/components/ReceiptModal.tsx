import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { ArrowUp, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ReceiptPreview } from './ReceiptPreview'
import type { ReceiptPreviewData } from './ReceiptPreview'

interface ReceiptModalProps {
  open: boolean
  data?: ReceiptPreviewData
  editable?: boolean
  onClose: () => void
  onSave?: (payload: {
    title: string
    identifier?: string
    groupName?: string
  }) => void
  onPrint?: () => void
  onDownloadExcel?: () => void
  onDelete?: () => void
}

export function ReceiptModal({
  open,
  data,
  editable = true,
  onClose,
  onSave,
  onPrint,
  onDownloadExcel,
  onDelete,
}: ReceiptModalProps) {
  const { t } = useTranslation()
  const [title, setTitle] = useState(data?.title ?? '')
  const [identifier, setIdentifier] = useState(data?.identifier ?? '')
  const [groupName, setGroupName] = useState(data?.groupName ?? '')

  useEffect(() => {
    if (data) {
      setTitle(data.title)
      setIdentifier(data.identifier ?? '')
      setGroupName(data.groupName ?? '')
    }
  }, [data])

  if (!open || !data) return null

  const handleSave = () => {
    if (!onSave) return
    onSave({
      title: title.trim() || data.title,
      identifier: identifier.trim() || undefined,
      groupName: groupName.trim() || undefined,
    })
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8 backdrop-blur-sm">
        <div className="receipt-modal-top relative w-full max-w-5xl rounded-3xl bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-[#0f1e3d]/10 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f5a524]">
                {t('receipts.modal.title')}
              </p>
              <h3 className="text-2xl font-semibold text-[#0f1e3d]">{data.title}</h3>
              {data.sourceLabel && (
                <p className="text-xs text-[#0f1e3d]/70">{data.sourceLabel}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label={t('app.buttons.closeNav')}
            >
              <X />
            </Button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
            <div className="space-y-4 rounded-2xl border border-dashed border-[#f0f0f0] bg-[#fcfcff] p-4">
              <LabelBlock
                label={t('receipts.modal.name')}
                value={
                  editable ? (
                    <Input value={title} onChange={(event) => setTitle(event.target.value)} />
                  ) : (
                    data.title
                  )
                }
              />
              <LabelBlock
                label={t('receipts.modal.identifier')}
                value={
                  editable ? (
                    <Input
                      value={identifier}
                      onChange={(event) => setIdentifier(event.target.value)}
                    />
                  ) : (
                    data.identifier ?? '—'
                  )
                }
              />
              <LabelBlock
                label={t('receipts.modal.group')}
                hint={t('receipts.modal.groupHint')}
                value={
                  editable ? (
                    <Input
                      value={groupName}
                      onChange={(event) => setGroupName(event.target.value)}
                    />
                  ) : (
                    data.groupName ?? '—'
                  )
                }
              />
              {data.createdAt && (
                <LabelBlock
                  label={t('receipts.modal.created')}
                  value={formatDateLabel(data.createdAt, data.locale)}
                />
              )}
              <div className="space-y-2">
                {editable && onSave && (
                  <Button className="w-full" onClick={handleSave}>
                    {t('receipts.actions.save')}
                  </Button>
                )}
                {onDownloadExcel && (
                  <Button variant="outline" className="w-full" onClick={onDownloadExcel}>
                    {t('receipts.actions.downloadExcel')}
                  </Button>
                )}
                {onPrint && (
                  <Button variant="ghost" className="w-full" onClick={onPrint}>
                    {t('receipts.actions.downloadPdf')}
                  </Button>
                )}
                {onDelete && (
                  <Button variant="ghost" className="w-full" onClick={onDelete}>
                    {t('receipts.actions.delete')}
                  </Button>
                )}
              </div>
            </div>
            <div className="md:col-span-1">
              <ReceiptPreview {...data} title={title || data.title} />
            </div>
          </div>
        </div>
      </div>
      {open && (
        <Button
          className="fixed bottom-6 right-6 z-[60] shadow-lg shadow-black/15"
          variant="accent"
          size="icon"
          onClick={() => {
            const scrollTarget = document.querySelector('.receipt-modal-top')
            scrollTarget?.scrollIntoView({ behavior: 'smooth' })
          }}
          aria-label={t('receipts.actions.scrollTop')}
        >
          <ArrowUp />
        </Button>
      )}
    </>
  )
}

function LabelBlock({
  label,
  hint,
  value,
}: {
  label: string
  hint?: string
  value: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#f0f0f0] bg-[#fafbfe] p-3 text-sm text-[#0f1e3d]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8a92a6]">
        {label}
      </p>
      <div className="mt-1 font-semibold">{value}</div>
      {hint && <p className="mt-1 text-[11px] text-[#8a92a6]">{hint}</p>}
    </div>
  )
}

const formatDateLabel = (value: string, locale?: string) => {
  try {
    return new Intl.DateTimeFormat(locale ?? 'id', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return new Date(value).toLocaleString()
  }
}
