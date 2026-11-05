# Shared Luma Event Content
## Overview
- NEW src/components/EventContent.tsx and EventContent.css ONLY. Shared panel/standalonebody.
- Export default EventContent props {opportunity:Opportunity;organization?:Organization;saved:boolean;onSave:()=>void;onNotify:(message:string)=>void;mode?:'panel'|'page'}.
- References event-dialog-desktop.png,event-page-desktop.png,event-page-390.png,registration.png under docs/design-references/luma-home/.
- Model static read,registerexternallink,save/calendarclick.
## DOM Structure
- Root .event-content-layout mode-panel/mode-page.
- Left .event-visual: square image with duplicate decorative blurredglow; host sidebar onpage,categorytag,save/calendarbuttons.
- Right .event-main: heading title,hostrow (panelonly);two factrows withcalendar datebox and location outlinebox;registrationcard;About section;eligibility;benefits;locationsection;officialsource/reviewedinfo. Mobile/sidepanelhostsectionbelowcontent.
- Use h1 on page,h2 onpanel;parent Radixlabels via aria-labelledby='event-content-title' /aria-describedby='event-content-description'. Give IDs to title/description.
## Computed Styles
- Sourcebody16px/24,#151515;secondaryblack.64,tertiaryblack.36;normalletterspacing;weight500forprimaryfacts.
- Panelimage280square,marginauto,paddingtop12px;radius12/squircle;border.5black.04;glow sameimageblur24 opacity.18 pointer-none behind.Originalthumbcontainifrequested.
- Paneltitle32/38.4weight600 (long>60chars26/31.2);mobile28/33.6(long24/28.8). Marginbottom6;host14/21black.64 avatar18.
- Fullpage main max960 includes32gutters,columns330 minmax0,1fr,gap32;title48/55.2weight600(long38/43.7).At<=1000columns280 rest,gap24,title36;<=650stack,title28,imagefullwidthmax360.
- Factsmargin-top24,gap16;icondate40x40border1black.08radius8;month9pxupper,bgblack.04,day18px;fontdayrow16/24weight500;subrow14/21black.64. Locationicon40square,SVG20.
- Registrationmargin-top24,bgwhite.8,border1white,squircle24,subtleshadow0 1px3pxblack.08;topstripfont14/21black.64,padding8px16px,bgblack.02. Statusrowpadding16,gap12;icon32bgblack.04radius8;primary16/24w500,subtitle14/21. Divider1black.08,bodypadding16,text16/24;fullwidthbuttonheight38,padding8px14,radius8,bg#353535 textwhite (use magenta asbrandaccentoptional,preferneutralLuma). No stickybottomCTA.
- Aboutsection24pxfromregistration;sectionlabel14/21black.64,marginbottom16,paddingbottom12,borderbottom1black.08. Paragraph16/24;benefitsnormalbullets,gap4. Fullpagehostsidebar14/21label,16/24name.
## States & Behaviors
- Sourceactionlinksopenexternal,correctactionLabel, do not collect registrations or inventsuccess.
- Savebuttoncalls onSave. Calendaruses existing downloadCalendar and notifies. Secondarytools14pxlightsourcebuttons. No local share in component(parenttoolbar).
- Buttonshoverbg#353535→#555,.3s cubic-bezier(.4,0,.2,1). Linkshoverunderline/primary.
## Text Content / Per-State Content
- Registration;opportunityStatus;opportunity.fee;You’ll continue on the organizer’s website.;actualactionLabel;About Event(orAbout Opportunity);Who can join;What to expect;Location;Hosted By;Official source;Reviewed Nov4,2026.
- Keep all actualdescription/eligibility/benefits. Source URLs actual.
## Assets
- Existinglocalopportunityimage andorganizationlogo;duplicateimageonlydecorativealt empty. LumaIconMapPin/Calendar;lucideTicket/Bookmark/Globe ifneeded.
## Responsive
- Panelstayssinglecolumnallwidths;panelbodypadding16parentowned;contentcover280max100%;mobilecovertopsquare280.
- Pagecolumnsabove650,stackbelow. Avoid duplicate IDs across modes (onlyoneinstanceinpage). Root body inherits exactfont.
