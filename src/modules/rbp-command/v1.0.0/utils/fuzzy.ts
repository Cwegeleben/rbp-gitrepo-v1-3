// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
export type Action = { id:string; title:string; subtitle?:string; tags?:string[]; group?:string };

export function score(a:Action, q:string){
  if (!q) return 1;
  const t = q.trim().toLowerCase();
  let s = 0;
  const tx = `${a.title||''} ${a.subtitle||''} ${a.group||''} ${(a.tags||[]).join(' ')}`.toLowerCase();
  if (tx.includes(t)) s += 10;
  if ((a.title||'').toLowerCase().includes(t)) s += 10;
  if ((a.subtitle||'').toLowerCase().includes(t)) s += 5;
  if ((a.tags||[]).some(tag=>tag.toLowerCase().includes(t))) s += 3;
  return s;
}

export function highlight(text:string, q:string){
  if (!q) return [{ t:text, h:false }];
  const i = text.toLowerCase().indexOf(q.trim().toLowerCase());
  if (i<0) return [{ t:text, h:false }];
  return [
    { t: text.slice(0, i), h:false },
    { t: text.slice(i, i+q.length), h:true },
    { t: text.slice(i+q.length), h:false },
  ];
}
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
