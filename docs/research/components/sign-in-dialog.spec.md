# SignInDialog Specification
## Overview
- Target src/components/SignInDialog.tsx. Props open:boolean,onOpenChange:(open:boolean)=>void.
- Screenshot follow-modal-desktop.png and follow-modal-phone.png; full computed tree luma.com/modal-extraction.json.
- Click-driven email/phone toggle; modal Escape/backdrop dismiss. Auth backend excluded.
## DOM Structure
- Use Radix Dialog primitive from installed radix-ui (shadcn dependency), Portal+Overlay+Content, preserve reference class names rather than default shadcn spacing/closebutton.
- Overlay visual background captured #b5b5b599; flex overlay padding-top15vh, justify-center, align-start, overflow-y:scroll. Native overlay scrollbar matches original centering (desktop panel x524.8 for viewport1440 in capture browser).
- Dialog.signin-container.flex-center-center > .onboarding-card.overflow-hidden padding20.
- Welcome icon circular; title/subtitle; form label with email/phone toggle; input; Continue button; divider and Google/Passkey buttons.
## Computed Styles
- Desktop panel360wide426.8high,radius20,bg#f8f8f8; shadow rgba(21,21,21,.08)0 0 0 1,0 3px3px #00000008,0 8px7px #0000000a,0 17px14px #0000000d,0 35px29px #0000000f,inset0 -4px4px #0000000a.
- Icon64square bgblack.04 color#757575 SVG36. Icon wrapper paddingbottom16.
- Title20/24 weight600; subtitle14/21 black.64; headingblockmarginbottom16.
- Input width320 height38.4 focusborder#151515 radius8; button320height38.4 margin-top16.
- Bottom horizontal divider with margin16px -20px; lower buttonsgap8.
- Exact original JSX styles saved and loaded globally.
## States & Behaviors
- Email label/you@email.com/Use Phone Number/Continue with Email.
- Phone label/placeholder +62 812 345 678/Use Email/Continue with Phone.
- Buttons use original lux-button styles. No actual email/auth/passkey/OAuth requests. Valid submission or provider click shows explicit local-demo status. No fabricated success or credentials persistence.
- Escape/outsideclick dismiss, focus trapped and returned to initiating Follow by Radix.
- Initial focus explicitly moves to contact input; phone/email toggle focuses replacement input. Override Tailwind's unrelated `.outline` utility on the reference's `.lux-input-wrapper.outline` to prevent unintended square outlines. Panel overflow stays visible so source shadow is not clipped.
## Per-State Content / Text Content
- Welcome to Luma; Please sign in or sign up below.; Sign in with Google; Sign in with Passkey; form strings above.
## Assets
- WelcomeIcon,PhoneIcon,GoogleIcon,PasskeyIcon extracted in icons.tsx.
## Responsive
- <=450 signincontainer min-width90vw; panel max360 border-radius16; use viewport-safe width. Overlay15vh with scroll for shorter windows.
