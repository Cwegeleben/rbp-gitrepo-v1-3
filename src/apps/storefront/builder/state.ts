/* <!-- BEGIN RBP GENERATED: storefront-builder-m1-v1-0 --> */
export type Slots = {
	blank: any|null;
	reelSeat: any|null;
	rearGrip: any|null;
	foregrip: any|null;
	guides: any[]; // set or list
	tipTop: any|null;
};
export type Totals = { price: number; weight: number };
export type Step = 'blank'|'reelSeat'|'rearGrip'|'foregrip'|'guides'|'tipTop'|'review';
export type BuilderState = { tenantId: string|null; step: Step; slots: Slots; totals: Totals; warnings: Array<{code:string;message:string}> };

const state: BuilderState = {
	tenantId: null,
	step: 'blank',
	slots: { blank: null, reelSeat: null, rearGrip: null, foregrip: null, guides: [], tipTop: null },
	totals: { price: 0, weight: 0 },
	warnings: [],
};
const subs = new Set<(s: BuilderState)=>void>();
export function get(){ return state; }
export function set(patch: Partial<BuilderState>){ Object.assign(state, patch); subs.forEach(fn=>fn(state)); }
export function subscribe(fn: (s: BuilderState)=>void){ subs.add(fn); return ()=>subs.delete(fn); }

// Sharing helpers: load from ?b= and to ?b= encoder
export function loadFromQuery(decode: (s: string|null)=>any){
	try {
		const u = new URL(window.location.href);
		const b = u.searchParams.get('b');
		const slots = decode(b);
		if (slots && typeof slots === 'object') {
			const cur = state.slots;
			state.slots = {
				blank: slots.blank ?? cur.blank,
				reelSeat: slots.reelSeat ?? cur.reelSeat,
				rearGrip: slots.rearGrip ?? cur.rearGrip,
				foregrip: slots.foregrip ?? cur.foregrip,
				guides: Array.isArray(slots.guides) ? slots.guides : cur.guides,
				tipTop: slots.tipTop ?? cur.tipTop,
			};
			subs.forEach(fn=>fn(state));
		}
	} catch {}
}

export function toQuery(encode: (slots:any)=>string): string {
	const s = encode(state.slots);
	return s ? `?b=${s}` : '';
}
/* <!-- END RBP GENERATED: storefront-builder-m1-v1-0 --> */
