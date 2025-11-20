import i18n from '../i18n/config'
import { formatCurrency, formatPercent } from './format'
import type { ReceiptBatch, TaxReceipt } from './storage/receipts'

type Worksheet = {
  name: string
  rows: Array<Array<string>>
}

const renderRowValue = (
  value: number | string | undefined,
  valueType: TaxReceipt['breakdown'][number]['valueType'],
): string => {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value
  if (valueType === 'text') return String(value)
  if (valueType === 'percent') {
    const numeric = typeof value === 'number' ? value : Number(value) || 0
    return formatPercent(numeric)
  }
  const numeric = typeof value === 'number' ? value : Number(value) || 0
  return formatCurrency(numeric)
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const buildWorksheet = ({ name, rows }: Worksheet) => {
  const safeName = escapeXml(name || 'Sheet1')
  const tableRows = rows
    .map((cells) => {
      const columns = cells
        .map((cell) => `<Cell><Data ss:Type="String">${escapeXml(cell ?? '')}</Data></Cell>`)
        .join('')
      return `<Row>${columns}</Row>`
    })
    .join('')
  return `<Worksheet ss:Name="${safeName}"><Table>${tableRows}</Table></Worksheet>`
}

const buildWorkbook = (worksheets: Array<Worksheet>) => {
  const sheets = worksheets.map(buildWorksheet).join('')
  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  ${sheets}
</Workbook>`
}

const sanitizeFilename = (value: string) =>
  value
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || 'open-pajak'

export const downloadWorkbook = (filename: string, worksheets: Array<Worksheet>) => {
  if (typeof window === 'undefined') return
  const xml = buildWorkbook(worksheets)
  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.xls') ? filename : `${filename}.xls`
  link.click()
  URL.revokeObjectURL(url)
}

export const downloadReceiptWorkbook = (receipt: TaxReceipt) => {
  const rows: Array<Array<string>> = [
    [i18n.t('table.component'), i18n.t('table.value'), i18n.t('table.note')],
    ...receipt.breakdown.map((row) => [
      row.label,
      renderRowValue(row.value, row.valueType),
      row.note ?? '',
    ]),
  ]
  downloadWorkbook(`${sanitizeFilename(receipt.title)}.xls`, [
    { name: 'Receipt', rows },
  ])
}

export const downloadBatchWorkbook = (
  batch: ReceiptBatch,
  receipts: Array<TaxReceipt>,
) => {
  const header = ['Batch', 'Receipt', 'Component', 'Value', 'Note']
  const rows = receipts.flatMap((receipt) =>
    receipt.breakdown.map((row) => [
      batch.label,
      receipt.title,
      row.label,
      renderRowValue(row.value, row.valueType),
      row.note ?? '',
    ]),
  )
  downloadWorkbook(`${sanitizeFilename(batch.label)}.xls`, [
    { name: 'Batch', rows: [header, ...rows] },
  ])
}

export const openPrintableReceipt = (receipt: TaxReceipt) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const t = (key: string, fallback?: string) =>
    i18n.t(key, { defaultValue: fallback })
  const visitSiteLabel = t('receipts.print.visitSite', 'Visit Site')
  const githubLabel = t('receipts.print.github', 'GitHub')
  const dateFormatter = new Intl.DateTimeFormat(receipt.locale ?? 'id', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const createdAt = receipt.createdAt ? dateFormatter.format(new Date(receipt.createdAt)) : ''

  const summaryRows = [
    { label: t('receipts.summary.totalTax'), value: receipt.summary.totalTax },
    receipt.summary.terPerPeriod !== undefined && {
      label: t('receipts.summary.terMonthly'),
      value: receipt.summary.terPerPeriod,
    },
    receipt.summary.decemberAdjustment !== undefined && {
      label: t('receipts.summary.decAdjustment'),
      value: receipt.summary.decemberAdjustment,
    },
    receipt.summary.takeHomeAnnual !== undefined && {
      label: t('receipts.summary.thpAnnual'),
      value: receipt.summary.takeHomeAnnual,
    },
    receipt.summary.takeHomePerPeriod !== undefined && {
      label: t('receipts.summary.thpPeriod'),
      value: receipt.summary.takeHomePerPeriod,
    },
  ].filter(Boolean) as Array<{ label: string; value: number }>

  const styles = `
    @page { margin: 0; }
    body { font-family: 'Inter', 'Sora', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #020512; margin:0; color: #0f1e3d; }
    .header-shell { background: linear-gradient(120deg,#030714,#152c5c); padding: 36px 0; color: white; }
    .shell { max-width: 780px; margin: 0 auto; padding: 0 32px; }
    .header { display: flex; justify-content: space-between; align-items: center; gap: 16px; color: white; }
    .logo { display: flex; gap: 12px; align-items: center; }
    .logo-mark { width: 52px; height: 52px; border-radius: 18px; background: linear-gradient(135deg,#050c1d,#142853); color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: inset 0 4px 14px rgba(0,0,0,0.3); letter-spacing: 0.05em; }
    .logo-mark span:last-child { color: #f9c74f; margin-left: 2px; }
    .logo-text { line-height: 1.2; }
    .logo-text .eyebrow { font-size: 11px; letter-spacing: 0.35em; text-transform: uppercase; color: #f5a524; font-weight: 600; }
    .logo-text .tagline { font-size: 12px; text-transform: uppercase; letter-spacing: 0.3em; color: #f6f7fb; }
    .cta-links { display: flex; gap: 10px; }
    .cta-links a { text-decoration: none; padding: 10px 18px; border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; border: 1px solid #f5c768; color: #0f1e3d; background: #fff5da; display: inline-flex; align-items: center; gap:6px; }
    .cta-links a.secondary { border-color: white; background: transparent; color: white; }
    .cta-links svg { width: 14px; height: 14px; fill: currentColor; }
    .page { max-width: 780px; margin: -12px auto 40px; background: white; border-radius: 24px 24px 0 0; padding: 32px; }
    .content { padding-top: 8px; }
    h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 0.4em; color: #f5a524; }
    h2 { margin: 8px 0 24px; font-size: 32px; color: #0f1e3d; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; }
    th { text-align: left; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #5f4400; border-bottom: 1px solid #f4d296; padding-bottom: 8px; }
    td { padding: 12px 0; border-bottom: 1px solid #f4f1ea; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 16px; margin-bottom: 24px; }
    .summary div { background: #fff9eb; border-radius: 12px; padding: 12px; border: 1px solid #f6ce7d; }
    .summary span { display: block; text-transform: uppercase; font-size: 11px; letter-spacing: 0.3em; color: #886200; margin-bottom: 6px; }
    .summary strong { font-size: 18px; }
    .meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: #55607a; }
  `

  const receiptHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${receipt.title}</title>
        <style>${styles}</style>
      </head>
      <body>
        <div class="header-shell">
          <div class="shell">
            <div class="header">
              <div class="logo">
                <div class="logo-mark"><span>O</span><span>P</span></div>
                <div class="logo-text">
                  <div class="eyebrow">Open Pajak</div>
                  <div class="tagline">Open Source Tax Toolkit</div>
                </div>
              </div>
              <div class="cta-links">
                <a href="https://openpajak.hamardikan.com" target="_blank" rel="noreferrer">${visitSiteLabel}</a>
                <a class="secondary" href="https://github.com/hamardikan" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.1 3.3 9.42 7.89 10.95.58.1.79-.25.79-.55 0-.27-.01-1.15-.02-2.08-3.21.7-3.89-1.55-3.89-1.55-.53-1.36-1.28-1.72-1.28-1.72-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.72-1.54-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.28 1.2-3.09-.12-.3-.52-1.52.11-3.16 0 0 .97-.31 3.18 1.18a11.07 11.07 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.64.24 2.86.12 3.16.75.81 1.2 1.83 1.2 3.09 0 4.42-2.7 5.39-5.27 5.67.41.36.77 1.07.77 2.16 0 1.56-.02 2.82-.02 3.2 0 .31.21.66.8.55 4.58-1.54 7.88-5.85 7.88-10.95C23.5 5.65 18.35.5 12 .5Z"/></svg>
                  ${githubLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="page">
          <div class="content">
          <h1>${t('receipts.print.title')}</h1>
          <h2>${receipt.title}</h2>
          <div class="meta">
            ${
              receipt.id
                ? `<div>${t('receipts.print.meta')}: <strong>${receipt.id}</strong></div>`
                : ''
            }
            ${
              receipt.identifier
                ? `<div>${t('receipts.print.identifier')}: <strong>${receipt.identifier}</strong></div>`
                : ''
            }
            ${
              receipt.groupName
                ? `<div>${t('receipts.print.group')}: <strong>${receipt.groupName}</strong></div>`
                : ''
            }
            ${
              createdAt
                ? `<div>${t('receipts.modal.created')}: <strong>${createdAt}</strong></div>`
                : ''
            }
          </div>
          <div class="summary">
            ${summaryRows
              .map(
                (row) => `
                  <div>
                    <span>${row.label}</span>
                    <strong>${formatCurrency(row.value)}</strong>
                  </div>
                `,
              )
              .join('')}
          </div>
          <table>
            <thead>
              <tr>
                <th>${t('table.component')}</th>
                <th>${t('table.value')}</th>
                <th>${t('table.note')}</th>
              </tr>
            </thead>
            <tbody>
              ${receipt.breakdown
                .map(
                  (row) => `
                    <tr>
                      <td>${row.label}</td>
                      <td>${renderRowValue(row.value, row.valueType)}</td>
                      <td>${row.note ?? ''}</td>
                    </tr>
                  `,
                )
                .join('')}
            </tbody>
          </table>
          </div>
        </div>
      </body>
    </html>
  `

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.opacity = '0'
  iframe.style.pointerEvents = 'none'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.srcdoc = receiptHtml
  document.body.appendChild(iframe)

  const cleanup = () => {
    try {
      document.body.removeChild(iframe)
    } catch {
      // ignore
    }
  }
  const triggerPrint = () => {
    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } catch {
      // ignore
    } finally {
      setTimeout(cleanup, 500)
    }
  }

  iframe.onload = () => {
    triggerPrint()
    setTimeout(triggerPrint, 400)
  }
}

export const parseSpreadsheetXml = (xml: string): Array<Array<string>> => {
  if (typeof DOMParser === 'undefined') {
    return []
  }
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')
  if (doc.getElementsByTagName('parsererror').length > 0) {
    return []
  }
  const rows = Array.from(doc.getElementsByTagName('Row'))
  if (!rows.length) {
    const nsNodes = Array.from(doc.getElementsByTagNameNS('*', 'Row'))
    if (!nsNodes.length) return []
    return nsNodes.map(extractRow)
  }
  return rows.map(extractRow)
}

const extractRow = (row: Element) => {
  const cells = (() => {
    const standard = Array.from(row.getElementsByTagName('Cell'))
    if (standard.length) return standard
    return Array.from(row.getElementsByTagNameNS('*', 'Cell'))
  })()
  const values: Array<string> = []
  let currentIndex = 0

  cells.forEach((cell) => {
    const indexAttr =
      cell.getAttribute('ss:Index') ??
      cell.getAttribute('Index') ??
      cell.getAttributeNS('urn:schemas-microsoft-com:office:spreadsheet', 'Index')
    if (indexAttr) {
      const nextIndex = Number(indexAttr) - 1
      while (currentIndex < nextIndex) {
        values.push('')
        currentIndex += 1
      }
    }
    const data =
      cell.getElementsByTagName('Data')[0] ??
      cell.getElementsByTagNameNS('*', 'Data')[0]
    values.push(data?.textContent ?? '')
    currentIndex += 1
  })

  return values
}
