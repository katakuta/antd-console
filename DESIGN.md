# Design System

Console Frame is built on a three-layer theming architecture powered by antd 6.x Design Tokens.

## Token Architecture

### Layer 1: Seed Tokens

Foundation values that drive the entire theme:

| Token | Default | Description |
|-------|---------|-------------|
| `colorPrimary` | `#27364d` | Brand actions, links, selected states |
| `borderRadius` | `8` | Global corner radius |
| `fontSize` | `14` | Base font size |
| `fontFamily` | Plus Jakarta Sans | UI / body typeface |
| `fontFamilyCode` | Geist Mono | Monospace / tabular numbers |

### Layer 2: Semantic Tokens

Derived from seed tokens through antd algorithms (`darkAlgorithm`, `compactAlgorithm`):

- **Color semantics**: `colorSuccess`, `colorWarning`, `colorError`, `colorInfo`
- **Background hierarchy**: `colorBgLayout` → `colorBgContainer` → `colorBgElevated`
- **Text hierarchy**: `colorText` → `colorTextSecondary` → `colorTextTertiary`
- **Border**: `colorBorder` → `colorBorderSecondary`
- **Component tokens**: Button, Menu, Card, Modal, Table, Layout

### Layer 3: CSS Variables

Framework-level CSS custom properties for layout chrome:

```css
--app-font-sans       /* body typeface */
--app-font-mono       /* code / tabular typeface */
--app-page-max-width  /* 1440px */
--app-body-bg         /* page background */
--app-glass-bg        /* header/topnav backdrop */
--app-chrome-h        /* total chrome height */
--app-content-h       /* remaining content height */
--app-scrollbar-*     /* custom scrollbar styling */
```

### Navigation CSS Variables

Navigation theme is decoupled from content theme, allowing dark sidebar + light content:

```css
--app-nav-bg-container    /* sidebar background */
--app-nav-bg-elevated     /* elevated surface background */
--app-nav-bg-hover        /* hover state */
--app-nav-border          /* separator lines */
--app-nav-primary         /* active item color */
--app-nav-primary-bg      /* active item background */
--app-nav-text            /* primary text */
--app-nav-text-secondary  /* secondary text */
```

## Theme Presets

Six color presets with light and dark variants:

| Preset | Swatch | Personality |
|--------|--------|-------------|
| **Graphite** | `#27364d` | Professional, enterprise (default) |
| **Ocean** | `#0085b9` | Calm, trustworthy |
| **Robinhood** | `#00a300` | Fresh, growth-oriented |
| **Violet** | `#615ed6` | Creative, modern |
| **Gold** | `#ac5b00` | Warm, premium |
| **Rose** | `#bc3181` | Energetic, distinctive |

Each preset defines `colorPrimary`, `colorSuccess`, `colorError`, `colorTextBase` for light mode, plus comprehensive dark mode overrides.

## Layout System

### Side Layout (default)

```
┌──────────┬──────────────────────────────────┐
│  Sider   │  Header (56px)                    │
│  260px   ├──────────────────────────────────┤
│          │                                   │
│  Menu    │  Content                          │
│          │                                   │
│          │                                   │
│  Footer  │                                   │
└──────────┴──────────────────────────────────┘
```

- Sider: 260px expanded, 68px collapsed (icon rail)
- Collapse trigger at top-right of sider
- Icon rail shows leaf page icons with tooltips

### Top Layout

```
┌──────────────────────────────────────────────┐
│  Header (56px)                               │
├──────────────────────────────────────────────┤
│  TopNav (44px)  Overview | Components | ...  │
├──────────────────────────────────────────────┤
│                                              │
│  Content                                     │
│                                              │
└──────────────────────────────────────────────┘
```

- Category groups as dropdown buttons
- Active state: primary color + bold weight
- 44px secondary navigation bar

### Responsive Breakpoint

- **≥ 1024px**: Desktop (Sider or TopNav)
- **< 1024px**: Mobile (hamburger + Drawer)

## Density Modes

| Mode | `sizeUnit` | `sizeStep` | Feel |
|------|-----------|-----------|------|
| **Default** | 2 | 6 | Balanced |
| **Compact** | compact algorithm | | Dense tables/forms |
| **Spacious** | 3 | 8 | Relaxed, more padding |

## Typography

### Fonts

- **Plus Jakarta Sans** (Variable, 200–800): Body text, headings, UI elements
- **Geist Mono** (Variable, 100–800): Code, tabular numbers, data display

Both loaded as variable fonts with `font-display: swap`.

### Scale

Font size range: 12px – 16px (user-configurable via Settings).
Line height: browser default (~1.4 for body, ~1.57 for paragraphs).

## Component Patterns

### Table Kit

Two reusable components for data-heavy pages:

**SearchBar**
- Field types: `text`, `select`, `date`, `datetime`, `checkbox`
- Width variants: `narrow` (140px), `medium` (180px), `wide` (260px)
- Collapsible (fields beyond threshold hidden behind "More Filters")
- Select search with multi-select aggregation
- Text input debounce (300ms)

**DataTable**
- Columns with custom render functions
- Row actions: ≤4 displayed directly, >4 in dropdown
- Built-in pagination, selection, and scroll
- Delete confirmation via antd Modal

### Forms

Patterns demonstrated in Form Demo:
- **Basic Form**: `Form.Item` with validation rules
- **Step Form**: `Steps` + conditional form sections
- **Dynamic Form**: `Form.List` with add/remove

### Data Display

Common patterns for non-table pages:
- **Stat cards**: `Statistic` + trend indicators
- **Card grids**: Responsive `Row` + `Col`
- **Progress**: Linear and circular indicators
- **Timeline**: Vertical event feed

## Color Modes

### Light Mode

- Background: `#f6f7f9`
- Surface: `#ffffff`
- Text: dark tone from preset
- Glass effect: `rgba(246, 247, 249, 0.72)` + backdrop blur

### Dark Mode

- Background: `#0f172a`
- Surface: preset dark `colorBgContainer`
- Text: light tone from preset
- Glass effect: `rgba(15, 23, 42, 0.72)` + backdrop blur
- Wireframe borders enabled for better definition

### System Mode

Follows `prefers-color-scheme` media query with live updates.

## Persistence

All user preferences saved to `localStorage`:

| Key | Content |
|-----|---------|
| `console_frame.settings.v1` | Theme settings (layout, mode, density, preset, etc.) |
| `console_frame.token` | Auth token |
| `console_frame.userInfo` | User profile data |
| `console_frame.lastPagePath` | Last visited page (for login redirect) |
| `console_frame.locale` | Language preference |

## Design Principles

1. **Token First** — Never hardcode colors, spacing, or radii; use antd tokens or CSS variables
2. **Density Matters** — Admin consoles need compact, scannable layouts; avoid marketing hero sections
3. **Theme Compatibility** — Every style must work in both light and dark modes
4. **No Nested Cards** — Cards only for repeated items, modals, or explicit tool panels
5. **Responsive by Default** — Text must not overflow, tables must scroll, layouts must adapt
6. **Static Configs** — Field arrays, options, and column definitions belong at module level, not inline in JSX
