# Calendar Creation and Publishing
## Overview
- Targets ONLY src/components/CreateCalendar.tsx, ManageCalendar.tsx, CalendarPublishing.css.
- NewEnglishUIwithexistingLuma16/24,whitecards/squircle,standardinputs8radius. OwnSiteShellwrapper.
- Parentwilladdroutewrappers;noAPI/backendedits.
## Shared contracts
- useCatalog from ./CatalogProvider gives refresh():Promise<void>,notify(message),calendars,etc. SiteShell wide?:boolean,className?:string.
- PartnerCalendar fields id,slug,name,description,logo,cover?,color,website,organizationId,curated,createdAt,canManage?.
- ManagedOpportunity extendsOpportunity withstatus 'draft'|'published',updatedAt.
- categories from @/lib/unispot givesid/name. AlloriginalOpportunityfields @/types/unispot.
## CreateCalendar
- defaultcomponentno props. Route/calendars/new.
- HeadingCreate a calendar,shortdescriptionforpartner/community,formname,slug,descriptionrequired;website,logoURL,coverURLoptional;colorinputdefault#bb267e. Slugauto-derivedfromnameuntiluseredits;URLpreview /calendars/<slug>.
- Publiclogopreviewdefault/brand/unispot-icon.svg optional imageurl. NativeURLvalidations http(s).
- POST/api/calendars body{name,slug,description,website,logo,cover,color};success201{calendar}. OwnermanagementcookieHttpOnlysetserver automatically;neverextractsecret.
- Servererror{error:string}displayrolealert;fieldmaxmatchesname100,slug80,desc1500. LoadingbuttondisabledandlabelCreating…;preventdoublesubmit.
- awaitcatalog.refresh then router.push(`/calendars/${calendar.slug}/manage?new=1`),notifyCalendar created. LinkBack tocalendars.
- UInotificationownershiptruthfulsmallnote 'You can manage this calendar from the browser you create it in.' Noauth/loginclaims.
## ManageCalendar
- defaultprops {initialCalendar:PartnerCalendar}. Route/calendars/[slug]/manage.
- GET/api/calendars/<slug>/manage returns{calendar,opportunities:ManagedOpportunity[]} forowner. Nonowner403displayCannot manage this calendar plusView calendarlink;noeditor. Loading/error/retryreal.
- PageheadingcalendarnameorManage calendar,linkpublic/calendar,New opportunitybutton.
- Existingpostslisttitle,statusdate,Editbutton,Publish/Unpublishbutton. Changingstatus PATCH/api/calendars/<slug>/opportunities/<id> body{status};errorsinline,refreshbothmanagerandcatalog.
- Editornewormodifying usesfields: title(required180),categoryselect,description,formatselect (In person,Online,Hybrid,International),city,location,date,endDate,deadline,schedule,fee,eligibility,benefits(textarealineperbenefit),source(URL),actionLabel,image(URLoptional).
- Defaultsnewcategoryevents,formatOnline,cityOnline,feeSee organizer,actionLabelView details & register. Properlabelshelpfulmintextnopleholderfakes. Defaultsnotpretendrealeventdetails.
- Publishrequires title,description,city,location,fee,eligibility,source;eventscategorydate;scholarshipsdeadline. Servervalidatesaswell. Draftonlytitlerequired;Save drafttypebuttonbypassesnativevalidation.
- POST/api/calendars/<slug>/opportunities body{...fields,benefits:string[],status};response{opportunity}. EditingPATCH sameplusid. statuspublishedmeansgloballysearchableandpublicdetailroute;draftnotinpubliccatalog.
- Saveupdateseditor/postlistafterserver success,notifyPublished/ Draft saved;awaitcatalog.refresh. Don'tclaimsuccessonfailedrequests. DisplayView opportunitylink /opportunities/<id> forpublishedandViewcalendar. Unpublishhidesfrompublicsearch.
- Statusactionsdisabledpending,editorcancelresets,andPOSTguardpreventsdoubleposts. Autoerrorclearonsuccess.
## Styles/layout
- Heading28/33.6w600standard. Formmax680,parent820max,whitebordercardsradius24squircle,padding20. Labels14w500;input16height40;borderblack.16,radius8,textarea resizevertical;requiredmarkerssubtle.
- Editorgrid2cols,description/benefits/eligibilityfullwidth. Mobileonecolumn,gutters16. Submitactionsstickyoptionalkeepvisiblemobile;button38minheight.
- Previewoptionalnotrequirefakes. Noexternalassetdownloadsneeded.
## Security/data
- APIauthorizationownedservercookie;seededofficialcalendarsread-only. Do notallowpostingtoanothercalendarbypassingserver. NeverstoreownersecretsinlocalStorage.
- Serverreturns403/404/409/400messages;showthemclearly. Noactualcredentialscollected.
## Verification
- npx tsc --noEmitbeforefinish (otheragentsownroute/data/etc). Useapply_patch. Onlyspecifiedfiles;no git/worktree/commits.
