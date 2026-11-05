import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const source=JSON.parse(await readFile(path.join(root,'src/data/luma-component-icons.json'),'utf8'));
const output=path.join(root,'public/assets/luma-components');
await mkdir(output,{recursive:true});
const assets=[];
for(const [name,svg] of Object.entries(source)) {
  const filename=`${name.toLowerCase()}.svg`;
  await writeFile(path.join(output,filename),svg+'\n');
  assets.push({name,file:`public/assets/luma-components/${filename}`,bytes:Buffer.byteLength(svg),source:name==='Calendar'||name==='Compass'||name==='Events'?'Authenticated Luma Home navigation':'Luma Jakarta event card / event panel DOM'});
}
await writeFile(path.join(root,'docs/research/luma-home/component-assets.json'),JSON.stringify({icons:assets,font:{file:'public/fonts/inter-variable.woff2',source:'Exact Inter variable Latin WOFF2 already downloaded from Luma Google Fonts stylesheet'},contentImages:'Existing 21 locally downloaded UniSpot official-source images retained; no source event attendees or avatars copied into product.'},null,2)+'\n');
console.log(`Archived ${assets.length} exact component SVG assets.`);
