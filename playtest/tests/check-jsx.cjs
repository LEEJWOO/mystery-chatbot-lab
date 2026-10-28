const fs=require('fs');const ts=require('typescript');
const path='MysteryTestHub.jsx';const text=fs.readFileSync(path,'utf8');
const ast=ts.createSourceFile(path,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JSX);
if(ast.parseDiagnostics.length){for(const d of ast.parseDiagnostics)console.error(ts.flattenDiagnosticMessageText(d.messageText,'\n'));process.exit(1);}
if(!text.includes('function MysteryTestHub('))throw Error('Missing UUMMAI entry point');
console.log('JSX syntax OK',text.length,'chars');