import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const research = path.join(root, 'docs/research/luma.com');
const content = JSON.parse(await readFile(path.join(research, 'content.json'), 'utf8'));
const mobile = JSON.parse(await readFile(path.join(research, 'mobile-styles.json'), 'utf8'));
const additional = JSON.parse(await readFile(path.join(research, 'additional-styles.json'), 'utf8'));
const modalStyles = JSON.parse(await readFile(path.join(research, 'modal-styles.json'), 'utf8'));
const output = path.join(root, 'public/assets/luma');
await mkdir(output, { recursive: true });
await mkdir(path.join(root, 'public/seo'), { recursive: true });
await mkdir(path.join(root, 'public/fonts'), { recursive: true });
const slug = name => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const queue = [];
const manifest = [];
for (const [group, entries] of [['categories', content.categories], ['calendars', content.calendars], ['cities', Object.values(content.regions).flat()]]) {
  for (const entry of entries) {
    const source = entry.image;
    entry.image = `/assets/luma/${group}/${slug(entry.name)}.png`;
    queue.push({ source, destination: path.join(root, 'public', entry.image), kind: 'image' });
  }
}
for (const [source, destination] of [
  ['https://luma.com/favicon.ico', 'public/seo/favicon.ico'],
  ['https://luma.com/apple-touch-icon.png', 'public/seo/apple-touch-icon.png'],
  ['https://luma.com/pwa.webmanifest', 'public/seo/luma.webmanifest'],
  ['https://images.lumacdn.com/social-images/discover-social.png', 'public/seo/discover-social.png'],
]) queue.push({source,destination:path.join(root,destination),kind: 'metadata'});

async function download(item) {
  const res = await fetch(item.source, {headers: {'User-Agent': 'Mozilla/5.0', Accept: '*/*'}});
  if (!res.ok) throw new Error(`${res.status}: ${item.source}`);
  await mkdir(path.dirname(item.destination), {recursive: true});
  const data = Buffer.from(await res.arrayBuffer());
  await writeFile(item.destination, data);
  manifest.push({ source: item.source, file: path.relative(root,item.destination), bytes: data.length, kind:item.kind });
}
for(let i=0;i<queue.length;i+=4) await Promise.all(queue.slice(i,i+4).map(download));
const cssResponse = await fetch(content.globalStylesheet);
if(!cssResponse.ok) throw new Error('Cannot download reference stylesheet');
const globalCss = await cssResponse.text();
await writeFile(path.join(research,'reference-global.css'),globalCss);
const localStyles=[...new Set([...content.styles,...mobile.styles,...additional.styles.map(s=>s.text),...modalStyles.styles])].join('\n');
await writeFile(path.join(root,'public/assets/luma/reference.css'),globalCss+'\n'+localStyles);
const fontResponse = await fetch('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap', {headers: {'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36'}});
const fontCss = await fontResponse.text();
await writeFile(path.join(research,'font-source.css'),fontCss);
const fontUrl=fontCss.split('@font-face').filter(s=>s.includes('font-style: normal;')).at(-1)?.match(/url\((https:[^)]+)\)/)?.[1];
if(!fontUrl) throw new Error('Variable Inter font URL missing');
await download({source:fontUrl,destination:path.join(root,'public/fonts/inter-variable.woff2'),kind:'font'});
for(const weight of [400,500,600]) await unlink(path.join(root,`public/fonts/inter-${weight}.ttf`)).catch(()=>{});
await unlink(path.join(root,'public/fonts/inter-latin.woff2')).catch(()=>{});
const data={categories:content.categories,calendars:content.calendars,regions:content.regions};
await writeFile(path.join(root,'src/data/discover.json'),JSON.stringify(data,null,2)+'\n');
const icons=[...new Set(content.icons)];
await mkdir(path.join(output,'icons'),{recursive:true});
for(let i=0;i<icons.length;i++) {
  const file=`public/assets/luma/icons/icon-${i}.svg`;
  await writeFile(path.join(root,file),icons[i]);
  manifest.push({file,kind:'svg',bytes:Buffer.byteLength(icons[i])});
}
await writeFile(path.join(root,'src/data/icons.json'),JSON.stringify(icons,null,2)+'\n');
await writeFile(path.join(research,'asset-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Downloaded ${manifest.length} assets: ${JSON.stringify(manifest.reduce((a,e)=>(a[e.kind]=(a[e.kind]||0)+1,a),{}))}`);
