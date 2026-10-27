import {validateState,wrapText,clock,NAMES,ITEMS} from './core.mjs';
export function escapeXML(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}
export function renderSVG(raw,assets){
 const s=validateState(raw),e=escapeXML;
 const img=(name,x,y,w,h,opacity=1)=>{if(!assets[name])throw Error('Missing asset '+name);return `<image x="${x}" y="${y}" width="${w}" height="${h}" opacity="${opacity}" href="${assets[name]}"/>`;};
 let out=`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="700" viewBox="0 0 960 700"><rect width="960" height="700" fill="#111927"/>`;
 out+=img('lab13-'+s.scene+'.svg',0,0,960,400);
 for(const [id,x] of [['guard',70],['detective',530]]){const opacity=s.speaker===id?1:.4;out+=`<g opacity="${opacity}">`;for(const file of ['body.svg','expression-'+(s.speaker===id?s.face:'happy')+'.png','hair-'+(id==='guard'?'black':'gold')+'.svg','outfit-'+(id==='guard'?'blue':'red')+'.svg'])out+=img(file,x,55,350,345);out+='</g>';}
 out+=`<rect y="400" width="960" height="300" fill="#1b2940"/><g font-family="sans-serif"><text x="30" y="38" fill="#fff" font-size="22">${s.scene==='hall'?'서쪽 복도':'자료실'} · ${clock(s)}</text><text x="36" y="446" fill="#efcc8e" font-size="28">${NAMES[s.speaker]}</text>`;
 // At most 180 Unicode characters => <= 6 lines at this width; preserve explicit newlines with adaptive font.
 const lines=wrapText(s.text,36),font=Math.min(25,190/Math.max(1,lines.length));
 lines.forEach((line,i)=>out+=`<text x="36" y="${480+i*font*1.12}" fill="#f3f6ff" font-size="${font}">${e(line)}</text>`);
 out+=`<text x="36" y="680" fill="#b7c4d9" font-size="17">증거 ${s.items.length} · ${e(s.items.map(i=>ITEMS[i]).join(' / '))}</text></g></svg>`;return out;
}
