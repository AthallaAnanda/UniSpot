# Luma Feed Assembly
## Overview
- EventFeed.tsx, Intro.tsx, DiscoverPage.tsx. Based on authenticatedHome and Jakarta timeline. Staticnative-scroll plus clickfilters.
- Reference screenshots home-desktop.png/feed-desktop.png under docs/design-references/luma-home.
## DOM Structure
- Main820pxincluding16gutters,Headeroutside. Title,description,search,categorycards,opportunitylist,featuredcommunities,locations,footer.
- EventFeed groups actual dates with dateheading,weekday and dottedverticaltimeline. Event cards single-column. Undated programs inExploreanytimegroup.
## Computed Styles
- Mainpaddingtop53,H1top44,font28/33.6w600,description16/24secondary. No negativeletterspacing orgradienttitle.
- H220/24w600;sectiongap32/dividerblack.08;category3columns gap16,padding8 12 8 4,icon48,title16/24w500,count14/18.2.
- Timelineleft24,railblack.04dashed2,date16/24w500/weekdayblack.36. Groupgap24,cardgap16.
- Organization3cols,cardpadding14,bgwhite.8,radius24/squircle,title18/23.4,count14/21,avatar48,borderwhitehoverblack.16.
## States & Behaviors
- Existing filter/search/save/sort callbacks preserved; date-orderdefaultsoonest.
- Oncardopenpanel;previous/nextusefilteredorder. No decorativehero orCTAinfooter.
## Text Content
- Discover Opportunities;Browse byCategory;Upcoming Opportunities;Featured Communities;Explore byLocation. EnglishsourcedcatalogandUniSpotbrandingretained.
## Assets
- Localoriginalbrandand21existingcontentassets,exactInter. CategorylucideiconsforUniSpotcategorymapping.
## Responsive
- <=650h124,<=450h122. Categories2horizontalrows60high/image36/count12;organization3rows84highin300pxcolumns. Feedtitle18under650/cover90under450. Main16guttersatallwidths.
