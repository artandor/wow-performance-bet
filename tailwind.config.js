/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Casino / Goblin palette ──────────────────────────────────────
        night:   '#0d0a1a',   // page bg
        surface: '#1a1230',   // card bg
        elevated:'#241b42',   // hover surface
        rim:     '#2e2255',   // border / separator

        gold: {
          DEFAULT: '#ffc93c', // primary CTA
          mid:     '#f5a623', // hover state
          dark:    '#c47a1e', // pressed state
          glow:    '#ffc93c1a',
        },
        neon: {
          pink:   '#d946f5',  // accent / badge
          purple: '#a729d4',  // logo title
        },
        table:  '#b8420a',    // danger / casino rouge
        goblin: '#4aad3a',    // win / success
        bright: '#e8e0ff',    // text primary
        muted:  '#9b8ec4',    // text secondary
        dim:    '#ffffff18',  // border default

        // ── shadcn semantic aliases (point to CSS vars) ──────────────────
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted_tw: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans:    ['var(--font-sans)',    'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia',   'serif'],
      },
      boxShadow: {
        gold: '0 0 20px #ffc93c33',
        neon: '0 0 16px #d946f530',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
