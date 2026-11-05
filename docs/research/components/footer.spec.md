# Footer Specification
## Overview
- Target src/components/Footer.tsx; screenshots desktop1440/mobile390.
- Static layout, links navigate; hover-driven color changes.
## DOM Structure
- `.jsx-855263735.zm-container` > `.jsx-855263735.flex-start.global-footer-content`.
- `.jsx-855263735.left-wrapper.flex-center.flex-1` contains a.logo.flex-center with `.nonphone-only` SparkleIcon and `.phone-only` LogoIcon then `.jsx-a9b4caed680dc115.links`.
- `.jsx-6a027b1db0d004e0.icons.flex-center` contains Instagram/X/Mail anchors + app-button.fs-xs.
## Computed Styles
- Outer paddingtop64, maxwidth820; inner margin16px16px0;paddingtop16;border-top1 black.08; font14/21 black.36.
- Text link padding8; iconlink padding9; svgwidth16. Appbutton border1 radius100 margin-top-1 left8 padding2px9px font12.
- Logo paddingtop16 right12, margin-top-8 left-8.
## States & Behaviors
- Link color black.36 -> black.64, transition .3s cubic-bezier(.4,0,.2,1).
- Preserve canonical real destinations; Discover local /discover, logo local /, Pricing luma.com/pricing, Help help.luma.com, Instagram instagram.com/luma_hq/, X x.com/LumaHQ, mailto:support@luma.com, GetApp luma.com/app.
## Per-State Content / Text Content
- Discover, Pricing, Help, Get the App. Aria labels Luma Home,Luma on Instagram,Luma on X,Contact Us.
## Assets
- Extracted LogoIcon,SparkleIcon,InstagramIcon,XIcon,MailIcon from icons.tsx.
## Responsive
- <=820 outerpaddingbottom16. <=650 linkpadding8px6px/logo right8.
- <=450 left-wrapperdisplayblock; wordmark shown instead of sparkle, links margin-left-6; iconsabsolute right16 aligned firstrow; links below logo.
