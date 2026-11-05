# Shared Extracted Icons Specification
## Overview
- Target src/components/icons.tsx. Shared foundation, not an independent page section.
- Appearance and SVG paths directly extracted from reference DOM; source in src/data/icons.json and public/assets/luma/icons/.
## DOM Structure
- Named functions LogoIcon,SparkleIcon,InstagramIcon,XIcon,MailIcon,WelcomeIcon,PhoneIcon,GoogleIcon,PasskeyIcon.
- Render static trusted extracted SVG via display:contents span so parent source CSS continues selecting descendant svg.
## Computed Styles
- All currentColor. Headerlogoheight16,footericonswidth16,welcome36,providericons16 inherited from surrounding exact sourceCSS.
## States & Behaviors
- Color inherits link/button hover. Welcome SVG includes original600ms SMIL door/arrow animation. No new click handlers.
## Per-State Content / Text Content
- N/A; decorative SVG with aria-hidden wrapper; parent control provides label.
## Assets
- Nine unique exact DOMSVGs, deduplicated and downloaded. No generated substitute paths.
## Responsive
- Headerlogo stable; footer swaps sparkle/wordmark through parent visibility classes.
