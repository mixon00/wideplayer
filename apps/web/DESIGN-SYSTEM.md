# WidePlayer — Design System

---

## Kolory

| Token | Hex | Użycie |
|-------|-----|--------|
| `cream` | `#FCF9F5` | Tło strony, główne tło |
| `warm-neutral` | `#F7F1EA` | Subtelne tła kart, badge, input |
| `earth-green` | `#1E3A24` | Główny kolor tekstu, przyciski, akcenty |
| `bright-green` | `#4ADE80` | Highlight, CTA hover, ikony check, pulse dot |
| `soft-bronze` | `#C4A484` | Akcent nagłówka, ikony dekoracyjne |
| `muted-text` | `#6B665F` | Drugorzędny tekst, linki nav |
| `ui-bg` | `#FFFFFF` | Białe powierzchnie |

### Przezroczystości

```
earth-green/5   → bardzo subtelne bordery
earth-green/10  → bordery kart
earth-green/60  → badge tekst
bright-green/20 → selekcja tekstu (::selection)
cream/60        → nawigacja z blur
```

---

## Typografia

### Fonty

```
Headline: Playfair Display (serif)
Body:     Inter (sans-serif)
Icons:    Material Symbols Outlined (variable font)
```

### Google Fonts import

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet"/>

<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet"/>
```

### Skala typograficzna

| Rola | Klasy Tailwind | Font |
|------|---------------|------|
| Hero H1 | `font-headline text-5xl md:text-8xl leading-[1.0] tracking-tight` | Playfair Display |
| Section H2 | `font-headline text-4xl md:text-6xl italic leading-tight` | Playfair Display italic |
| CTA H2 | `font-headline text-5xl md:text-8xl leading-none` | Playfair Display |
| Body large | `text-xl md:text-2xl font-light leading-snug` | Inter 300 |
| Body regular | `text-xl font-light leading-relaxed` | Inter 300 |
| Body small | `text-sm` | Inter 400 |
| Label / badge | `text-[11px] font-bold uppercase tracking-widest` | Inter 700 |
| Nav link | `text-[13px] font-medium` | Inter 500 |
| Caption | `text-[10px] font-bold uppercase tracking-[0.3em]` | Inter 700 |
| Footer heading | `text-[11px] font-bold uppercase tracking-widest` | Inter 700 |

---

## Kształty i zaokrąglenia

| Element | Wartość |
|---------|---------|
| Przyciski (pill) | `rounded-full` |
| Karty sekcji | `rounded-[3rem]` (48px) |
| CTA container | `rounded-[4rem]` (64px) |
| Info boxy | `rounded-3xl` (36px) |
| Ikony / logo box | `rounded-lg` (8px) |
| Browser frame | `rounded-2xl` (16px) |

---

## Cienie

```css
/* Główna karta / hero */
box-shadow:
  0 50px 100px -20px rgba(30, 58, 36, 0.15),
  0 30px 60px -30px rgba(0, 0, 0, 0.2);

/* Przyciski */
box-shadow: 0 10px 15px -3px rgba(30, 58, 36, 0.1);  /* shadow-lg shadow-earth-green/10 */

/* Karty floating */
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);   /* shadow-2xl */
```

---

## Efekty specjalne

```css
/* Frosted glass nav */
backdrop-filter: blur(25px);
-webkit-backdrop-filter: blur(25px);
background: rgba(252, 249, 245, 0.6); /* cream/60 */

/* Text selection */
::selection {
  background: rgba(74, 222, 128, 0.2); /* bright-green/20 */
  color: #1E3A24;
}

/* Material Symbols (ikony) */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24;
}

/* Antyaliasing */
-webkit-font-smoothing: antialiased;
```

---

## Animacje i przejścia

| Efekt | Implementacja |
|-------|--------------|
| Hover przyciski | `hover:opacity-90 transition-all active:scale-95` |
| Hover linki | `hover:text-earth-green transition-colors` |
| Badge pulse | `animate-pulse` |
| Bounce badge | `animate-bounce` |
| Expand card hover | `transition-all duration-700 hover:w-[350px]` |
| Panel / player expand | `transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]` |
| Toggle knob | `transition-all duration-500` |

> **Główna krzywa easing:** `cubic-bezier(0.23, 1, 0.32, 1)` — sprężyste, "apple-like" wyjście

---

## Tailwind config

### v4 — `globals.css`

```css
@import "tailwindcss";

@theme {
  --color-cream:        #FCF9F5;
  --color-warm-neutral: #F7F1EA;
  --color-earth-green:  #1E3A24;
  --color-bright-green: #4ADE80;
  --color-soft-bronze:  #C4A484;
  --color-muted-text:   #6B665F;
  --color-ui-bg:        #FFFFFF;

  --font-headline: "Playfair Display", serif;
  --font-body:     "Inter", sans-serif;
}

body {
  background-color: #FCF9F5;
  color: #1E3A24;
  -webkit-font-smoothing: antialiased;
}

.apple-blur {
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
}
```

### v3 — `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "cream":        "#FCF9F5",
        "warm-neutral": "#F7F1EA",
        "earth-green":  "#1E3A24",
        "bright-green": "#4ADE80",
        "soft-bronze":  "#C4A484",
        "muted-text":   "#6B665F",
        "ui-bg":        "#FFFFFF",
      },
      fontFamily: {
        headline: ["Playfair Display", "serif"],
        body:     ["Inter", "sans-serif"],
      },
    },
  },
} satisfies Config;
```

---

## Wzorzec sekcji

```
Sekcja 1 (Hero)     → tło cream    #FCF9F5
Sekcja 2 (Benefits) → tło white    #FFFFFF
Sekcja 3 (CTA)      → tło dark     #1E3A24  (tekst: cream)
Footer              → tło cream    #FCF9F5  + border-top earth-green/5
```

---

## Komponenty — wzorce

### Badge / pill

```html
<div class="inline-flex items-center space-x-2 bg-warm-neutral/50 px-4 py-1.5 rounded-full border border-earth-green/5">
  <span class="w-2 h-2 bg-bright-green rounded-full animate-pulse"></span>
  <span class="text-[11px] font-bold uppercase tracking-widest text-earth-green/60">Label</span>
</div>
```

### Przycisk primary (light bg)

```html
<button class="bg-earth-green text-cream px-6 py-2.5 rounded-full text-[13px] font-semibold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-earth-green/10">
  Label
</button>
```

### Przycisk primary (dark bg)

```html
<button class="bg-cream text-earth-green px-12 py-5 rounded-full text-xl font-bold hover:bg-bright-green transition-all active:scale-95 shadow-2xl">
  Label
</button>
```

### Info box

```html
<div class="bg-warm-neutral/40 p-8 rounded-3xl border border-earth-green/5 flex items-start space-x-6">
  <div class="p-3 bg-white rounded-2xl shadow-sm">
    <!-- ikona -->
  </div>
  <div>
    <h4 class="font-bold text-earth-green mb-1">Tytuł</h4>
    <p class="text-sm text-muted-text">Opis</p>
  </div>
</div>
```

### Nawigacja (fixed + blur)

```html
<nav class="fixed top-0 w-full z-[100] bg-cream/60 apple-blur border-b border-earth-green/5">
  <div class="flex justify-between items-center px-6 md:px-12 py-5 max-w-7xl mx-auto">
    <!-- logo + links + cta -->
  </div>
</nav>
```
