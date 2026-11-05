# Luma Detail Panel Frame
## Overview
- Target src/components/OpportunityDetails.tsx and OpportunityDetails.css ONLY.
- Currentpropspreserve opportunity,organization,saved,onClose,onSave,onNotify. AddoptionalonPrevious/onNext callbacks.
- Ref docs/design-references/luma-home/event-dialog-desktop.png,event-dialog-390.png. Modelclick-triggeredrightpanelnotcenteredmodal.
## DOM Structure
- RadixDialog.Root openprop;Portal;Overlay.detail-overlay.event-panel-overlay;Content.detail-panel.event-panel.
- Toolbarheight48pxflex:collapsebutton(Close exactLumaSVG),CopyLinkbutton,EventPageanchor `/opportunities/${opportunity.id}`;spacer;prev/nextbuttons.
- Independent scrolling .event-panel-scroll with EventContent(modepanel) containing opportunity/organization/etc. Import new ./EventContent from other builder; it may not exist until parallel agent finishes, wait/retry tsc ifnecessary.
## Computed Styles
- Overlaypositionfixedinset0,z100,bg#b5b5b599,no5pxblur,displayflexjustifyendalignstart,overflowhidden,padding8px;native scrollbarstablefromrootmayreducewidth.
- Panelwidth550px,maxwidthcalc100vw-16px,heightcalc100dvh-16px,margin0,bg#f8f8f8,radius16,corner-shape:superellipse(2),overflowhidden,displayflexcolumn.
- SourceShadowvar(--luma-shadow-modal);toolbarborderbottom1black.08,padding8px12px;buttonfont14/21,w500,padding4px8px,lightbgblack.04,radius8;iconbuttons28px;closebuttonbgtransparent,colorblack.64,doublechevronSVG20px.
- Bodyflex1minheight0overflowauto,padding12px16px16px;originalwrappernegativepaddingnormalizes to16px.
- TransitionrightentertranslateX40px→0,opacity0→1,.3scubic-bezier(.4,0,.2,1);exitoptionalRadixclosedanimation. Respectreducedmotion.
## States & Behaviors
- CopyLinkmustcopycurrentUniSpotURL andnotify;labelCopiedthenreset. Nativeclipboarderrorshandled.Nobrowsernative share dialogneeded.
- EventPage openslocalstandalone route; meaningfullink. CallbackonPrevious/onNextbuttondisabledwhenundefined. No fake navigation.
- Capture originatingdocument.activeElement in onOpenAutoFocus,return onCloseAutoFocus;Escape/outsideclose preserveexisting. Titleaccessiblelabel event-content-title;description event-content-description.
## Text Content / Per-State Content
- Copy Link/Copied;Event Page;Close opportunity;Previous opportunity;Next opportunity. Actualeventcontentcomesfrompropssharedcomponent.
## Assets
- ExactextractedLumaIconClose,Copy,External;lucideChevronUp/Downforprevnext.
## Responsive
-1440and768550widepanelrightinset8. <=650maxwidthcalc100vw-16. <=450fullscreenwidth100%,height100dvh,padding0overlay,radius0;toolbarstill48/bodypadding16.
- ONLY apply rightpanelstyles via event-panel-overlay/event-panel classes; .detail-overlay also usedAbout dialog,do notbreak it. Remove old globals panel rules by higher specificity or ownstyles loaded after.
