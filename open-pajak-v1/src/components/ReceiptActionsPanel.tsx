import { Archive, Upload, Download } from 'lucide-react'
import { useRef } from 'react'
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface ReceiptActionsPanelProps {
  onPreview: () => void
  onHistory: () => void
  onDownloadTemplate: () => void
  onBulkUpload: (file: File) => void
  disabled?: boolean
}

export function ReceiptActionsPanel({
  onPreview,
  onHistory,
  onDownloadTemplate,
  onBulkUpload,
  disabled,
}: ReceiptActionsPanelProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBulkChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onBulkUpload(file)
      event.target.value = ''
    }
  }

  return (
    <Card className="flex flex-col gap-4 border-[#0f1e3d]/10 bg-white/80 p-5">
      <div className="flex flex-col gap-1 text-[#0f1e3d]">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f5a524]">
          {t('receipts.panel.title')}
        </p>
        <p className="text-sm text-[#0f1e3d]/70">{t('receipts.panel.subtitle')}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onPreview} disabled={disabled}>
          {t('receipts.actions.preview')}
        </Button>
        <Button variant="outline" onClick={onHistory}>
          <Archive className="mr-2 size-4" />
          {t('receipts.actions.history')}
        </Button>
        <Button variant="outline" onClick={onDownloadTemplate}>
          <Download className="mr-2 size-4" />
          {t('receipts.bulk.downloadTemplate')}
        </Button>
        <div className="relative">
          <Button
            variant="outline"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 size-4" />
            {t('receipts.bulk.uploadLabel')}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xls,.xml"
            className="hidden"
            onChange={handleBulkChange}
          />
        </div>
      </div>
    </Card>
  )
}
