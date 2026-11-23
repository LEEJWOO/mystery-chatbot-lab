import json
from pathlib import Path
root=Path(__file__).parent
w=json.loads((root/'data/world.json').read_text())
(root/'src/world.generated.mjs').write_text('export const HUB_WORLD = '+json.dumps(w,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
sprites={}
for p in (root/'assets/npcs').glob('*.svg'):
 sprites[p.stem]=p.read_text(encoding='utf-8')
(root/'src/sprites.generated.mjs').write_text('export const HUB_SPRITES = '+json.dumps(sprites,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print('Generated world module and sprite manifest',len(sprites))