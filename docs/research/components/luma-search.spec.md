# Luma Search
## Overview
- SearchDialog.tsx + SearchDialog.css. ClickheaderSearchopensfull-screenmodal. Reference search-desktop.png andrawsearch.json.
## DOM Structure
- RadixRoot/Portal/Overlay/Content;fixedcloseupperright;centeredinputrow;native-scrollresults withleftthumbnailandtext.
## Computed Styles
- Sourceinput24px/24,backgroundtransparent,borderbottom1black.64. Resultmaxwidth692inside740pxwrapper,padding24.
- Resultthumb90square,radius8,gap16;title16/20.8w500;meta14/21black.36.
- Overlayfullviewport;UniSpotneutralwhite98%surfaceadaptation,blur16. Sourcepagehasbluecitytintwhichisnottransferred.
## States & Behaviors
- Searchupdatescatalogmatchlist;clickresultclosessearchopensdetail;nativeEnter/Spacebuttons. Escape/outsideRadixclose. Refcapture/restorationoffocus.
- Headersearchcontrolvisibleallwidths. No externalAPIrequests.
## Text Content
- Search opportunities;Search for opportunities…;actualmatchedcontent;No opportunitiesfound.Tryadifferentsearch.
## Assets
- Localopportunitycovers/organizationlogos. Search/XfromLucideequivalentthin16/24icons.
## Responsive
- Desktop740maxmargin-top64;mobilefullwidthpadding16margin-top56,input20/24,thumb72,gap12. No horizontaloverflow320.
