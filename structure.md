# Hakeem Web — Project Structure & Design System Reference

> Blueprint for building the **Hakeem** web application with **Next.js + TypeScript + Axios**. Same brand, colors, and core pages — with a proper web layout (sidebar, navbar, dialogs) and no mobile/native patterns.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [App Shell — Sidebar & Navbar](#4-app-shell--sidebar--navbar)
5. [Routes & Navigation](#5-routes--navigation)
6. [Design System](#6-design-system)
7. [Tailwind Configuration](#7-tailwind-configuration)
8. [Global CSS Utilities](#8-global-css-utilities)
9. [Layout & Spacing Conventions](#9-layout--spacing-conventions)
10. [UI Component Patterns](#10-ui-component-patterns)
11. [API Layer (Axios)](#11-api-layer-axios)
12. [State Management](#12-state-management)
13. [Internationalization (i18n)](#13-internationalization-i18n)
14. [Authentication Flow](#14-authentication-flow)
15. [Page Specifications](#15-page-specifications)
16. [TypeScript Types](#16-typescript-types)
17. [Icons](#17-icons)
18. [Components — To Be Defined](#18-components--to-be-defined)
19. [Responsive Behavior](#19-responsive-behavior)

---

## 1. Project Overview

**Hakeem** is a patient-owned medical history organizer. Patients upload medical documents, review AI-extracted data, build a structured **Medical CV**, and control sharing/export.

The web app covers the same core product areas as the design reference:

- Home dashboard
- Medical timeline
- Medical CV (view, download, share)
- Document upload flow
- Patient profile & settings
- Auth & onboarding

**Out of scope for web (mobile-only features):**

- Push notifications
- Alarms / device reminders
- Bottom tab bar / FAB navigation
- Any native device APIs

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js** (App Router) |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS v3** |
| HTTP | **Axios** |
| State | **Zustand** |
| Forms | **React Hook Form** |
| i18n | **next-intl** or **i18next** |
| Icons | **Lucide React** + **Hugeicons React** |
| Dialogs / Dropdowns | **Radix UI** or **shadcn/ui** |
| Toasts | **sonner** or similar |
| Class merging | `clsx` + `tailwind-merge` via `cn()` |
| Variants | `class-variance-authority` (CVA) |
| Backend | ASP.NET Core API |
| Base URL | `http://hakeem1.runasp.net` |

---

## 3. Folder Structure

```
hakeem-web/
├── public/
│   ├── fonts/                          # Optional local font files
│   └── images/                         # Logos, onboarding illustrations
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout (fonts, providers)
│   │   ├── page.tsx                    # Auth gate → redirect
│   │   ├── globals.css
│   │   │
│   │   ├── (marketing)/                # Public pages (optional)
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (onboarding)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                # Step 1
│   │   │   ├── step-2/page.tsx
│   │   │   └── step-3/page.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── layout.tsx              # Centered auth layout (no sidebar)
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   │
│   │   ├── (dashboard)/                # Authenticated app shell
│   │   │   ├── layout.tsx              # Sidebar + Navbar wrapper
│   │   │   ├── home/page.tsx
│   │   │   ├── timeline/page.tsx
│   │   │   ├── medical-cv/page.tsx
│   │   │   ├── upload/
│   │   │   │   ├── page.tsx            # Category selection
│   │   │   │   ├── details/page.tsx
│   │   │   │   └── processing/page.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx            # Settings hub
│   │   │       ├── personal-info/page.tsx
│   │   │       ├── privacy/page.tsx
│   │   │       ├── change-password/page.tsx
│   │   │       ├── delete-account/page.tsx
│   │   │       └── help/page.tsx
│   │   │
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx            # Sidebar + main area
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   ├── ui/                         # Button, Input, Dialog, etc.
│   │   ├── home/
│   │   ├── timeline/
│   │   ├── medical-cv/
│   │   ├── upload/
│   │   └── settings/
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── profile.ts
│   │   │   ├── documents.ts
│   │   │   └── index.ts
│   │   ├── theme/
│   │   │   ├── colors.ts
│   │   │   └── fonts.ts
│   │   ├── utils.ts
│   │   └── storage.ts                  # Token helpers (cookies / localStorage)
│   │
│   ├── store/
│   │   ├── useProfileStore.ts
│   │   └── useDocumentStore.ts
│   │
│   ├── types/
│   │   ├── profile.ts
│   │   ├── document.ts
│   │   └── ui.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useMediaQuery.ts            # Sidebar collapse breakpoint
│   │
│   └── localization/
│       ├── i18n.ts
│       ├── EN/
│       └── AR/
│
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. App Shell — Sidebar & Navbar

The authenticated app uses a classic **dashboard layout**: fixed sidebar on the left, top navbar, scrollable content area.

```
┌──────────────────────────────────────────────────────────┐
│  Navbar (64px) — breadcrumbs, search, language, avatar   │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│  Sidebar   │           Main Content Area                 │
│  (240px)   │           (scrollable)                      │
│            │                                             │
│  - Home    │   ┌─────────────────────────────────────┐   │
│  - Timeline│   │  PageHeader (title + actions)       │   │
│  - Med CV  │   ├─────────────────────────────────────┤   │
│  - Upload  │   │                                     │   │
│  ───────── │   │  Page content                       │   │
│  - Settings│   │                                     │   │
│            │   └─────────────────────────────────────┘   │
│  [Logo]    │                                             │
│  [Collapse]│                                             │
└────────────┴─────────────────────────────────────────────┘
```

### Sidebar (`Sidebar.tsx`)

| Property | Value |
|---|---|
| Width (expanded) | `240px` |
| Width (collapsed) | `72px` |
| Background | `#FFFFFF` (`surface`) |
| Right border | `1px solid #E5E7EB` (`border`) |
| Position | `fixed left-0 top-0 h-screen` |
| Z-index | `40` |

**Nav items:**

| Label | Route | Icon |
|---|---|---|
| Home | `/home` | `Home` |
| Timeline | `/timeline` | `Clock` |
| Medical CV | `/medical-cv` | `FileText` |
| Upload | `/upload` | `Upload` |
| — divider — | | |
| Settings | `/settings` | `Settings` |

**Nav item styles:**

| State | Classes |
|---|---|
| Default | `text-text2-500 hover:bg-bg hover:text-primary-900` |
| Active | `bg-primary-50 text-primary-900 font-jakarta-semibold` |
| Icon circle | `w-9 h-9 rounded-lg flex items-center justify-center` |

**Logo area (top of sidebar):**

```
Hakeem wordmark
bg-primary-50 icon square + "Hakeem" text-primary-900 font-jakarta-bold
Padding: px-4 py-5
```

**Collapse toggle (bottom):**

```
Icon: PanelLeftClose / PanelLeftOpen
Shows labels when expanded, icon-only when collapsed
```

### Navbar (`Navbar.tsx`)

| Property | Value |
|---|---|
| Height | `64px` |
| Background | `#FFFFFF` with `border-b border-border` |
| Position | `sticky top-0 z-30` |
| Left offset | Matches sidebar width (`ml-[240px]` or `ml-[72px]`) |

**Navbar contents (left → right):**

| Slot | Content |
|---|---|
| Left | `Breadcrumbs` — current page trail |
| Center (optional) | Global search input (timeline/documents) |
| Right | Language switcher (EN / AR), user avatar dropdown |

**User dropdown menu:**

- View profile → `/settings/personal-info`
- Settings → `/settings`
- Sign out

### Auth & onboarding layouts

These route groups **do not** use the sidebar/navbar shell:

- `(auth)/` — centered card layout, max-width `480px`
- `(onboarding)/` — full-width split layout (illustration + content)

---

## 5. Routes & Navigation

### Auth gate (`/`)

```
1. Show loading spinner (bg-bg, color primary #1A56DB)
2. Check localStorage/cookie:
   - hasLaunched → first visit flag
   - accessToken → verify JWT exp
3. Redirect:
   - authenticated  → /home
   - first launch   → /onboarding
   - otherwise      → /login
```

### Public / auth routes

| Route | Page |
|---|---|
| `/login` | Email + password, Google OAuth, encryption banner |
| `/register` | Account creation |
| `/forgot-password` | Request reset link |
| `/reset-password` | Set new password |

### Onboarding routes

| Route | Step | Theme |
|---|---|---|
| `/onboarding` | Step 1 | `primary` |
| `/onboarding/step-2` | Step 2 | `secondary` |
| `/onboarding/step-3` | Step 3 | `dark` |

### Dashboard routes (sidebar navigation)

| Route | Page |
|---|---|
| `/home` | Dashboard — profile card, alerts, quick actions, activity |
| `/timeline` | Chronological medical history with filters & search |
| `/medical-cv` | Generated CV — view, download PDF, share link |
| `/upload` | Document category selection |
| `/upload/details` | File upload + metadata form |
| `/upload/processing` | AI extraction progress |

### Settings routes (nested under `/settings`)

| Route | Page |
|---|---|
| `/settings` | Settings hub (profile card + menu list) |
| `/settings/personal-info` | Editable profile fields |
| `/settings/privacy` | Privacy & data controls |
| `/settings/change-password` | Password change form |
| `/settings/delete-account` | Account deletion |
| `/settings/help` | Help & support |

---

## 6. Design System

### 6.1 Color Palette

Source of truth: `src/lib/theme/colors.ts`

#### Primary (Blue)

| Token | Hex | Usage |
|---|---|---|
| `primary-50` | `#EBF3FB` | Input backgrounds, icon circles, active nav item bg |
| `primary-100` | `#D5E4F8` | Info banners, active card backgrounds |
| `primary-200` | `#AAC9F2` | Active icon circles |
| `primary-300` | `#7FADEB` | Onboarding backgrounds |
| `primary-400` | `#4D82E3` | Profile avatar bg |
| `primary-500` / `primary` | `#1A56DB` | **Buttons, links, spinners, focus rings** |
| `primary-700` | `#1440A7` | Medical profile card bg |
| `primary-800` | `#11368C` | Onboarding CTA buttons |
| `primary-900` | `#0E2D72` | **Headings, sidebar active text, navbar accents** |

#### Secondary (Green / Teal)

| Token | Hex | Usage |
|---|---|---|
| `secondary-50` | `#E8F7F1` | Visit tags, info banners |
| `secondary-100` | `#D1EFE4` | Radiation category active state |
| `secondary-500` / `secondary` | `#0D9B6C` | Secondary buttons |
| `secondary-700` | `#096F4E` | Visit tag text |
| `secondary-900` | `#06432E` | Active secondary text |

#### Tertiary (Purple)

| Token | Hex | Usage |
|---|---|---|
| `tertiary-50` | `#F1EEF9` | Lab tag backgrounds |
| `tertiary-700` | `#482D9B` | Lab tag text |

#### Danger / Destructive

| Token | Hex | Usage |
|---|---|---|
| `danger-50` | `#FEF2F2` | Delete/warning card bg |
| `danger-200` | `#FECACA` | Danger card border |
| `danger-600` / `destructive` | `#DC2626` | Error text, destructive actions |

#### Background & Surface

| Token | Hex | Usage |
|---|---|---|
| `bg` / `background` | `#F9FAFB` | **Page background** |
| `bg-100` | `#FDFDFE` | Hover state on menu rows |
| `bg-600` | `#D1D2D3` | Borders, dividers |
| `bg-700` | `#A9AAAB` | Unselected filter chip border |
| `bg-800` | `#818283` | Input labels |
| `surface` / `card` | `#FFFFFF` | **Cards, sidebar, navbar** |

#### Text

| Token | Hex | Usage |
|---|---|---|
| `text` / `foreground` | `#1F2937` | **Primary body text** |
| `text2-400` | `#838994` | Empty state text |
| `text2-500` / `muted-foreground` | `#6B7280` | **Secondary text, captions** |

#### Semantic aliases

| Token | Value |
|---|---|
| `border` | `#E5E7EB` |
| `input` | `#E5E7EB` |
| `ring` | `#1A56DB` |
| `muted` | `#F3F4F6` |

#### Page backgrounds

| Page | Background |
|---|---|
| Dashboard pages | `#F9FAFB` / `bg-bg` |
| Home | `#F8FAFC` (slightly cooler) |
| Auth pages | `#FFFFFF` |
| Sidebar / Navbar | `#FFFFFF` |

#### Timeline category colors

| Category | Node bg | Icon color |
|---|---|---|
| Labs | `#BFD0F5` | `#1648B8` |
| Visits | `#F3E8FF` | `#9333EA` |
| Medications | `#A9E6D2` | `#0D9B6C` |
| Scans | `#FEF3C7` | `#D97706` |

#### Review alert banner (warning)

| Element | Color |
|---|---|
| Background | `#FFFBEB` |
| Border | `#FDE68A` |
| Icon circle | `#FEF3C7` / `#D97706` |
| Title | `#92400E` |
| Subtitle | `#B45309` |

---

### 6.2 Typography

#### Font families

Load via `next/font/google`:

| Tailwind class | Font | Usage |
|---|---|---|
| `font-inter-regular` | Inter 400 | Body text, descriptions |
| `font-inter-medium` | Inter 500 | Info banner text |
| `font-jakarta-semibold` | Plus Jakarta Sans 600 | **Buttons, nav items, chips** |
| `font-jakarta-bold` | Plus Jakarta Sans 700 | **Page titles, card headings** |

#### Type scale

| Role | Classes | Size |
|---|---|---|
| Page title | `font-jakarta-bold text-[28px] text-primary-900` | 28px |
| Section title | `font-jakarta-bold text-[26px] text-primary-900` | 26px |
| Subsection | `font-jakarta-bold text-[20px] text-gray-900` | 20px |
| Card title | `font-jakarta-bold text-[15px]` | 15px |
| Body | `font-inter-regular text-[14px]` | 14px |
| Caption | `font-inter-regular text-[13px] text-text2-500` | 13px |
| Button | `font-jakarta-semibold text-[16px]` | 16px |
| Badge | `font-jakarta-bold text-[9px] uppercase tracking-wide` | 9px |

#### Utility classes (`globals.css`)

```css
.text-header    → font-inter-bold text-2xl leading-tight
.text-subheader → font-inter-bold text-xl leading-tight
.text-regular   → font-inter-regular text-base leading-normal
```

---

### 6.3 Border Radius

| Class | Value | Usage |
|---|---|---|
| `rounded-full` | 9999px | Avatars, chips, icon buttons |
| `rounded-[28px]` | 28px | **Cards, settings containers, CTA buttons** |
| `rounded-[20px]` | 20px | Avatar squares |
| `rounded-[18px]` | 18px | Settings icon containers |
| `rounded-[16px]` | 16px | Timeline cards |
| `rounded-2xl` | 16px | Buttons, inputs, banners |
| `rounded-3xl` | 24px | Medical profile card |
| `rounded-xl` | 12px | Auth encryption banner |
| `rounded-lg` | 8px | Sidebar nav icon containers |

**Rule of thumb:** Cards → `rounded-[28px]`. Inputs/buttons → `rounded-2xl`. Filter chips → `rounded-full`.

---

### 6.4 Spacing

| Context | Value |
|---|---|
| Dashboard content padding | `p-6` (24px) or `p-8` (32px) on large screens |
| Page max-width | `max-w-7xl mx-auto` |
| Card internal padding | `p-4` – `p-5` |
| Section gap | `gap-6` / `mb-6` – `mb-8` |
| Sidebar nav item | `px-3 py-2.5 gap-3` |
| Navbar horizontal padding | `px-6` |
| Button height | `46px` (default) / `56px` (primary auth CTA) |
| Input height | `46px` |
| Icon button | `40×40px` |

---

### 6.5 Shadows & Borders

| Pattern | Classes |
|---|---|
| Card | `shadow-sm border border-bg-600` |
| Sidebar | `border-r border-border` |
| Navbar | `border-b border-border` |
| Dialog overlay | `bg-black/50 backdrop-blur-sm` |
| Dialog panel | `rounded-2xl shadow-xl border border-border` |
| Dropdown | `rounded-xl shadow-lg border border-border` |

---

### 6.6 Interactive States (Web)

| State | Pattern |
|---|---|
| Hover | `hover:bg-bg` on nav rows, `hover:opacity-90` on buttons |
| Focus | `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` |
| Active nav | `bg-primary-50 text-primary-900` |
| Disabled | `opacity-50 cursor-not-allowed` |
| Loading | Spinner + `pointer-events-none opacity-70` |
| Selected chip | `bg-primary-900 text-white border-primary-900` |
| Unselected chip | `bg-white text-bg-800 border-bg-700` |

---

## 7. Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { colors } from './src/lib/theme/colors';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inter-regular': ['var(--font-inter)', 'Inter', 'sans-serif'],
        'inter-medium': ['var(--font-inter)', 'Inter', 'sans-serif'],
        'jakarta-semibold': ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
        'jakarta-bold': ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        ...colors,
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#1A56DB',
        background: '#F9FAFB',
        foreground: '#1F2937',
        primary: { foreground: '#FFFFFF', ...colors.primary },
        secondary: { foreground: '#FFFFFF', ...colors.secondary },
        destructive: { DEFAULT: '#EF4444', foreground: '#FFFFFF' },
        muted: { DEFAULT: '#F3F4F6', foreground: '#6B7280' },
        card: { DEFAULT: '#FFFFFF', foreground: '#111827' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### Font loading

```typescript
// src/app/layout.tsx
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700'],
});
```

---

## 8. Global CSS Utilities

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --primary: 221.3 78.8% 48.1%;
    --primary-foreground: 0 0% 100%;
    --secondary: 160.1 84.1% 39.4%;
    --secondary-foreground: 0 0% 100%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --destructive: 0 84.2% 60.2%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 63%;
    --radius: 0.625rem;

    /* Layout tokens */
    --sidebar-width: 240px;
    --sidebar-collapsed-width: 72px;
    --navbar-height: 64px;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-bg text-text font-inter-regular antialiased;
  }
}

@layer utilities {
  .text-header    { @apply font-inter-bold text-2xl leading-tight; }
  .text-subheader { @apply font-inter-bold text-xl leading-tight; }
  .text-regular   { @apply font-inter-regular text-base leading-normal; }
}
```

### `cn()` helper

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 9. Layout & Spacing Conventions

### Dashboard page shell

```tsx
// src/app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <Navbar />
      <Sidebar />
      <main
        className="min-h-screen pt-[var(--navbar-height)] transition-[margin] duration-200"
        style={{ marginLeft: 'var(--sidebar-width)' }}
      >
        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          {children}
        </div>
      </main>
    </AppShell>
  );
}
```

### Standard page structure

```tsx
// Inside any dashboard page
<>
  <PageHeader
    title="Timeline"
    description="Your complete medical history"
    actions={<Button>Upload</Button>}
  />
  <div className="mt-6 space-y-6">
    {/* page sections */}
  </div>
</>
```

### Auth page shell

```tsx
<div className="flex min-h-screen items-center justify-center bg-white px-6">
  <div className="w-full max-w-[480px]">
    {children}
  </div>
</div>
```

### RTL support

When Arabic is active:

```tsx
<html lang="ar" dir="rtl">
```

Use logical properties where possible:

- `ms-*` / `me-*` instead of `ml-*` / `mr-*`
- `ps-*` / `pe-*` instead of `pl-*` / `pr-*`
- Sidebar moves to the **right** side in RTL
- Chevron icons flip direction

---

## 10. UI Component Patterns

### Button (CVA)

| Variant | Background | Text |
|---|---|---|
| `primary` | `bg-primary hover:bg-primary-600` | `text-white` |
| `secondary` | `bg-secondary hover:bg-secondary-600` | `text-white` |
| `outline` | `border border-primary bg-transparent hover:bg-primary-50` | `text-primary` |
| `ghost` | `hover:bg-bg` | `text-text` |
| `destructive` | `bg-destructive hover:bg-danger-700` | `text-white` |

Base: `inline-flex items-center justify-center rounded-2xl h-[46px] px-4 font-jakarta-semibold text-[16px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`

### Input

```
Label:     text-sm font-jakarta-bold text-bg-800 mb-2
Field:     h-[46px] rounded-2xl border border-input bg-primary-50 px-4
           focus-visible:ring-2 focus-visible:ring-primary
Error:     border-destructive + text-xs text-destructive mt-1
Placeholder: text-text2-400
```

### Card

```
bg-surface rounded-[28px] border border-bg-600 shadow-sm p-5
```

### InfoBanner

Default (green):
```
bg-[rgba(188,235,220,0.39)] border border-[rgba(192,201,194,0.30)]
rounded-2xl p-4 flex gap-3 items-start
text-[13px] font-jakarta-medium text-secondary-900
```

Primary variant (Medical CV):
```
bg-primary-100 text-primary-900 border-transparent
```

### ActionTile (web equivalent of quick-action cards)

Used on Home and Upload category selection.

| State | Background | Border | Circle |
|---|---|---|---|
| Active (primary) | `bg-primary-100` | `border-primary-900` | `bg-primary-200` |
| Active (secondary) | `bg-secondary-100` | `border-secondary` | `bg-secondary-200` |
| Default | `bg-surface` | `border-border` | `bg-primary-50` |

Base: `rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors hover:border-primary-300`

### TimelineCard tag variants

| Variant | Background | Text |
|---|---|---|
| labs | `bg-tertiary-50` | `text-tertiary-700` |
| medication | `bg-primary-50` | `text-primary-700` |
| visits | `bg-secondary-50` | `text-secondary-700` |
| scans | `bg-[#FEF3C7]` | `text-[#D97706]` |

Card base: `bg-white rounded-[16px] p-4 border border-[#C2C7D1] shadow-sm hover:shadow-md transition-shadow`

### Filter chips

| State | Classes |
|---|---|
| Selected | `bg-primary-900 text-white border-primary-900` |
| Default | `bg-white text-bg-800 border-bg-700 hover:border-primary-300` |

Base: `px-4 py-2 rounded-full text-[13px] font-jakarta-semibold border cursor-pointer`

### Dialog / Modal

Use Radix Dialog or shadcn `<Dialog>`:

```
Overlay:  fixed inset-0 bg-black/50 backdrop-blur-sm z-50
Content:  fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          bg-surface rounded-2xl shadow-xl border p-6 w-full max-w-md
```

For share-link / expiry flows on Medical CV page.

---

## 11. API Layer (Axios)

### Client setup

```typescript
// src/lib/api/client.ts
export const BASE_URL = 'http://hakeem1.runasp.net';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});
```

### Request interceptor

1. Read `accessToken` from cookie or localStorage
2. If JWT expired → clear tokens
3. Attach `Authorization: Bearer {token}`

### Response interceptor

- `401` → clear tokens → `window.location.href = '/login'` (skip on login/register endpoints)

### Error shape

```typescript
interface ApiError {
  message: string;
  errorList: { propertyName?: string; message?: string }[];
}
```

### Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | Login |
| POST | `/auth/register` | Register |
| POST | `/auth/logout` | Logout |
| GET | `/profile` | Get profile |
| PATCH | `/profile` | Update profile |
| POST | `/documents` | Upload (multipart/form-data) |
| GET | `/documents/:id/extracted-fields` | Poll extraction status |

### Upload (FormData)

```typescript
formData.append('File', file);           // from <input type="file">
formData.append('DocumentType', type);
formData.append('Title', title);
formData.append('DocumentDate', date);   // YYYY-MM-DD
```

### Token storage

Prefer **httpOnly cookies** set by a Next.js Route Handler or API route. Fallback: `localStorage` for MVP.

---

## 12. State Management

Zustand stores — client-side only.

### `useProfileStore`

| Field | Type |
|---|---|
| `profile` | `ProfileData \| null` |
| `fetchStatus` | `'idle' \| 'loading' \| 'success' \| 'error'` |
| `fetchError` | `string` |
| `isSaving` | `boolean` |

Actions: `fetchProfile(force?)`, `updateProfileField(field, value)`, `resetProfile()`

### `useDocumentStore`

Upload flow state: `categoryId`, `file`, `title`, `documentDate`, `documentId`.

Actions: `setCategoryId()`, `setFile()`, `setMetadata()`, `reset()`

---

## 13. Internationalization (i18n)

### Languages

| Code | Language |
|---|---|
| `en` | English |
| `ar` | Arabic (RTL) |

### Namespaces

| Namespace | Used in |
|---|---|
| `common` | Shared UI strings |
| `home` | Home dashboard |
| `timeline` | Timeline page |
| `medicalCv` | Medical CV page |
| `settings` | Settings pages |
| `upload` | Upload flow |
| `onboarding` | Onboarding steps |
| `auth` | Login / register |

Storage key: `APP_LANGUAGE` → `'en' | 'ar'`

Language switcher lives in the **Navbar** dropdown.

---

## 14. Authentication Flow

```
App load (/)
    │
    ├─ token valid? ──yes──► /home
    │
    ├─ first launch? ──yes──► /onboarding
    │
    └─ no ──► /login
```

**Login success:** save tokens → fetch profile → redirect `/home`

**Logout:** POST `/auth/logout` → clear tokens → redirect `/login`

**Protected routes:** `(dashboard)/layout.tsx` checks auth server-side (middleware or layout) and redirects unauthenticated users to `/login`.

---

## 15. Page Specifications

### Home (`/home`)

Background: `#F8FAFC`

| Section | Component | Notes |
|---|---|---|
| Medical Profile Card | `MedicalProfileCard` | `bg-primary-700 rounded-3xl`, progress bar, completion % |
| Upcoming Appointment | `UpcomingAppointmentCard` | Next scheduled visit |
| Review Alert | `ReviewAlertBanner` | Yellow warning — items needing patient review |
| Quick Actions | `QuickActionsGrid` | Upload, Timeline, Medical CV |
| Recent Activity | `RecentActivitySection` | Latest document/activity feed |

Quick action links:
- Upload → `/upload`
- Timeline → `/timeline`
- Medical CV → `/medical-cv`

---

### Timeline (`/timeline`)

Background: `bg-bg`

| Section | Component | Notes |
|---|---|---|
| Page header | `PageHeader` | Title + inline search |
| Filters | `TimelineFilterChips` | All, Visits, Labs, Medications, Scans |
| Timeline | `TimelineGroup` + `TimelineCard` | Grouped by year |

Filter IDs: `all`, `visits`, `labs`, `medications`, `scans`

---

### Medical CV (`/medical-cv`)

| Section | Component | Notes |
|---|---|---|
| Header actions | `PageHeader` | Download PDF + Share buttons |
| Banner | `MedicalCvBanner` | Blue CTA to share CV |
| Info | `InfoBanner` | "All statements are sourced" |
| Content | CV sections (TBD) | Structured medical history display |
| Dialogs | `SetExpiryDialog`, `ShareLinkDialog` | Expiry: 24h, 7d, 30d, custom |

---

### Upload (`/upload`)

| Step | Route | Content |
|---|---|---|
| 1 | `/upload` | Category: Medical Tests (primary) vs Medical Radiation (secondary) |
| 2 | `/upload/details` | Drag-and-drop file zone, title, date, confirm dialog |
| 3 | `/upload/processing` | Progress indicator, polls extraction API |

Category IDs: `1` = Medical Tests, `2` = Medical Radiation

---

### Settings (`/settings`)

| Section | Notes |
|---|---|
| Profile card | `ProfileSummaryCard` — avatar initials, name, status badge |
| Menu list | Card with rows: Personal Info, Privacy, Language, Help |
| Sign out | Destructive-outline button at bottom |
| Version | Footer caption `text-[11px] text-text2-500` |

Settings menu routes:
1. Personal Info → `/settings/personal-info`
2. Privacy → `/settings/privacy`
3. Language → inline or dialog (EN / AR)
4. Help & Support → `/settings/help`

Sub-pages (change-password, delete-account) use `Breadcrumbs` back to Settings.

---

### Auth pages

Shared layout:
- White background, centered card
- Logo: Hakeem wordmark
- Primary CTA: `bg-primary h-14 rounded-2xl w-full`
- Google button: `border border-text2-100 rounded-2xl h-14 w-full`
- Encryption note: `bg-primary-50 rounded-xl px-4 py-3 text-[11px] font-jakarta-bold text-primary-900`

---

### Onboarding

Split layout (full viewport, no sidebar):

- **Left panel (50%):** Colored illustration area
- **Right panel (50%):** White — pagination dots, title, description, Next button

| Step | Panel color | CTA |
|---|---|---|
| 1 | `bg-primary-300` | `bg-primary-800` |
| 2 | `bg-secondary-300` | `bg-secondary-800` |
| 3 | `bg-[#212E3B]` | `bg-text-500` (light text) |

---

## 16. TypeScript Types

```typescript
// types/profile.ts
interface ProfileData {
  userId: string;
  email: string;
  fullName: string;
  birthDate: string;
  status: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
}

type EditableProfileField = 'firstName' | 'lastName' | 'email' | 'phoneNumber';

// types/document.ts
interface UploadDocumentPayload {
  file: File;
  documentType: string;
  title: string;
  documentDate: string;
}

// types/ui.ts
interface ButtonProps { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'; ... }
interface InfoBannerProps { text: string; icon?: React.ReactNode; variant?: 'default' | 'primary' | 'warning'; }
```

---

## 17. Icons

Use **Lucide React** as the primary icon set. Map to Hugeicons where a specific design asset is needed.

| Icon (Lucide) | Used in |
|---|---|
| `Home` | Sidebar — Home |
| `Clock` | Sidebar — Timeline |
| `FileText` | Sidebar — Medical CV |
| `Upload` | Sidebar — Upload |
| `Settings` | Sidebar — Settings |
| `Search` | Navbar / Timeline search |
| `Share2` | Medical CV share |
| `Download` | Medical CV download |
| `Stethoscope` | Medical tests category |
| `ScanLine` | Medical radiation category |
| `AlertTriangle` | Review alert banner |
| `ChevronRight` | Breadcrumbs, list items |
| `Globe` | Language switcher |
| `LogOut` | Sign out |
| `PanelLeftClose` | Sidebar collapse |

---

## 18. Components — To Be Defined

### Layout

- [ ] `AppShell` — sidebar + navbar + content wrapper
- [ ] `Sidebar` — nav links, logo, collapse toggle
- [ ] `Navbar` — breadcrumbs, search, language, user menu
- [ ] `PageHeader` — title, description, action slot
- [ ] `Breadcrumbs`

### UI primitives

- [ ] `Button` (CVA variants)
- [ ] `Input` / `Textarea`
- [ ] `Select`
- [ ] `Dialog`
- [ ] `DropdownMenu`
- [ ] `Toast`
- [ ] `InfoBanner`
- [ ] `ActionTile`
- [ ] `Avatar`
- [ ] `Badge`
- [ ] `Spinner`

### Home

- [ ] `MedicalProfileCard`
- [ ] `UpcomingAppointmentCard`
- [ ] `ReviewAlertBanner`
- [ ] `QuickActionsGrid`
- [ ] `RecentActivitySection`

### Timeline

- [ ] `TimelineFilterChips`
- [ ] `TimelineGroup`
- [ ] `TimelineCard`

### Medical CV

- [ ] `MedicalCvBanner`
- [ ] `SetExpiryDialog`
- [ ] `ShareLinkDialog`
- [ ] CV section components (TBD)

### Upload

- [ ] `FileDropzone`
- [ ] `CategorySelector`
- [ ] `ConfirmUploadDialog`
- [ ] `ProcessingView`

### Settings

- [ ] `ProfileSummaryCard`
- [ ] `SettingsMenu`
- [ ] `PersonalInfoForm`
- [ ] `EditFieldDialog`
- [ ] `LanguageSelector`

### Auth & Onboarding

- [ ] `AuthCard`
- [ ] `OnboardingLayout`
- [ ] `OnboardingStep`

---

## 19. Responsive Behavior

### Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 768px` (mobile) | Sidebar hidden → hamburger menu in Navbar opens a **Sheet/Drawer** |
| `768px – 1024px` (tablet) | Sidebar collapsed (icon-only, 72px) |
| `≥ 1024px` (desktop) | Sidebar expanded (240px) |

### Mobile drawer

When sidebar is hidden, the Navbar shows a `Menu` icon that opens a left Sheet with the same nav items as the Sidebar.

### Content grid

| Component | Mobile | Desktop |
|---|---|---|
| Quick Actions | 2 columns | 4 columns |
| Home cards | stacked | 2-column where appropriate |
| Timeline | full width | max-w-4xl centered |
| Auth card | full width | max-w-[480px] centered |
| Onboarding | stacked panels | side-by-side 50/50 |

### Dashboard content area

```tsx
// Responsive main content offset
className={cn(
  'transition-[margin] duration-200',
  isMobile ? 'ml-0' : isCollapsed ? 'ml-[72px]' : 'ml-[240px]'
)}
```

---

## Quick Reference

```
Brand primary:      #1A56DB  (buttons, links, focus rings)
Brand dark:         #0E2D72  (headings, active nav)
Brand secondary:    #0D9B6C  (secondary actions, visit tags)
Page background:    #F9FAFB
Surface:            #FFFFFF  (cards, sidebar, navbar)
Text primary:       #1F2937
Text secondary:     #6B7280
Border:             #E5E7EB
Card radius:        28px
Button radius:      16px (rounded-2xl)
Heading font:       Plus Jakarta Sans Bold
Body font:          Inter Regular
Sidebar width:      240px (expanded) / 72px (collapsed)
Navbar height:      64px
API base:           http://hakeem1.runasp.net
```

---

*Web-only reference for the Hakeem Next.js project. Components listed in §18 will be implemented separately.*
