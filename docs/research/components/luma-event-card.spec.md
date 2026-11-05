# Luma Event Card
## Overview
- Target src/components/OpportunityCard.tsx and OpportunityCard.css only. Preserve existing props opportunity,organization,saved,onSave,onOpen.
- Screenshot docs/design-references/luma-home/feed-desktop.png,feed-390.png. Interaction clickable card opens sidepanel;bookmark independent.
## DOM Structure
- article.opportunity-card.luma-event-card with primary full-card accessible button overlay (`image-open` optional old class) or rolebutton keyboardEnter/Space. No nested buttons invalid markup.
- First row flex text then squarecoverright. Time/schedule line above title, title then By organization, location with MapPin. Bottom category/status pill and optional fee (only actual data). Bookmark lower-right distinct button. No invented guestavatars.
- Title h3>button or meaningful anchor with onOpen interception preserves browser keyboard behavior. Use stretched button overlay plus foreground savebuttonz2; avoid click on card causing duplicate action.
## Computed Styles
- Source event-card padding12px12px12px16px on desktop/tablet (confirmed after full source hydration); below450px padding12px. Border1white,bg rgba255255255.8,borderRadius24px,corner-shape:superellipse(2),no shadow.
- Rowgap16;rightcover120px square,imageobjectfitcover,radius12px,corner-shape:squircle;border.5pxblack.04. No scalehover. Original artwork remains source images,containifspecified.
- Texttime16/24,weight400,rgba21.36. Title20/24 weight500,normalletterspacing,gap8 intextstack.
- Meta16/24 black.36,icons16px,organizeravatar16px,gap4px. Longtitlewrapnaturally2lines before clamp3 if needed.
- Bottommargin-top12,gap8;status12/15.6 weight400,padding2px6px,radius4,softmagentaUniSpot background permitted (Luma statusblueadaptation). Category12px. Bookmarkbutton28x28,lightbgblack.04,radius8.
## States & Behaviors
- Borderhoverwhite→rgba21.16;transitionborder-color,box-shadow.3s cubic-bezier(.4,0,.2,1). No imagezoom.
- Hoveronbookmark outercardborderwhite using:has. Save toggles aria-pressed and pinkfill. Clickbookmarkmustnotopen.
- Original onOpen preserved for primary card click;tabfocus visible. No backend changes.
## Per-State Content / Text Content
- Use actual opportunity.schedule,title,sourceName,location,status;categoryFor. By prefix.
- All exact content from props,17verifiedrecords. No timestamps or prices invented.
## Assets
- opportunity.image,organization.logo existing local sources. LumaIcon MapPin exactSVG;lucideBookmark for custom save.
## Responsive
-Desktop120pxcover,title20,text16;<=650title18/21.6;<=450cover90,gap12,padding12. Textshrinkminwidth0/metaellipsis,cardheightcontent-driven. Containerprovidedbyparent singlecolumnlist. At320 nooverflow.
