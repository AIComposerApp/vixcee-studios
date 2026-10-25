# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-25

### Added
- **ESLint Flat Configuration**: Added modern `eslint.config.js` with TypeScript support and strict rulesets.
- **Typed Error Architecture**: Created `src/server/errors.ts` defining `AppError`, `ValidationError`, `NotFoundError`, `AuthenticationError`, and `IntegrationError`.
- **Vitest Code Coverage**: Added `@vitest/coverage-v8` with enforced coverage thresholds (`lines: 50%`, `branches: 40%`) and `npm run test:coverage` script.
- **Unit Test Breadth**: Expanded test suite from 7 to 12 spec files and 40 assertions covering `BookingSection`, `WorkPage`, `integrations`, `AngledCarousel`, and `TestimonialsSection`.
- **Automated Dependency Updates**: Added `.github/dependabot.yml` configured for weekly npm package scans.
- **Security Audit Step**: Integrated `npm audit --audit-level=high` directly into `.github/workflows/ci.yml`.
- **Documentation**: Added `CHANGELOG.md` and `CONTRIBUTING.md`.

### Changed
- **Modularized Large Source Files**: Split all files exceeding 500 lines into cohesive, single-responsibility modules:
  - `caseStudies.ts` (716 LOC) extracted into `src/data/caseStudies/` domain files.
  - `WorkPage.tsx` (773 LOC) modularized with `workTransforms.ts`, `workData.ts`, `WorkGridItem.tsx`, and `EmberHorizonBackground.tsx`.
  - `WorkShowcaseSection.tsx` (718 LOC) refactored into `ShowcasePhoneCard.tsx` and `showcaseData.ts`.
  - `BookingSection.tsx` (687 LOC) refactored into `BookingHeroInfo.tsx`, `StepWizardNav.tsx`, and `useBookingSchedule.ts`.
  - `Header.tsx` (593 LOC) split into `HeaderLogo.tsx` and `ResourcesDropdown.tsx`.
  - `CaseStudyDetailPage.tsx` (574 LOC) refactored into `CaseStudyDock.tsx` and `MoreCaseStudiesSection.tsx`.
  - `AngledCarousel.tsx` (519 LOC) extracted data layer into `carouselData.ts`.
  - `server.ts` (543 LOC) streamlined to 420 LOC with extracted `emailTemplates.ts`.
- **Structured Server Logging**: Eliminated direct `console.*` calls in `server.ts` and `integrations.ts`, standardizing on JSON-structured `logger.*` outputs.
- **Node.js Environment**: Pinned CI runner to Node.js 22 LTS with split lint, typecheck, coverage, and build stages.
