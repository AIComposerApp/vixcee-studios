# Vixcee Studios

> **Your sites, tools, and apps live in days, not weeks.**  
> A mobile-first design and development studio landing experience crafted with precision typography, real-time physics marathons, 3D perspective carousels, and automated booking integration with Google Meet and Google Calendar.

---

## ✨ Features

- **Interactive 3D Atomic Orbit Dot Grid**: Signature canvas interactive particle background in custom brand orange with cursor proximity scaling and revolving motion physics.
- **Angled 3D Website Showcase Carousel**: 
  - Smooth 3D depth-stacked presentation of front-facing website mockups.
  - Autonomous 6.5s auto-rotation with hover-pause.
  - Dual-zone floating follower cursor pills ("Previous" / "Next") with velvet lerped motion.
  - Touch swipe gestures and keyboard arrow navigation.
- **"Simple and Fast" Process Grid**:
  - 3-step structured engagement pipeline (*Onboarding*, *Custom Plan*, *Live in Days*).
  - Custom SVG iconography and action triggers.
- **"Work that Performs" Dual-Column Physics Showcase**:
  - True portrait 13-site mobile showcase running an autonomous 60/120fps `requestAnimationFrame` loop.
  - Alternating vertical motion with fluid momentum.
- **Bento Grid Feature Architecture**: High-impact editorial grid breaking down engineering pillars, performance metrics, and responsive craft.
- **Automated Booking Engine**:
  - 3-Step Wizard (`Contact`, `Project`, `Schedule`) with international phone dialing code picker.
  - Real-time double-booking prevention via Firebase Firestore.
  - Automated Google Calendar event creation with dynamic Google Meet link generation.
  - Automated email dispatch via Resend or Nodemailer SMTP fallback.

---

## 🛠 Tech Stack & Architecture

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Motion (motion/react)](https://motion.dev/) + Hardware-accelerated CSS 3D Transforms + Canvas 2D
- **Server**: Express.js with Vite middleware integration, structured JSON logging, and `/healthz` monitoring
- **Data & Auth**: Firebase Firestore + Anonymous Authentication
- **Validation**: [Zod](https://zod.dev/) runtime schema validation for API request contracts
- **Testing**: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) + JSDOM
- **CI/CD**: GitHub Actions workflow running automated linting, type checks, unit tests, and production builds

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher recommended, Node 20 LTS tested)
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AIComposerApp/vixcee-studios.git

# Navigate to the project directory
cd vixcee-studios

# Install dependencies
npm install
```

### Environment Configuration

Copy the sample environment file and configure your credentials:

```bash
cp .env.example .env
```

| Variable | Description | Required | Default |
|---|---|---|---|
| `PORT` | Local server port | No | `3000` |
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) | No | `development` |
| `VITE_FIREBASE_API_KEY` | Firebase Client API Key | Yes | — |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication Domain | Yes | — |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | Yes | — |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Yes | — |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | Yes | — |
| `VITE_FIREBASE_APP_ID` | Firebase Web App ID | Yes | — |
| `RESEND_API_KEY` | Resend API Key for automated email dispatch | Optional | — |
| `SMTP_HOST` | Fallback SMTP server host | Optional | — |
| `SMTP_PORT` | Fallback SMTP port | Optional | `587` |
| `SMTP_USER` | Fallback SMTP username | Optional | — |
| `SMTP_PASS` | Fallback SMTP password | Optional | — |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service Account email for Calendar API | Optional | — |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Service Account private key for Calendar API | Optional | — |

*Note: For testing and local evaluation, zero external API keys are required. The server automatically falls back to offline mock mode when `NODE_ENV=test` or when credentials are not configured.*

---

## 💻 Running the Application

### Development Server

Start the local full-stack server (Express + Vite HMR):

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Health Check Endpoint

Query the server health endpoint for uptime and environment status:

```bash
curl http://localhost:3000/healthz
# Response: {"status":"ok","uptime":42.5,"timestamp":"2026-10-24T...","environment":"development"}
```

---

## 🧪 Testing & Quality Assurance

### Running Unit & Component Tests

Run the full test suite with Vitest in single-run mode:

```bash
npm test
```

Run tests in interactive watch mode:

```bash
npm run test:watch
```

### Type Checking & Linting

Verify TypeScript types without emitting files:

```bash
npm run lint
```

Verify formatting with Prettier:

```bash
npm run format:check
# To automatically format files:
npm run format
```

### Production Build

Compile TypeScript and build optimized static assets:

```bash
npm run build
```

---

## 🐳 Docker Deployment

Run the complete containerized stack using Docker and Docker Compose:

```bash
# Build and run the container
docker compose up --build

# Run in detached mode
docker compose up -d
```

The application will be accessible at `http://localhost:3000`.

---

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── ci.yml                   # Automated CI workflow (lint, test, build)
├── public/                          # Static public assets (icons, manifests)
├── src/
│   ├── components/                  # Modular React components
│   │   ├── booking/                 # Booking wizard subcomponents
│   │   │   ├── __tests__/           # Booking unit test suites
│   │   │   ├── BookingConfirmation.tsx
│   │   │   ├── CountryPicker.tsx
│   │   │   ├── Icons.tsx
│   │   │   ├── StepContact.tsx
│   │   │   ├── StepProject.tsx
│   │   │   ├── StepSchedule.tsx
│   │   │   └── types.ts
│   │   ├── header/                  # Modular navigation header components
│   │   │   ├── __tests__/
│   │   │   ├── MobileDrawer.tsx
│   │   │   └── NavIcons.tsx
│   │   ├── motion/                  # Framer motion & typography primitives
│   │   ├── AngledCarousel.tsx       # 3D depth-stacked hero website carousel
│   │   ├── BentoGridSection.tsx     # Feature bento grid layout
│   │   ├── BookingModal.tsx         # Strategy consultation booking modal
│   │   ├── BookingSection.tsx       # Primary booking section orchestrator
│   │   ├── DotGridBackground.tsx    # Interactive canvas 3D dot grid
│   │   ├── Header.tsx               # Studio navigation & branding bar
│   │   ├── Hero.tsx                 # Headline, rolling text, CTAs & 3D carousel
│   │   └── WorkShowcaseSection.tsx  # Dual-column physics mobile showcase
│   ├── server/                      # Server architecture & data layer
│   │   ├── __tests__/               # Server endpoint test suites
│   │   ├── integrations.ts          # Email & Google Calendar integrations
│   │   ├── logger.ts                # Structured JSON logging
│   │   └── schemas.ts               # Runtime Zod validation contracts
│   ├── test/
│   │   └── setup.ts                 # Vitest / Jest-DOM environment setup
│   ├── App.tsx                      # Root application orchestrator
│   ├── firebase.ts                  # Firebase SDK initialization
│   ├── main.tsx                     # React DOM mounting entry point
│   └── index.css                    # Tailwind v4 theme, keyframes & base styles
├── Dockerfile                       # Multi-stage Alpine container build
├── docker-compose.yml               # Container orchestration spec
├── server.ts                        # Express server entry point & API endpoints
├── vitest.config.ts                 # Vitest test runner configuration
├── package.json                     # Project manifest & scripts
├── tsconfig.json                    # TypeScript configuration
└── vite.config.ts                   # Vite configuration
```

---

## 📄 License

MIT © [Vixcee Studios](https://vixceestudios.com)
