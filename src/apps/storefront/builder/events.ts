/* <!-- BEGIN RBP GENERATED: storefront-builder-m0-v1-0 --> */
export function emitPartSelected(type: 'blank'|'reelSeat', part: any){ document.dispatchEvent(new CustomEvent('builder:partSelected', { detail: { type, part } })); }
export function emitCompatWarning(message: string){ document.dispatchEvent(new CustomEvent('builder:compatWarning', { detail: { message } })); }
export function emitAddedToCart(cartUrl: string){ document.dispatchEvent(new CustomEvent('builder:addedToCart', { detail: { cartUrl } })); }
/* <!-- END RBP GENERATED: storefront-builder-m0-v1-0 --> */
