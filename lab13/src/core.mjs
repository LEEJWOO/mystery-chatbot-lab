// Shared deterministic rules. No DOM, network, storage or platform globals.
export const VERSION = 1;
export const ITEMS = {note:'찢어진 근무표',key:'자료실 열쇠',ledger:'출입 기록부'};
export const NAMES = {guard:'경비원',detective:'조사관'};
export function initialState(){return {v:VERSION,revision:0,scene:'hall',x:1,y:1,minute:545,items:[],speaker:'guard',face:'happy',text:'먼저 복도 끝의 근무표를 확인해 보십시오.',log:[]};}
export function validateState(raw){
 const s=typeof raw==='string'?JSON.parse(raw):raw;
 if(!s||s.v!==VERSION)throw Error('지원하지 않는 저장 버전입니다.');
 if(!['hall','archive'].includes(s.scene)||!Number.isInteger(s.x)||s.x<0||s.x>4||!Number.isInteger(s.y)||s.y<0||s.y>2)throw Error('위치가 올바르지 않습니다.');
 if(!Number.isInteger(s.minute)||s.minute<545||s.minute>1440||!Number.isInteger(s.revision)||s.revision<0)throw Error('시간 또는 리비전이 올바르지 않습니다.');
 if(!Array.isArray(s.items)||s.items.some(i=>!Object.hasOwn(ITEMS,i))||new Set(s.items).size!==s.items.length)throw Error('소지품이 올바르지 않습니다.');
 if(s.items.includes('key')&&!s.items.includes('note')||s.items.includes('ledger')&&!s.items.includes('key')||s.scene==='archive'&&!s.items.includes('key'))throw Error('해금 순서가 맞지 않습니다.');
 if(!Object.hasOwn(NAMES,s.speaker)||!['happy','angry'].includes(s.face)||typeof s.text!=='string'||Array.from(s.text).length>180)throw Error('장면 정보가 올바르지 않습니다.');
 if(!Array.isArray(s.log)||s.log.length>30||s.log.some(x=>typeof x!=='string'||x.length>180))throw Error('기록 형식이 올바르지 않습니다.');
 return {v:1,revision:s.revision,scene:s.scene,x:s.x,y:s.y,minute:s.minute,items:[...s.items],speaker:s.speaker,face:s.face,text:s.text,log:[...s.log]};
}
export function clock(s){return String(Math.floor(s.minute/60)).padStart(2,'0')+':'+String(s.minute%60).padStart(2,'0');}
export function objects(s){return s.scene==='hall'?[{id:'note',x:4,y:0,label:'근무표'},{id:'guard',x:0,y:0,label:'경비원'},{id:'door',x:4,y:2,label:'자료실 문'}]:[{id:'ledger',x:4,y:0,label:'기록부'},{id:'exit',x:0,y:2,label:'복도'}];}
export function applyAction(state,a){
 const s=validateState(state); let cost=0, message='';
 if(a.type==='MOVE'){
  if(!Number.isInteger(a.dx)||!Number.isInteger(a.dy)||Math.abs(a.dx)>1||Math.abs(a.dy)>1||(!a.dx&&!a.dy))throw Error('잘못된 이동');
  const x=s.x+a.dx,y=s.y+a.dy;if(x<0||x>4||y<0||y>2)return {state:s,message:'벽에 막혔습니다.'};s.x=x;s.y=y;cost=1;message='이동했습니다.';
 }else if(a.type==='INSPECT'){
  const o=objects(s).find(o=>o.id===a.id);if(!o||Math.max(Math.abs(o.x-s.x),Math.abs(o.y-s.y))>1)return {state:s,message:'대상 옆으로 이동하십시오.'};
  if(a.id==='note'||a.id==='ledger'){
   if(s.items.includes(a.id))return {state:s,message:'이미 확보한 증거입니다.'};
   s.items.push(a.id);cost=2;s.speaker='detective';s.face='angry';s.text=a.id==='note'?'근무표의 시간이 지워져 있다. 경비원에게 보여주자.':'기록부와 근무표의 시간이 다르다. 이제 이 모순을 질문할 수 있다.';message=ITEMS[a.id]+' 획득';
  }else if(a.id==='guard'){
   s.speaker='guard';cost=1;
   if(s.items.includes('note')&&!s.items.includes('key')){s.items.push('key');s.face='angry';s.text='그 종이는 어디서 찾았습니까… 자료실 열쇠를 드리겠습니다.';message='자료실 열쇠 획득';}
   else {s.face='happy';s.text=s.items.includes('key')?'자료실에서 출입 기록을 확인하십시오.':'저는 그 시간에 복도를 지키고 있었습니다.';message='경비원과 대화';}
  }else if(a.id==='door'){
   if(!s.items.includes('key'))return {state:s,message:'잠겨 있습니다. 경비원의 열쇠가 필요합니다.'};
   s.scene='archive';s.x=1;s.y=1;cost=1;message='자료실 입장';s.text='먼지 쌓인 책상 위에 출입 기록부가 놓여 있다.';
  }else {s.scene='hall';s.x=3;s.y=2;cost=1;message='복도로 이동';s.text='다시 복도로 돌아왔다.';}
 }else if(a.type==='PORTRAIT'){
  if(!Object.hasOwn(NAMES,a.speaker)||!['happy','angry'].includes(a.face))throw Error('잘못된 인물');s.speaker=a.speaker;s.face=a.face;message='표시 인물 변경';
 }else if(a.type==='TEXT'){s.text=Array.from(String(a.text||'')).slice(0,180).join('');message='대사 변경';}
 else throw Error('지원하지 않는 행동');
 if(s.minute+cost>1440)return {state:state,message:'하루의 조사 시간이 끝났습니다. AI에게 인계하십시오.'};
 s.minute+=cost;s.revision++;s.log=[...s.log,clock(s)+' '+message].slice(-30);return {state:s,message};
}
export function checkpoint(s){return JSON.stringify(validateState(s));}
export function handoff(s,user=''){return {protocol:'MYSTERY_LAB_V1',event:'HANDOFF',state:validateState(s),seenText:s.text,user:String(user).slice(0,500),futureIsCanon:false};}
export function wrapText(text,max=32){let lines=[''],width=0;for(const c of Array.from(text)){const n=/[\x00-\x7F]/.test(c)?0.55:1;if(c==='\n'||width+n>max){lines.push('');width=0;if(c==='\n')continue;}lines[lines.length-1]+=c;width+=n;}return lines;}
