# WidePlayer Design System

## Colors

The current landing page uses this palette:

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | `#fffdfb` | Page background |
| `soft` | `#f7f8ff` | Subtle surfaces and hover states |
| `ink` | `#07084a` | Text and dark panels |
| `ink-muted` | `#51537f` | Secondary text |
| `primary` | `#2839ff` | CTAs, links, active states |
| `violet` | `#704cff` | Gradients and platform accents |
| `lilac` | `#efe9ff` | Light icon and badge backgrounds |
| `orange` | `#ff5a14` | Headline accent |
| `mint` | `#2fc980` | Supported status |
| `sky` | `#1d9bf0` | Bluesky / social accent |

Primary CTA gradient:

```css
linear-gradient(135deg, #064bff 0%, #6d43ff 100%);
```

## Typography

Headlines use `Instrument Serif` for the logo, italic accents, and shorter section headings.
Body text uses `Inter`. The hero H1 is a heavy sans-serif with an orange `Instrument Serif` italic accent.

## Components

- Primary buttons use `button-gradient`, white text, and a 12 px radius.
- Cards use a white background, `border-ink/10`, and 12-24 px radius.
- The open source block uses `bg-ink` with white text.
- Platform status cards use a green border/status for X and neutral cards for upcoming platforms.
- Decorative elements are limited to the `dot-field` pattern and angled hero shapes. Avoid random gradient blobs.

## Page Structure

Landing page order:

1. Navbar
2. Hero with feed mockup and platform card
3. Three feature cards
4. Platforms
5. Open source
6. Install CTA
7. Footer

## Extension UI

Popup and options screens use the same palette through `apps/extension/src/shared/ui/theme.css`.
Do not bring back the old green and cream palette. If a new color is needed, add it as a theme variable first, then use it in popup/options styles.
