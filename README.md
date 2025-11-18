# Open Pajak

Open Pajak is a fully client-side tax calculator for the Indonesian tax regime. The SPA bundles calculators for PPh 21/26, PPh 22, PPh 23, PPh Final Pasal 4(2), PPN, and PPNBM, and turns every calculation into a transparent table + formula narrative so practitioners can audit each step. All inputs stay in the browser—no personal identifiers (NIK, names, addresses) are ever collected or stored.

## Key Capabilities

- Multi-tax coverage: switch between `/pph21`, `/pph22`, `/pph23`, `/pph4-2`, `/ppn`, and `/ppnbm` via the TanStack Router powered `AppShell` navigation.
- Domain-specific forms: each route renders a `TaxPageLayout` with tailored inputs (subject types, PTKP, TER category, DPP overrides, inclusive/exclusive PPN mode, dsb) plus sample presets to help users learn the flows.
- Calculation transparency: pure functions in `src/lib/tax/*.ts` emit `breakdown` rows that surface DPP, PKP, tariff tiers, and rounding for every scenario. `FormulaExplanationCard` and `FormulaSourceNote` reference the official Buku PPh 21/26 guidance (`public/Buku_PPh2126_Release_20240108.pdf`).
- Shared UI primitives: form fields, number formatting, cards, tables, and alerts live in `src/components/**` for consistent styling with Tailwind + shadcn/ui tokens.
- Offline-first SPA: built with React 19, Vite, and Bun. No backend, so the bundle can be deployed to static hosting (Cloudflare Pages, Netlify, dsb.).

## Repository Layout

```text
open-pajak/
├─ README.md                # This file
├─ open-pajak-v1/           # Bun + Vite workspace
│  ├─ src/
│  │  ├─ components/        # AppShell, tax layout primitives, shadcn wrappers
│  │  ├─ lib/tax/           # Pure calculators per tax type (see tax-formulas-mapping.md)
│  │  └─ routes/            # File-based TanStack Router pages (one per tax calculator)
│  ├─ public/               # Static assets (favicon, Buku PPh reference PDF)
│  ├─ bun.lock / package.json / tsconfig.json
│  └─ vite.config.ts        # Vite + TanStack router plugin + Tailwind setup
├─ design.md                # UX + flow specs (keep handy when iterating)
└─ tax-formulas-mapping.md  # Mapping from regulations → calculator logic
```

> ℹ️ Only `README.md` is intended for upstream pushes; the other docs are local guidance to help reason about the product scope and formula mapping.

## Getting Started

All app code lives inside `open-pajak-v1/`. Use [Bun](https://bun.sh) (>= 1.1) for dependency management and scripts.

```bash
cd open-pajak-v1
bun install

# Local development (Vite dev server on port 3000)
bun dev

# Production bundle + type check
bun run build

# Preview the built assets
bun run serve
```

## Testing & Quality Gates

- `bun test` — run the Vitest suite (React Testing Library is available for DOM assertions).
- `bun run lint` — TypeScript-aware ESLint (TanStack config) for catching logic mistakes.
- `bun run format` — Prettier format check.
- `bun run check` — Convenience script (format write + eslint --fix) when sweeping the repo.

Add new tests next to their pages/engines (e.g., `src/routes/pph21/pph21.page.test.tsx` or `src/lib/tax/pph21.test.ts`) and focus on edge cases like TER rounding, PTKP thresholds, PKP zero floors, PPN inclusive pricing, etc.

## Working on Calculators

1. **Model the math first** inside `src/lib/tax/<tax>.ts`. Keep every helper pure/deterministic and follow the interfaces in `src/lib/tax/types.ts`.
2. **Update the UI** inside `src/routes/<tax-type>.tsx`, using shared primitives such as `TaxFormSection`, `TaxResultTable`, and `TaxSummaryCard`.
3. **Document formulas** with `FormulaExplanationCard` and source links so users can trace regulations back to Buku PPh / PMK references.
4. **Respect privacy**: inputs must remain numeric or enumerated metadata; never prompt for or persist personal identifiers.

Refer to `design.md` for UX copy, layout heuristics, and color tokens, and to `tax-formulas-mapping.md` for regulation-to-function mappings whenever you add or change flows.

## Deployment Notes

- The build is a static bundle; host it on any CDN/static host.
- Static assets live in `open-pajak-v1/public/`. Only keep essentials (favicon + PDF reference); unused template files have been removed.
- If you need environment toggles, use `import.meta.env`, but prefer committed constants whenever possible.

## License

This project is provided as-is for educational and operational use in calculating Indonesian taxes. Consult professional tax advisors before relying on the outputs for filings.
