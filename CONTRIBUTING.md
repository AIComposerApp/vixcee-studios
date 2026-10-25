# Contributing to Vixcee Studios

Thank you for your interest in contributing to Vixcee Studios! We value thoughtful contributions, whether fixing bugs, optimizing animation loops, or expanding test coverage.

## Code of Conduct

Please maintain an inclusive, constructive, and respectful environment across all pull requests and discussions.

---

## Development Setup

1. **Prerequisites**:
   - Node.js `20.x` or `22.x` (LTS)
   - npm `10.x` or higher

2. **Clone & Install**:
   ```bash
   git clone https://github.com/AIComposerApp/vixcee-studios.git
   cd vixcee-studios
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The local server runs at `http://localhost:3000`.

---

## Code Quality Standards

Before submitting changes, ensure your code satisfies all automated quality gates:

### 1. Type Checking
```bash
npm run lint
```
Runs `tsc --noEmit` to ensure strict TypeScript compilation.

### 2. Linting (ESLint)
```bash
npm run lint:eslint
```
Runs ESLint with TypeScript and React rules enabled. All code must pass with zero errors.

### 3. Unit Tests & Coverage
```bash
npm run test:coverage
```
Runs the Vitest test suite with v8 coverage analysis.
- Minimum line coverage threshold: `50%`
- Minimum branch coverage threshold: `40%`

### 4. Code Formatting
```bash
npm run format:check
# To automatically format code:
npm run format
```

### 5. Production Build
```bash
npm run build
```

---

## Architectural Guidelines

- **File Size Discipline**: Keep files under 500 lines of code. Split complex components into cohesive child modules and custom hooks.
- **Error Handling**: Use the typed `AppError` hierarchy (`src/server/errors.ts`) in server handlers; never swallow errors or send unformatted stack traces to clients.
- **Logging**: Route all server-side events through `src/server/logger.ts` (`logger.info`, `logger.warn`, `logger.error`); avoid raw `console.log`.
- **Validation**: All API endpoints accepting incoming payloads must declare and validate against a Zod schema in `src/server/schemas.ts`.

---

## Git Workflow & Commit Guidelines

- **Branch Naming**:
  - `feat/<feature-name>` for new features
  - `fix/<bug-description>` for bug fixes
  - `refactor/<module-name>` for internal refactoring
  - `test/<component-name>` for test additions
- **Conventional Commits**: Write clear, imperative commit messages:
  - `feat: add international dial selector`
  - `fix(booking): prevent double-booking on confirmed slots`
  - `test(work): add unit tests for device switching`
  - `refactor(caseStudies): extract per-study data files`
- **Ship Features with Tests**: Always include corresponding unit tests in the same PR or commit.
