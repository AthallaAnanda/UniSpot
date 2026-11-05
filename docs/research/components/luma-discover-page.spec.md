# Discover Page State and Composition
## Overview
- DiscoverPage.tsx. Parentownerofquery,savedstate,details,search,about,sort,filters.
## DOM Structure
- Fixedheader;main820container;Intro,Categories,EventFeed,Organizations,LocationExplorer,Footer;Radixoverlaysoutsideflow.
## Computed Styles
- Inherits16/24body,Home28heading,Discover20sectionheadings. Rootbackground#f8f8f8,brandgradient180high.
## States & Behaviors
- PreserveslocalStoragekey,deep-linkopportunityIDandfilters,clipboard/calendar. Search/aboutqueryparametersrestoreoverlay.
- Dateorderdefaultsoonest. Next/previoususesfilteredcatalog,disabledatboundaries,panelscrollresetoneventchange.
- Noprofile,account,registrationorfollowstatefabricated.
## Text Content
- EntireinterfaceEnglish,17official-sourceopportunitiesandUniSpotbrand.
## Assets
- Sharedcomponentsownassets. ExistingInterfont.
## Responsive
- Passesmaincontainerandstate;childrenimplementextractedbreakpoints. Nativepageandpanelscroll,nostickycontenttabautoselection.
