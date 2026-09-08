# Delco Divas Website Design Guidelines

## Design Philosophy
**Theatrical, High-Impact, Artistic** - This is a digital stage that demands attention. Think fashion editorial meets kinetic energy, not corporate wellness. Push boundaries with dramatic contrast, bold typography, and intentional asymmetry.

## Color Palette
- **Primary**: Pure black (#000000) and white (#FFFFFF)
- **Accent**: Elegant grays for subtle emphasis - use charcoal (#1A1A1A), soft gray (#F5F5F5), and near-white (#FAFAFA)
- **Gold Accent**: Metallic gold (#D4AF37) for:
  - Active page highlighting in navigation
  - All button backgrounds (CTAs, form submits, action buttons)
  - Play button hover effects
- **Luxury monochrome aesthetic** - maintain stark, dramatic contrast with sophisticated grayscale hierarchy

## Typography System

**Display Font (Headlines)**: Bold, editorial serif for "Delco Divas" branding (Playfair Display or Bodoni style)
- Hero headlines: 4xl to 6xl (72-96px desktop)
- Section headers: 3xl to 4xl (48-72px desktop)
- Weight: 700-900 (black/bold)

**Body Font**: Clean, modern sans-serif (Inter or similar)
- Body text: base to lg (16-18px)
- Weight: 400-500 (regular/medium)
- Line height: relaxed (1.75)

**Accent Typography**: Strategic use of italic or letterspaced uppercase for emphasis
- Subheadings: uppercase, tracking-wide
- Pull quotes: italic, text-2xl to text-3xl

## Layout System

**Spacing**: Use Tailwind units of 4, 8, 12, 16, 20, and 32 for consistency
- Section padding: py-20 to py-32 (desktop), py-12 to py-16 (mobile)
- Component spacing: gap-8 to gap-12
- Generous whitespace - let content breathe

**Grid Strategy**:
- Container: max-w-7xl for full sections
- Content: max-w-6xl for standard layouts
- Text: max-w-prose for readability
- Asymmetric layouts that intentionally break the grid

## Page-Specific Layouts

### Home Page (Landing)
**Hero Section**:
- Full viewport height (100vh) video background
- Autoplay, loop, muted
- Dark overlay (bg-black/40) for text legibility
- Centered dramatic typography with fade-in animation
- Headline: Mix bold serif "Delco Divas" with clean sans-serif tagline
- Large CTA button with scale and glow hover effect
- Button background: blurred backdrop (backdrop-blur-sm bg-white/10)

**Below Hero**:
- Alternating full-width sections with rhythm
- One section: text-heavy on left (60%), image on right (40%)
- Next section: inverted layout
- Use parallax scrolling for depth

### About Page
**Founder Bios - Asymmetric Layout**:
- First founder: Left 60% with overlapping portrait bleeding off left edge
- Text content with generous margin
- Second founder: Separate section, inverted (portrait right, text left)
- Large pull quotes in stylized italic typography (text-3xl, italic)
- Portraits: One stark black-and-white, one with subtle gradient overlay

### Delco Divas Day Page
**Event Grid**:
- Masonry layout with varied card sizes (2-column desktop, 1-column mobile)
- Images zoom subtly on hover (scale-105 transition)
- Active cards: glowing gold border (border-2 border-gold shadow-lg shadow-gold/50)
- Date badges: Elegant labels positioned absolute top-right
- Horizontal scrolling gallery for featured events (overflow-x-auto snap-x)

### Newsletter Subscription
**Invitation Design**:
- Large, compelling headline: "Join the Movement" (text-5xl, bold)
- Minimal, sophisticated form with floating labels
- Input focus: scale animation, gold underline
- Submit button: Statement piece (px-12 py-4, text-lg, gold background)

### Event Sign-Up Page
**Countdown Timer**:
- Large numbers (text-6xl to text-8xl)
- Elegant typography with separator colons
- Premium form layout: generous spacing (space-y-8)
- Micro-interactions on input focus (border glow, label slide)
- Subtle particle effects background (non-distracting)

### Merchandise Page
**Fashion Lookbook Style**:
- Large product photography (aspect-square or aspect-[3/4])
- Dramatic lighting emphasis
- Hover reveals full description (overlay fade-in)
- "Contact to Purchase" styled as exclusive button
- Grid: 2-column desktop, 1-column mobile

### Media Page
**Video Presentation**:
- Fox 29 video with large cinematic thumbnail
- Custom play button overlay (centered, gold, large scale)
- Press wall layout for additional coverage: grid of elegant cards with quotes

## Component Library

### Navigation Header (Fixed)
- Backdrop blur (backdrop-blur-md bg-black/80)
- Logo left, links right split layout
- Consider full-screen overlay on mobile: oversized links with stagger animation
- Smooth scroll behavior

### Buttons
**Primary CTA**:
- Large presence (px-8 py-4, text-lg)
- Blurred background on images (backdrop-blur-sm bg-white/10)
- Hover: scale-105, gold glow (shadow-lg shadow-gold/50)
- Transition: all 300ms ease

**Secondary**:
- Outline style (border-2)
- Hover: filled with smooth transition

### Footer
- Minimal, sophisticated
- Social icons with smooth hover transitions (scale, gold highlight)
- Single row: links left, social right

## Animations & Interactions

**Essential Movements**:
- Scroll-triggered stagger animations for content reveals
- Text reveals animating words/letters individually (GSAP or Framer Motion)
- Parallax scrolling on images (subtle, 20-30% speed difference)
- Smooth page transitions between routes

**Micro-Interactions**:
- All interactive elements: scale on hover (scale-105)
- Buttons: glow effect on hover
- Images: zoom on hover in cards
- Form inputs: border glow and label animation on focus

**Loading States**:
- Elegant skeleton screens with gold shimmer
- Animated spinner for form submissions
- Success messages: celebratory (confetti or scale-in animation)

## Images
**Hero Section**: Full-width, full-height video of Divas dancing at retreat
**About Page**: Two high-quality founder portraits (professional, candid style)
**Diva Day Page**: Gallery of event photos showing energy and community
**Merchandise Page**: Product photography with dramatic lighting on black or white background
**Media Page**: Fox 29 video thumbnail with professional screenshot

## Responsive Behavior
- Mobile: Intentionally designed, not just stacked
- Navigation: Consider elegant hamburger with full-screen overlay
- Typography: Scale down appropriately (text-4xl mobile vs text-6xl desktop)
- Spacing: Reduce padding on mobile (py-12 vs py-32)
- Grid: Always single column on mobile for clarity

## Critical Mandate
Every page needs one "whoa" moment - unexpected, beautiful, delightfully interactive. Avoid templates and predictability. This site must feel custom-crafted and artistic from the first pixel.