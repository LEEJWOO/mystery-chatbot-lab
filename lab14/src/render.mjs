import {FOV_DEGREES,VIEW_DISTANCE,headingVector,castRay,lightAt,visibleObjects,pointDistance,clamp,OBJECTS} from './core.mjs';
export const VIEW_W=640,VIEW_H=370,VIEW_HORIZON=175, EYE_HEIGHT=1.55,WALL_HEIGHT=2.7,RAY_COUNT=128;
const RAD=Math.PI/180;
export function camera(s){const h=s.player.heading*Math.PI/4;const f=headingVector(s.player.heading);return {x:s.player.x,y:s.player.y,fx:f.x,fy:f.y,rx:Math.cos(h),ry:Math.sin(h),scale:VIEW_W/2/Math.tan(FOV_DEGREES*RAD/2)};}
export function projectPoint(c,x,y,z=0){const dx=x-c.x,dy=y-c.y,forward=dx*c.fx+dy*c.fy;if(forward<=.11)return null;const sideways=dx*c.rx+dy*c.ry;return {x:VIEW_W/2+sideways*c.scale/forward,y:VIEW_HORIZON+(EYE_HEIGHT-z)*c.scale/forward,depth:forward};}
export function rgb(hex,light=1){const s=hex.replace('#','');const n=parseInt(s,16);const k=clamp(light,0.08,1.3);return `rgb(${Math.floor(((n>>16)&255)*k)},${Math.floor(((n>>8)&255)*k)},${Math.floor((n&255)*k)})`;}
const polygon=(verts,fill,stroke='rgba(255,255,255,.17)')=>({kind:'polygon',points:verts.map(p=>p.x.toFixed(1)+','+p.y.toFixed(1)).join(' '),fill,stroke});
export function boxMesh(c,o,lum){
 const yaw=o.yaw||0,co=Math.cos(yaw),si=Math.sin(yaw);
 const local=[[-o.w/2,-o.d/2],[o.w/2,-o.d/2],[o.w/2,o.d/2],[-o.w/2,o.d/2]];
 const pts=local.map(([a,b])=>({x:o.x+a*co-b*si,y:o.y+a*si+b*co}));
 const lo=pts.map(p=>projectPoint(c,p.x,p.y,0)),hi=pts.map(p=>projectPoint(c,p.x,p.y,o.h));
 const faces=[];
 for(let i=0;i<4;i++){
  const j=(i+1)%4, ex=pts[j].x-pts[i].x,ey=pts[j].y-pts[i].y;
  const mx=(pts[i].x+pts[j].x)/2,my=(pts[i].y+pts[j].y)/2;
  if((c.x-mx)*ey+(c.y-my)*(-ex)<0)continue;
  const p=[lo[i],lo[j],hi[j],hi[i]];if(p.some(v=>!v))continue;
  faces.push({depth:(p[0].depth+p[1].depth)/2,shape:polygon(p,rgb(o.color,lum*(i%2?.83:.98)))});
 }
 if(hi.every(Boolean))faces.push({depth:hi.reduce((n,p)=>n+p.depth,0)/4,shape:polygon(hi,rgb(o.color,lum*1.12))});
 return faces.sort((a,b)=>b.depth-a.depth).map(f=>f.shape);
}
export function renderWorld(s){
 const c=camera(s),fov=FOV_DEGREES*RAD,sz=VIEW_W/RAY_COUNT;
 const rays=[];
 for(let i=0;i<RAY_COUNT;i++){
  const off=(i+.5)/RAY_COUNT-.5,a=s.player.heading*Math.PI/4+off*fov,dx=Math.sin(a),dy=-Math.cos(a);
  const hit=castRay(s,c.x,c.y,dx,dy,VIEW_DISTANCE);
  if(!hit){rays.push({x:i*sz,width:sz+.7,hit:null,depth:Infinity});continue;}
  const depth=Math.max(.12,hit.distance*Math.cos(off*fov));
  const top=VIEW_HORIZON+(EYE_HEIGHT-WALL_HEIGHT)*c.scale/depth;
  const bottom=VIEW_HORIZON+EYE_HEIGHT*c.scale/depth;
  let lum=lightAt(s,hit.hitX-dx*.01,hit.hitY-dy*.01);
  let base=hit.kind==='door'?'#b78b59':'#758798';
  let shade=(hit.side==='x'?.83:1)*(.25+lum*.78);
  let seam=hit.kind==='door'?'#473628':undefined;
  rays.push({x:i*sz,width:sz+.7,y:clamp(top,-3000,3000),height:clamp(bottom-top,0,6000),depth,hit,fill:rgb(base,shade),seam});
 }
 const objects=[];
 for(const o of visibleObjects(s)){
  if(o.id==='door')continue; // closed door is represented by opaque ray columns; open portal stays clear
  if(o.id==='note'&&s.inventory.includes('note'))continue;
  const center=projectPoint(c,o.x,o.y,o.h/2);if(!center)continue;
  const distance=pointDistance(o.x,o.y,c.x,c.y),light=lightAt(s,o.x,o.y);
  const quality=light>=.4?'clear':'dim';
  let shapes=[];
  if(o.kind==='person'){
   const bottom=projectPoint(c,o.x,o.y,0),top=projectPoint(c,o.x,o.y,o.h);
   if(!top||!bottom)continue;const bh=bottom.y-top.y,bw=Math.max(6,bh*.29);
   shapes=[{kind:'person',x:top.x-bw/2,y:top.y,width:bw,height:bh,fill:rgb(o.color,.25+light*.85)}];
  }else if(o.kind==='switch'){
   const p=projectPoint(c,o.x,o.y,o.h);if(!p)continue;
   const size=Math.min(42,c.scale/center.depth*.22);
   shapes=[{kind:'circle',cx:p.x,cy:p.y,r:Math.max(3,size),fill:s.lights.archive?'#bceae4':'#ced4d8'}];
  }else shapes=boxMesh(c,o,.25+light*.85);
  objects.push({id:o.id,label:o.label,distance,depth:center.depth,x:center.x,y:center.y,quality,shapes,clipDepth:Math.max(.1,center.depth-.17)});
 }
 objects.sort((a,b)=>b.depth-a.depth);
 return {camera:c,rays,objects};
}