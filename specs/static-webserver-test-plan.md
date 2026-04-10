# Frontend UI Element Test Plan

## Application Overview

UI-focused test plan for the frontend served at https://guimoneda.com. Tests target visible screen elements (navigation, hero, CTAs, project cards, social links, images, text content, and accessibility/keyboard interactions). Assume a fresh browser session and that the site resolves to the production environment.

## Test Scenarios

### 1. Frontend UI Element Tests

**Seed:** `tests/seed.spec.ts`

#### 1.1. Navigation and header links

**File:** `specs/ui/nav.spec.ts`

**Steps:**
  1. Load `https://guimoneda.com/`
    - expect: Navigation is present and visible
    - expect: Brand link navigates to `/`
    - expect: Links: `Home`, `Experience`, and `Admin` exist with correct hrefs
  2. Tab through navigation links using keyboard
    - expect: Each link receives focus in logical order
    - expect: Focused link has visible focus indicator
    - expect: Enter/Space activates the focused link and navigates accordingly

#### 1.2. Hero section content and CTAs

**File:** `specs/ui/hero.spec.ts`

**Steps:**
  1. Load `https://guimoneda.com/` and locate hero section
    - expect: Heading `Hi, I'm Moneda` and a role/title text `Senior QA Engineer` are present
    - expect: Intro paragraph includes expected key phrases (e.g., `10+ years`, `Python`, `Selenium`)
    - expect: Primary CTA `View My Work` links to `/jobs` and is styled as a primary button
    - expect: Secondary CTA `Contact Me` uses `mailto:` and opens mail client when activated
  2. Keyboard activation of CTAs
    - expect: Buttons are reachable by keyboard and activate with `Enter`/`Space`
    - expect: `mailto:` opens or returns appropriate response in test environment (non-destructive)

#### 1.3. Project cards and list interactions

**File:** `specs/ui/projects.spec.ts`

**Steps:**
  1. Scroll to `Latest Projects` area
    - expect: Section heading `Latest Projects` visible
    - expect: Project cards (Program Manager, Technical Project Manager, Scrum Master) exist with titles and short descriptions
    - expect: Each card is focusable (linkable) and navigates to detail or `/jobs` when clicked
  2. Open a project card via keyboard and mouse
    - expect: Mouse click opens expected link
    - expect: Keyboard `Enter`/`Space` on focused card opens expected link
    - expect: No JS errors thrown on activation

#### 1.4. Images, alt text, and lazy loading

**File:** `specs/ui/images.spec.ts`

**Steps:**
  1. Inspect all `img` elements on the page
    - expect: Each meaningful image includes non-empty `alt` text
    - expect: Social icons have appropriate `aria-label` or `alt` for accessibility
    - expect: Large images use `loading="lazy"` where applicable or are optimized by CDN
  2. Verify image MIME and successful load
    - expect: Image requests return 200 and correct `Content-Type` (e.g., `image/png`, `image/svg+xml`)
    - expect: No broken images (no 404 responses) on the home page

#### 1.5. Text content correctness and markup

**File:** `specs/ui/text.spec.ts`

**Steps:**
  1. Validate presence and correctness of key textual elements
    - expect: Primary heading hierarchy uses a single `h1`
    - expect: Subsections use `h2`/`h3` appropriately
    - expect: Key phrases (`10+ years`, `Moneda`, role titles) are present and spelled correctly
  2. Check paragraph lengths and wrapping on narrow viewports
    - expect: No overflowing text or horizontal scroll introduced by long strings
    - expect: Readable line lengths at mobile widths

#### 1.6. Social links and external link safety

**File:** `specs/ui/social.spec.ts`

**Steps:**
  1. Inspect social links (`GitHub`, `LinkedIn`, `Instagram`)
    - expect: Each social link points to the correct external URL
    - expect: Links open in a new tab if configured and include `rel="noopener noreferrer"` when target is `_blank`
    - expect: External links are marked for screenreaders where appropriate

#### 1.7. Interactive states, hover and focus styles

**File:** `specs/ui/interaction-states.spec.ts`

**Steps:**
  1. Hover and focus primary interactive elements (buttons, links, cards)
    - expect: Hover state changes (color, shadow) applied to CTAs
    - expect: Focus state visibly distinct for keyboard users
    - expect: No layout shift occurs when states applied

#### 1.8. Keyboard navigation and skip links

**File:** `specs/ui/keyboard.spec.ts`

**Steps:**
  1. Tab through the whole page from top to bottom
    - expect: Logical focus order (nav → hero CTAs → project cards → footer)
    - expect: No trapped focus regions
    - expect: Presence of a `skip to content` link is recommended (flag if missing)

#### 1.9. Responsive layout checks (mobile/tablet/desktop)

**File:** `specs/ui/responsive.spec.ts`

**Steps:**
  1. Emulate common viewports (375x812, 768x1024, 1440x900) and load homepage
    - expect: Navigation collapses into mobile menu at small widths or remains usable
    - expect: Hero text scales and remains legible
    - expect: Project cards stack vertically on narrow widths without overlap

#### 1.10. Accessibility (a11y) critical checks

**File:** `specs/ui/a11y.spec.ts`

**Steps:**
  1. Run automated accessibility checks on `https://guimoneda.com/` (axe/core or Lighthouse)
    - expect: No critical violations (color contrast, missing alt, missing form labels)
    - expect: Interactive elements have accessible names (`aria-label` or visible text)

#### 1.11. SEO and metadata presence (visual elements)

**File:** `specs/ui/seo.spec.ts`

**Steps:**
  1. Inspect page head meta tags and visible open-graph previews
    - expect: `<title>` present and descriptive
    - expect: `meta description` present
    - expect: Visible hero and social preview images referenced in meta tags correspond to displayed visuals

#### 1.12. Animation and motion respect (prefers-reduced-motion)

**File:** `specs/ui/motion.spec.ts`

**Steps:**
  1. Load the page with `prefers-reduced-motion` enabled
    - expect: Animations are reduced or disabled when preference set
    - expect: No content is inaccessible when motion is reduced

#### 1.13. Broken links and navigation integrity

**File:** `specs/ui/broken-links.spec.ts`

**Steps:**
  1. Crawl in-page links and linked hrefs for 200/3xx/4xx/5xx responses
    - expect: Internal links return 200 or valid redirects
    - expect: No broken internal links (4xx/5xx) found on the home page
    - expect: External links allowed to 4xx/5xx are flagged for manual review

#### 1.14. Image performance hints (srcset, sizes)

**File:** `specs/ui/image-performance.spec.ts`

**Steps:**
  1. Inspect image tags for `srcset`/`sizes` attributes and compressed formats (webp/avif)
    - expect: Responsive images use `srcset`/`sizes` when appropriate
    - expect: Compressed/modern formats used where possible for large images

#### 1.15. Contact CTA behavior

**File:** `specs/ui/contact.spec.ts`

**Steps:**
  1. Activate `Contact Me` CTA
    - expect: `mailto:` link includes expected email address
    - expect: Client environment (test runner) handles mailto non-destructively or test verifies attribute value only

#### 1.16. Automated UI smoke test

**File:** `specs/ui/smoke.spec.ts`

**Steps:**
  1. Visit homepage and run a short smoke list: presence of nav, hero h1, primary CTA, three project cards, and footer social links
    - expect: All checked elements present and visible
    - expect: No JavaScript console errors at page load (or only non-fatal warnings)
