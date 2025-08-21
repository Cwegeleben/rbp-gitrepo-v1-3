/* <!-- BEGIN RBP GENERATED: mock-ranking-server --> */
export type RankingConfig = { collectionWeights?: Record<string, number>; vendorWeights?: Record<string, number>; tagBonus?: number };
export async function loadRankingConfig(): Promise<RankingConfig> {
  return { collectionWeights: {}, vendorWeights: {}, tagBonus: 0.2 };
}
export function scoreProduct(p: any, cfg: RankingConfig, opts?: { tagsSet?: Set<string> }) {
  const tagBonus = typeof cfg.tagBonus === 'number' ? cfg.tagBonus : 0.2;
  const matches = (p.tags||[]).map((t:any)=>String(t).toLowerCase()).filter((t:string)=>opts?.tagsSet?.has(t)).length;
  return matches * tagBonus;
}
/* <!-- END RBP GENERATED: mock-ranking-server --> */
