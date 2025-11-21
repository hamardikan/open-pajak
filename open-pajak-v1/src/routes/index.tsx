import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRightIcon, Calculator, Github, ShieldCheck, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { FormulaSourceNote } from '../components/FormulaSourceNote'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const calculatorCards = [
  { to: '/pph21', titleKey: 'home.calculatorList.cards.pph21.title', descKey: 'home.calculatorList.cards.pph21.description' },
  { to: '/pph22', titleKey: 'home.calculatorList.cards.pph22.title', descKey: 'home.calculatorList.cards.pph22.description' },
  { to: '/pph23', titleKey: 'home.calculatorList.cards.pph23.title', descKey: 'home.calculatorList.cards.pph23.description' },
  { to: '/pph4-2', titleKey: 'home.calculatorList.cards.pph4_2.title', descKey: 'home.calculatorList.cards.pph4_2.description' },
  { to: '/ppn', titleKey: 'home.calculatorList.cards.ppn.title', descKey: 'home.calculatorList.cards.ppn.description' },
  { to: '/ppnbm', titleKey: 'home.calculatorList.cards.ppnbm.title', descKey: 'home.calculatorList.cards.ppnbm.description' },
]

const GITHUB_URL = 'https://github.com/hamardikan/open-pajak'

function HomePage() {
  const { t } = useTranslation()
  const features = (t('home.features', { returnObjects: true }) as Array<{
    title: string
    description: string
  }>)

  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-[32px] bg-white/80 p-8 shadow-xl shadow-[#0f1e3d]/5 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f5a524]">
            {t('home.hero.eyebrow')}
          </p>
          <h1 className="text-4xl font-bold text-[#0f1e3d]">
            {t('home.hero.title')}
          </h1>
          <p className="text-[#0f1e3d]/70 text-lg">
            {t('home.hero.body')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="accent">
              <Link to="/pph21">
                {t('home.hero.ctaPrimary')} <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="size-4" />
                {t('home.hero.ctaSecondary')}
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {features.map((feature, index) => {
            const icons = [Calculator, ShieldCheck, Sparkles]
            const Icon = icons[index] ?? Calculator
            return (
              <Highlight
                key={feature.title}
                icon={<Icon className="size-6" />}
                title={feature.title}
                description={feature.description}
              />
            )
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#0f1e3d]">
              {t('home.calculatorList.title')}
            </h2>
            <p className="text-sm text-[#0f1e3d]/70">
              {t('home.calculatorList.subtitle')}
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {calculatorCards.map((calc) => (
            <Card key={calc.to} className="p-0">
              <CardContent className="p-6 space-y-3">
                <p className="text-sm font-semibold text-[#f5a524]">
                  {t('app.brand')}
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#0f1e3d]">
                      {t(calc.titleKey)}
                    </h3>
                    <p className="text-sm text-[#0f1e3d]/70">
                      {t(calc.descKey)}
                    </p>
                  </div>
                  <Button asChild variant="accent" size="icon">
                    <Link to={calc.to}>
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <FormulaSourceNote />
    </div>
  )
}

function Highlight({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4 rounded-3xl border border-[#0f1e3d]/10 bg-[#0f1e3d]/5 p-4 text-[#0f1e3d] md:items-center">
      <div className="flex aspect-square size-14 items-center justify-center rounded-2xl bg-white text-[#0f1e3d] shadow-lg">
        <div className="flex size-full items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold">{title}</p>
        <p className="text-sm text-[#0f1e3d]/80">{description}</p>
      </div>
    </div>
  )
}
