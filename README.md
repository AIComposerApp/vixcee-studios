# Vixcee Studios

> **Your sites, tools, and apps live in days, not weeks.**  
> A mobile-first design and development studio landing experience crafted with precision typography, real-time physics marathons, 3D perspective carousels, and optimized AI agent prompt kits.

---

## ✨ Features

- **Interactive 3D Atomic Orbit Dot Grid**: Signature canvas interactive particle background in custom brand orange with cursor proximity scaling and revolving motion physics.
- **Angled 3D Website Showcase Carousel**: 
  - Smooth 3D depth-stacked presentation of front-facing website mockups.
  - Autonomous 6.5s auto-rotation with hover-pause.
  - Dual-zone floating follower cursor pills ("Previous" / "Next") with velvet lerped motion.
  - Touch swipe gestures and keyboard arrow navigation.
  - Raw, unclipped mockup presentation floating seamlessly without container frames.
- **"Simple and Fast" Process Grid**:
  - 3-step structured engagement pipeline (*Onboarding*, *Custom Plan*, *Live in Days*).
  - Custom SVG iconography and action triggers.
- **"Work that Performs" Dual-Column Physics Showcase**:
  - True portrait 13-site mobile showcase running an autonomous 60/120fps `requestAnimationFrame` loop.
  - Alternating vertical motion (Column 1 gliding UP, Column 2 gliding DOWN).
  - Fluid lerped scroll momentum with bi-directional reversal.
  - Dual presentation modes: upright vanishing edge gradient masks on desktop and an isometric 3D perspective stage on mobile/tablet.
- **Bento Grid Feature Architecture**: High-impact editorial grid breaking down engineering pillars, performance metrics, and responsive craft.
- **Interactive Modals**:
  - **Strategy Booking Call Modal**: Multi-step meeting scheduler with validation and service selection.
  - **AI Coding Agent Prompts Modal**: Copy-ready, battle-tested system prompts for AI tools (Bolt.new, v0, Cursor, Lovable, Claude) to accelerate site builds.
  - **Get Started Workflow**: Tailored intake flow for new client projects.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Motion**: Vanilla Canvas 2D + Hardware-accelerated CSS 3D Transforms + `requestAnimationFrame`

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/vixcee-studios.git

# Navigate to the project directory
cd vixcee-studios

# Install dependencies
npm install
```

### Development Server

Start the local Vite development server:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building for Production

Compile TypeScript and build optimized static assets:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Linting & Type Checking

```bash
npm run lint
```

---

## 📁 Project Structure

```
├── public/                 # Static public assets
├── src/
│   ├── components/         # Modular React components
│   │   ├── AngledCarousel.tsx       # 3D depth-stacked hero website carousel
│   │   ├── BentoGridSection.tsx     # Feature bento grid layout
│   │   ├── BookingModal.tsx         # Strategy consultation booking modal
│   │   ├── DotGridBackground.tsx    # Interactive canvas 3D dot grid
│   │   ├── GetStartedModal.tsx      # Project onboarding modal
│   │   ├── Header.tsx               # Studio navigation & branding bar
│   │   ├── Hero.tsx                 # Headline, rolling text, CTAs & 3D carousel
│   │   ├── KingCarousel.tsx         # "Simple and fast" 3-step process section
│   │   ├── LoadingScreen.tsx        # Initial studio loading screen
│   │   ├── PromptIcon.tsx           # Custom branded prompt icon
│   │   ├── PromptsModal.tsx         # AI prompt kits copy modal
│   │   ├── VerticalTextRoller.tsx   # Fluid headline text vertical roller
│   │   └── WorkShowcaseSection.tsx  # Dual-column physics mobile showcase
│   ├── App.tsx             # Root application orchestrator
│   ├── main.tsx            # React DOM mounting entry point
│   └── index.css           # Tailwind v4 theme, keyframes & base styles
├── index.html              # HTML entry point with preloaded assets & SEO tags
├── package.json            # Project manifest & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

---

## 📄 License

MIT © [Vixcee Studios](https://vixceestudios.com)
