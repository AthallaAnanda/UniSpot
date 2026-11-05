# Luma Discover — page topology

Source: https://luma.com/discover, captured 4 November 2026 using Playwright.

1. Header: fixed full-width, 52px navigation + 1px divider; z-index 10. Persistent 180px blue/lavender gradient, backdrop blur 16px. Scroll changes divider only.
2. Intro: flow content starts after 53px reserved header height. Centered 820px border-box container including 16px gutters. Title then descriptive text.
3. Categories: 12 linked image-and-text cards. Desktop 3 columns; mobile 2 horizontal rows. Click navigates to a category, native horizontal scrolling on mobile.
4. Featured Calendars: 7 linked cards, desktop 3 columns; mobile 3 rows flowing horizontally in 300px columns. Follow opens sign-in modal; card navigates to calendar.
5. Explore Local Events: 5 click-driven region tabs. Default Asia & Pacific in captured session. 87 cities across all states. Desktop 4 columns, tablet 3, mobile 2.
6. Footer: container-aligned divider, logo, three text links, three social/contact icons and app link.
7. Follow modal: dialog overlay above document, email/phone toggle and third-party sign-in controls. No real authentication in clone.

No scroll-driven tab switching or reveal effects observed. No Lenis/Locomotive wrapper. Body uses native vertical scrolling. Only mobile calendar strip uses horizontal scroll-snap and smooth scrolling.

Implementation retains the reference's extracted CSS, utility class names and scoped JSX selectors. External destinations retain canonical luma.com links; / and /discover serve the local page. Assets are downloaded and mapped in src/data/discover.json.

Root contains user documentation and was not a git repository. Parallel builders use disjoint component files in the shared project rather than introducing git metadata/worktrees.
