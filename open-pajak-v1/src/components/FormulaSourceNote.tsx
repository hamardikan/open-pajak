import { useTranslation } from 'react-i18next'

export function FormulaSourceNote() {
  const { t } = useTranslation()
  return (
    <div className="rounded-2xl border border-[#0f1e3d]/10 bg-white/90 p-4 text-sm text-[#0f1e3d] shadow-sm shadow-[#0f1e3d]/5">
      <p className="font-semibold">{t('formulaSource.title')}</p>
      <p className="mt-1 text-[#0f1e3d]/70">
        {t('formulaSource.body')}{' '}
        <a
          href="/Buku_PPh2126_Release_20240108.pdf"
          className="font-semibold text-[#0f1e3d]"
          download
        >
          {t('formulaSource.link')}
        </a>
        .
      </p>
    </div>
  )
}
