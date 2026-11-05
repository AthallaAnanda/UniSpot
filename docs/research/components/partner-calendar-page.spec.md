# Partner Calendar Page
## Overview
- Target src/components/PartnerCalendarPage.tsx and PartnerCalendarPage.css ONLY.
- Props {initialCalendar:PartnerCalendar}. Server route wrapper maintained by parent.
- Reference https://luma.com/readingrhythms-global; screenshots docs/design-references/luma-calendar/reference-1440.png and reference-390.png; extracted DOM/styles docs/research/luma-calendar/reference-desktop.json.
- Click-driven Follow, date selection, month navigation, Upcoming/Past/All. Native document scroll and existing opportunity side panel.
## Component contracts
- Types @/types/unispot exports PartnerCalendar,Opportunity,Organization. PartnerCalendar fields id,slug,name,description,logo,cover?,color,website,organizationId,curated,createdAt,canManage?.
- useCatalog from ./CatalogProvider gives opportunities,organizations,calendars,loading,error,refresh,saved,followed,toggleSave(opportunity),toggleFollow(calendarId),notify(message).
- SiteShell from ./SiteShell takes wide?:boolean,className?:string,children. It includesHeader/main/Footer;don'trendertheseagain.
- EventFeed from ./EventFeed takes opportunities,organizations:Record<string,Organization>,saved:string[],onSave,onOpen.
- OpportunityDetails from ./OpportunityDetails takes opportunity|null,organization?,saved,onSave,onClose,onNotify,optionalonPrevious/onNext.
- useOpportunitySelection from @/hooks/useOpportunitySelection(opportunities) returns selected,open(opportunity),close(); encodes opportunityURL.
- isPast from @/lib/unispot. CalendarCards notneededhere.
## DOM Structure
- SiteShell wide className calendar-shell.
- Cover banner fullwidth; ifcoverprovideduseimage,otherwiseusecalendarcolor/CSSgradientwithsubtlelargecalendaricon. NeveruseReadingRhythmsartforUniSpot.
- Profilelogo/avatar overlappingbottomofcover;Follow/Followingbuttonopposite;calendarnameh1,description,website,curatednoticeifcurated.
- Curatednotice EXACT conceptualmeaning 'Curated from official sources by UniSpot';notclaimpartneraccountbelongsorganization.
- IfcanManage true show Manage calendar link /calendars/<slug>/manage and Add opportunity samepage?new=1. Otherwise createcalendarCTA notpublishtoofficialcalendar.
- Body left feed right260px mini monthcalendar. Feed heading Opportunities and count; Upcoming/Past/All segmentedcontroloneplace;no categoryfiltertabs/searchonthispage. 'Search in this calendar'link /explore?calendar=<slug>.
- Datefilter selectedlabelwithclear. Empty statefunctionalclear/viewall.
- Sidebar monthpickerwithprev/next,month/year,weekdayheader,35/42daygrid. Dotsfordatedopportunities(date/deadline);clickdayfiltersdate/start-endrange. Monthchangesdon'thidefeeduntiladayselected.
- Followingstoreslocalbrowsercollectionviahook;noemailnotificationclaim/countsfabricated. Addtocalendarlink /api/calendars/<slug>/feed downloadsactualICS.
## Computed Styles
- Sourcecalendarfullmaxwidth1020,mainbodymax960including32gutters. h136/43.2weight600,24/28.8mobile. Headerdesctext16/24secondary;profilelogo96desktop64mobile,border4pagebg,radius12squircle.
- Banneraspect3.5 desktopborder16squircle;mobileheight130-170. Bodyh224/28.8desktop20/24mobile. Aside260width,gap40;calendarwidgetborder1black.08,radius8,padding12;daybuttons28-30,font14;monthname16w500. Todaybrandmagenta,selectedlightbrand,dots4px.
- ExistingInter,neutralbg#f8f8f8,main16/24. FeedusespreviousLuma-stylecards. Originalbranding/calcolorretained.
## States & Behaviors
- Derivecurrentcalendarfromcatalog.calendars.findid fallbackinitialCalendar;publicseednevercanManage.
- Filterpublished catalog.opportunities bycalendarId, notdescription. Upcomingincludesundated;PastisPasthelper. Allshowsboth. DatesalwaysUTC/dateonlynoinventedtimes.
- DetailopenssidepanelandshareURL. Previous/nextfilterorderoptional.
- Sourcecuratedreviewinformationonlyseeded;createdcalendarsmanagedbyauthownercookiefromAPI.
## Responsive
- 1440hero+leftfeed+260aside. 768aside220orsingleat820. <=650stackprofileandfeed;monthwidgetaccessibleinsideChoose date disclosure/onbuttonmobile(notdeadhiddenfeature).Nohorizontaloverflow320.
## Assets/text
- Allrealcalendarprops,localexistinglogosandopportunityassets. EnglishUI:Follow,Following,Opportunities,Upcoming,Past,All,Manage calendar,Add opportunity,Add to calendar,Search in this calendar,Clear date.
