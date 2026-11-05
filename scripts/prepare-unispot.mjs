import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execFile);

const root = process.cwd();
const readJson = async p => JSON.parse(await readFile(path.join(root,p),'utf8'));
const data = await readJson('src/data/unispot-seed.json');
const gdg = await readJson('docs/research/unispot/gdg-events.json');
const manifest=[];
const headers={'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36'};
async function download(source,file) {
  const target=path.join(root,'public',file);
  await mkdir(path.dirname(target),{recursive:true});
  try {await access(target);manifest.push({source,file,cached:true});return;} catch {}
  let bytes;
  try {
    const r=await fetch(source,{headers:{...headers,Accept:'image/webp,image/*,*/*;q=0.8'},signal:AbortSignal.timeout(25000)});
    if(!r.ok) throw new Error(`${r.status}: ${source}`);
    bytes=Buffer.from(await r.arrayBuffer());
  } catch {
    const r=await exec('curl',['--fail','--silent','--show-error','--location','--max-time','45',source],{encoding:'buffer',maxBuffer:20*1024*1024});
    bytes=r.stdout;
  }
  await writeFile(target,bytes);
  manifest.push({source,file,bytes:bytes.length});
}
const decode=s=>s?.replaceAll('&amp;','&').replaceAll('&#39;',"'").replaceAll('&quot;','"').replaceAll('&#x27;',"'");
const metadata=(html,name)=>decode(html.match(new RegExp(`<meta[^>]*(?:property|name)=["']${name}["'][^>]*content=["']([^"']+)["']`,'i'))?.[1]);
for(let i=0;i<gdg.length;i+=4) {
  await Promise.all(gdg.slice(i,i+4).map(async(event,index)=>{
    const id='devfest-'+event.host.toLowerCase().replace('gdg ','').replaceAll(' ','-')+'-2026';
    let html='';
    try {html=await (await fetch(event.url,{headers,signal:AbortSignal.timeout(20000)})).text();} catch(e){console.warn(`Metadata unavailable for ${event.title}: ${e.message}`);}
    const rawImage=metadata(html,'og:image')||'https://developers.google.com/community/devfest/images/devfest-social-no-year.png';
    const imageSource=rawImage.includes('cloudinary.com')?rawImage.replace(/\/image\/upload\/.*?\/v1\//,'/image/upload/c_fill,dpr_1.0,f_auto,g_center,h_600,q_85,w_800/v1/'):rawImage;
    const image=`/assets/unispot/opportunities/${id}.webp`;
    await download(imageSource,image);
    const city=event.host.includes('Jakarta')?'Jakarta':event.host.includes('Bandung')?'Bandung':event.host.includes('Jogjakarta')?'Yogyakarta':event.host.includes('Surabaya')?'Surabaya':event.host.replace('GDG ','');
    const date=new Date(event.date.replace('calendar_today','').trim());
    const iso=[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
    data.opportunities.push({id,title:event.title,category:'events',organizationId:'gdg',description:metadata(html,'og:description')?.replace(/^(In-person|Hybrid|Virtual) Event - /,'')||`Join ${event.host} for DevFest 2026, a community-led technology event. Explore the host's agenda, participation details, and registration information.`,location:city,city,format:event.format.includes('Hybrid')?'Hybrid':'In person',schedule:new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(date),date:iso,endDate:iso,fee:'See organizer',eligibility:"Developers, AI builders, and technology enthusiasts. Review the host's event page for admission and registration requirements.",benefits:['Explore Google technologies with your local developer community','Connect with developers and fellow technology enthusiasts',"See the organizer's page for the full agenda"],source:event.url,sourceName:event.host,actionLabel:'View event & registration',image,imageSource,color:['#e5f1e5','#fcebdd','#e7eefc','#efe7fb'][index%4]});
  }));
}
const featured=['devfest-cloud-jakarta-2026','lpdp-naist-2026','google-ai-essentials','icmns-2026','indorelawan-opportunities','erasmus-study-abroad'];
data.opportunities.sort((a,b)=>{const x=featured.indexOf(a.id),y=featured.indexOf(b.id);return (x===-1?100:x)-(y===-1?100:y)||(a.date??a.deadline??'9999').localeCompare(b.date??b.deadline??'9999')||a.id.localeCompare(b.id);});
const assets=[...data.organizations.map(o=>({source:o.logoSource,file:o.logo})),...data.opportunities.filter(o=>o.imageSource).map(o=>({source:o.imageSource,file:o.image}))];
const unique=[...new Map(assets.map(a=>[a.file,a])).values()];
for(let i=0;i<unique.length;i+=4) await Promise.all(unique.slice(i,i+4).map(a=>download(a.source,a.file)));
const logo=await readFile(path.join(root,'mulmod-docs/UniSpot_Logo.svg'),'utf8');
await mkdir(path.join(root,'public/brand'),{recursive:true});
await writeFile(path.join(root,'public/brand/unispot.svg'),logo);
const icon=logo.replace(/width="1891" height="559" viewBox="124 85 1891 559"/,'width="64" height="64" viewBox="124 85 630 559"').replace(/<g id="unispot-wordmark"[\s\S]*?<\/g>/,'');
await writeFile(path.join(root,'public/brand/unispot-icon.svg'),icon);
await writeFile(path.join(root,'src/data/unispot.json'),JSON.stringify(data,null,2)+'\n');
await writeFile(path.join(root,'docs/research/unispot/asset-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
await writeFile(path.join(root,'docs/research/unispot/sources.json'),JSON.stringify({checkedOn:'2026-11-04',opportunities:data.opportunities.map(o=>({id:o.id,title:o.title,url:o.source,date:o.date,deadline:o.deadline})),organizations:data.organizations.map(o=>({name:o.name,url:o.url}))},null,2)+'\n');
console.log(`Prepared ${data.opportunities.length} opportunities, ${data.organizations.length} organizations and ${new Set(manifest.map(a=>a.file)).size} local content assets.`);
