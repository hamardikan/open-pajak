import { Link, useRouterState } from '@tanstack/react-router'
import { Check, ChevronDown, Github, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { availableLocales, changeLocale } from '../i18n/config'
import { cn } from '../lib/cn'
import { Button } from './ui/button'
import type { ReactNode } from 'react'

const GITHUB_URL = 'https://github.com/hamardikan/open-pajak'

const NAV_LINKS: Array<{ to: string; labelKey: string }> = [
  { to: '/', labelKey: 'app.nav.home' },
  { to: '/pph21', labelKey: 'app.nav.pph21' },
  { to: '/pph22', labelKey: 'app.nav.pph22' },
  { to: '/pph23', labelKey: 'app.nav.pph23' },
  { to: '/pph4-2', labelKey: 'app.nav.pph4_2' },
  { to: '/ppn', labelKey: 'app.nav.ppn' },
  { to: '/ppnbm', labelKey: 'app.nav.ppnbm' },
]

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const langDropdownRef = useRef<HTMLDivElement>(null)
  const { location } = useRouterState()
  const { t, i18n } = useTranslation()

  const handleLocaleChange = (value: string) => {
    changeLocale(value)
    setLangDropdownOpen(false)
  }

  const currentLocale = availableLocales.find((locale) => locale.code === i18n.language) || availableLocales[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false)
      }
    }

    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [langDropdownOpen])

  useEffect(() => {
    if (!open) {
      setLangDropdownOpen(false)
    }
  }, [open])

  const renderNav = (variant: 'dark' | 'light') => (
    <nav className="flex flex-col gap-2 text-sm font-semibold md:flex-row md:items-center md:gap-1">
      {NAV_LINKS.map((item) => {
        const active = location.pathname === item.to
        const activeClass =
          variant === 'dark'
            ? 'bg-[#f9c74f] text-[#0f1e3d] shadow-md shadow-[#f9c74f]/25 font-bold'
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
            {t(item.labelKey)}
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
              <p className="text-lg font-semibold leading-snug">
                <span>{t('app.brandMain')}</span>{' '}
                <span className="text-[#f9c74f]">{t('app.brandAccent')}</span>
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white">
                {t('app.taglineLine1')}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f9c74f]">
                {t('app.taglineLine2')}
              </p>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-between gap-4 md:flex">
            <div className="flex-1">{renderNav('dark')}</div>
            <div className="flex items-center gap-4">
              <div ref={langDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  aria-label="Change language"
                  className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-wider text-white/90 outline-none backdrop-blur transition-all hover:bg-white/10 hover:text-white"
                >
                  <span>{currentLocale.emoji}</span>
                  <span>{currentLocale.label.toUpperCase()}</span>
                  <ChevronDown
                    className={cn(
                      'size-3.5 transition-transform',
                      langDropdownOpen && 'rotate-180',
                    )}
                  />
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 min-w-[160px] rounded-lg border border-white/10 bg-[#121e3c] shadow-lg shadow-black/20">
                    {availableLocales.map((locale) => {
                      const isSelected = locale.code === i18n.language
                      return (
                        <button
                          key={locale.code}
                          type="button"
                          onClick={() => handleLocaleChange(locale.code)}
                          className={cn(
                            'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-white/90 transition-colors first:rounded-t-lg last:rounded-b-lg',
                            isSelected
                              ? 'bg-white/10 font-medium text-white'
                              : 'hover:bg-white/5 hover:text-white',
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <span>{locale.emoji}</span>
                            <span>{locale.label}</span>
                          </span>
                          {isSelected && <Check className="size-4 text-[#f9c74f]" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
              <Button variant="accent" asChild>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="size-4" />
                  <span className="uppercase tracking-wide text-xs">
                    {t('app.buttons.github')}
                  </span>
                </a>
              </Button>
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="md:hidden bg-white text-[#0f1e3d] shadow-md shadow-black/10 hover:bg-white/90"
            onClick={() => setOpen(true)}
            aria-label={t('app.buttons.openNav')}
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
            <p className="text-lg font-semibold text-[#0f1e3d]">
              {t('app.menu.title')}
            </p>
            <p className="text-xs text-[#0f1e3d]/70">{t('app.menu.subtitle')}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label={t('app.buttons.closeNav')}
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        </div>
        <div className="space-y-4">
          {renderNav('light')}
          <div className="relative">
            <select
              aria-label="Change language"
              value={i18n.language}
              onChange={(event) => handleLocaleChange(event.target.value)}
              className="w-full rounded-lg border border-[#0f1e3d]/20 bg-white px-3 py-2 text-sm text-[#0f1e3d] outline-none transition-all hover:bg-[#0f1e3d]/5"
            >
              {availableLocales.map((locale) => (
                <option key={locale.code} value={locale.code}>
                  {`${locale.emoji} ${locale.label}`}
                </option>
              ))}
            </select>
          </div>
          <Button asChild className="w-full" variant="outline">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
              <Github className="size-4" />
              {t('app.buttons.github')}
            </a>
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
