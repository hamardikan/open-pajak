export function FormulaSourceNote() {
  return (
    <div className="rounded-2xl border border-[#0f1e3d]/10 bg-white/90 p-4 text-sm text-[#0f1e3d] shadow-sm shadow-[#0f1e3d]/5">
      <p className="font-semibold">Rujukan Formula</p>
      <p className="mt-1 text-[#0f1e3d]/70">
        Seluruh kalkulasi mengikuti{' '}
        <a
          href="/Buku_PPh2126_Release_20240108.pdf"
          className="font-semibold text-[#0f1e3d]"
          download
        >
          Buku_PPh2126_Release_20240108.pdf
        </a>{' '}
        yang diterbitkan DJP.
      </p>
    </div>
  )
}
