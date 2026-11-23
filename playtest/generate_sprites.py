from pathlib import Path
import math
root=Path(__file__).parent/'assets'/'npcs'
root.mkdir(parents=True,exist_ok=True)
people={
'curator':dict(hair='#2b364d',skin='#f1c9a8',coat='#243c5e',shirt='#f7eee1',accent='#d8ac60',body='#1b304a',eyes='#3e3539',title='관장'),
'clerk':dict(hair='#7b4b3a',skin='#f0c6a7',coat='#a8abb0',shirt='#e4e2da',accent='#589b93',body='#666e77',eyes='#3b3435',title='직원'),
'archivist':dict(hair='#242b33',skin='#ddb18e',coat='#584840',shirt='#d3bb9b',accent='#b0a06b',body='#403630',eyes='#34313a',title='기록관리사')}
views=['front','front-right','right','back-right','back','back-left','left','front-left']
for ident,c in people.items():
 for index,view in enumerate(views):
  front=index in [0,1,7]
  back=index in [3,4,5]
  side=index in [2,6]
  profile=index in [1,2,3,5,6,7]
  facing_right=index in [1,2,3]
  shift=13 if facing_right else (-13 if profile else 0)
  face='<g></g>' if back else (f'''<g fill="{c['eyes']}" opacity=".9"><ellipse cx="{89+shift*.18:.1f}" cy="111" rx="2.8" ry="3.3"/><ellipse cx="{112+shift*.18:.1f}" cy="111" rx="2.8" ry="3.3"/></g><path d="M95 136Q102 141 110 135" fill="none" stroke="#975f5a" stroke-width="2"/>''' if front else f'''<circle cx="{100+shift*.45:.1f}" cy="111" r="2.8" fill="{c['eyes']}"/><path d="M{100+shift*.5:.1f} 123l{7 if facing_right else -7} 4" stroke="#b9826c" stroke-width="2.1" fill="none"/>''')
  hairback=f'''<path d="M68 109C61 45 141 42 137 113L135 152Q101 172 68 153Z" fill="{c['hair']}"/>''' if back else ''
  facefill=c['hair'] if back else c['skin']
  collar=f'''<path d="M77 170L101 196 122 170L110 162H89Z" fill="{c['shirt']}" stroke="#ffffff" stroke-opacity=".34" stroke-width="1.6"/>''' if not back else ''
  badges=f'''<rect x="127" y="223" width="20" height="12" rx="2" fill="{c['accent']}"/><path d="M130 227h14 M130 230h10" stroke="#fff2cd" stroke-width="1"/>''' if not back else ''
  # all sprites have identical 200 x 340 viewport and anchored feet
  svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 340" width="200" height="340">
  <defs><linearGradient id="j" x1="0" x2="1" y1="0" y2="1"><stop stop-color="{c['coat']}"/><stop offset="1" stop-color="{c['body']}"/></linearGradient><linearGradient id="f" x1="0" x2=".85" y1="0" y2="1"><stop stop-color="#fff0d8"/><stop offset="1" stop-color="{c['skin']}"/></linearGradient></defs>
  <ellipse cx="100" cy="331" rx="51" ry="6" fill="#14212b" opacity=".23"/>
  <path d="M66 269L61 329H92L105 273Z" fill="{c['body']}"/><path d="M106 272L111 329H142L135 267Z" fill="{c['body']}"/>
  <path d="M57 327l-6 9h44l-3-9ZM111 327l-1 9h44l-11-9Z" fill="#252a32"/>
  <path d="M62 162Q100 144 138 162L158 187L156 280Q100 295 45 278L43 185Z" fill="url(#j)" stroke="#1c2f40" stroke-width="2"/>
  <path d="M57 173Q43 180 31 224L42 265L58 262L65 201Z" fill="{c['coat']}" stroke="#203848" stroke-width="2"/>
  <path d="M143 172Q164 179 170 221L159 269L144 261L136 201Z" fill="{c['body']}" stroke="#203848" stroke-width="2"/>
  <path d="M81 155L82 167L99 185L116 166L116 154Z" fill="{c['skin']}"/>
  {collar}
  <path d="M103 190L103 273" stroke="#bdd0dc" stroke-opacity=".36" stroke-width="1.7"/>
  <path d="M53 277Q102 296 154 277" stroke="#111f2b" stroke-opacity=".4" stroke-width="2.2" fill="none"/>
  <g transform="translate({shift*.25:.1f} 0)">
   {hairback}
   <path d="M72 94Q77 60 100 57Q125 54 132 94L131 124Q128 150 102 156Q76 150 71 123Z" fill="{facefill}" stroke="#8f6f62" stroke-width="1.6"/>
   <path d="M69 109Q62 56 98 48Q142 43 139 110L127 88Q110 76 96 83Q79 88 69 109Z" fill="{c['hair']}"/>
   <path d="M68 90Q80 66 103 69Q132 67 136 87" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>
   {face}
   <path d="M81 102Q90 97 96 101 M107 102Q116 98 122 103" stroke="{c['hair']}" stroke-width="2.2" fill="none" opacity=".8"/>
  </g>
  {badges}
  <path d="M66 169L83 200 96 187 M137 170L118 200 105 187" stroke="#b5c5cc" stroke-opacity=".55" stroke-width="1.5" fill="none"/>
  </svg>'''
  (root/f'{ident}-{view}.svg').write_text(svg,encoding='utf-8')
print('generated',len(list(root.glob('*.svg'))),'SVG sprites')