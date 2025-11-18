import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/cn'
import { Button } from './ui/button'
import type { ReactNode } from 'react'

const NAV_LINKS: Array<{ to: string; label: string }> = [
  { to: '/', label: 'Beranda' },
  { to: '/pph21', label: 'PPh 21/26' },
  { to: '/pph22', label: 'PPh 22' },
  { to: '/pph23', label: 'PPh 23' },
  { to: '/pph4-2', label: 'PPh 4(2)' },
  { to: '/ppn', label: 'PPN' },
  { to: '/ppnbm', label: 'PPNBM' },
]

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { location } = useRouterState()

  const renderNav = (variant: 'dark' | 'light') => (
    <nav className="flex flex-col gap-2 text-sm font-semibold md:flex-row md:items-center md:gap-1">
      {NAV_LINKS.map((item) => {
        const active = location.pathname === item.to
        const activeClass =
          variant === 'dark'
            ? 'bg-white/70 text-[#0f1e3d] shadow-lg shadow-[#0f1e3d]/30 backdrop-blur'
            : 'bg-[#f9c74f]/90 text-[#0f1e3d] shadow-lg shadow-[#f5a524]/40'
        const inactiveClass =
          variant === 'dark'
            ? 'text-white/80 hover:bg-white/10 hover:text-white'
            : 'text-[#0f1e3d] hover:bg-[#0f1e3d]/10'

        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'rounded-full px-4 py-2 transition-all',
              active ? activeClass : inactiveClass,
            )}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-transparent">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-gradient-to-r from-[#0a1630] to-[#142853] text-white shadow-lg shadow-[#0a1630]/30">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-center gap-3 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#121e3c] text-lg font-bold text-white shadow-inner shadow-black/30">
              <span>O</span>
              <span className="text-[#f9c74f]">P</span>
            </div>
            <div className="leading-tight">
              <p className="text-lg font-semibold">
                <span>Open </span>
                <span className="text-[#f9c74f]">Pajak</span>
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white">
                <span className="text-white">Open Source </span>
                <span className="text-[#f9c74f]">Tax Toolkit</span>
              </p>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-between gap-4 md:flex">
            <div className="flex-1">{renderNav('dark')}</div>
            <Button asChild variant="accent">
              <Link to="/pph21">Simulasi PPh 21</Link>
            </Button>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="md:hidden bg-white text-[#0f1e3d] shadow-md shadow-black/10 hover:bg-white/90"
            onClick={() => setOpen(true)}
            aria-label="Buka navigasi"
          >
            <Menu />
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>

      <div
        className={cn(
          'fixed inset-y-0 right-0 z-40 w-80 bg-white p-6 shadow-2xl transition-transform md:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-[#0f1e3d]">Menu utama</p>
            <p className="text-xs text-[#0f1e3d]/70">
              Pilih kalkulator yang ingin digunakan.
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label="Tutup navigasi"
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        </div>
        <div className="space-y-4">
          {renderNav('light')}
          <Button asChild className="w-full">
            <Link to="/pph21">Mulai simulasi</Link>
          </Button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  )
}
