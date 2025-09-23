// <!-- BEGIN RBP GENERATED: ui-polish-v1 -->
import React from 'react';

/**
 * LiveRegion: shared a11y helper for polite screen reader announcements.
 * Usage:
 *   <LiveRegion /> once near app root; then call LiveRegion.announce('...').
 */
export type LiveRegionAPI = { announce: (message: string) => void };

const listeners = new Set<(message: string) => void>();
// <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
let lastMessage: string = '';
// <!-- END RBP GENERATED: admin-acceptance-v1 -->

function emit(message: string) {
  // <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
  lastMessage = message;
  // <!-- END RBP GENERATED: admin-acceptance-v1 -->
  listeners.forEach((l) => l(message));
}

export const LiveRegion: React.FC & LiveRegionAPI = Object.assign(
  function LiveRegionRoot() {
    const ref = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      const onAnnounce = (msg: string) => {
        if (!ref.current) return;
        // Update text node for SR; clear shortly after to allow repeat messages
        ref.current.textContent = msg;
        window.setTimeout(() => {
          if (ref.current) ref.current.textContent = '';
        }, 1000);
      };
      listeners.add(onAnnounce);
      return () => { listeners.delete(onAnnounce); };
    }, []);

    return (
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}
        ref={ref}
      />
    );
  },
  {
    announce(message: string) {
      emit(message);
    },
  }
);

export function useLiveRegion(): LiveRegionAPI {
  return React.useMemo(() => ({ announce: LiveRegion.announce }), []);
}
// <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
/**
 * Test-only helper: returns the last message announced via LiveRegion.
 * Do not use in production code.
 */
export function __getLastLiveRegionMessageForTest() { return lastMessage; }
// <!-- END RBP GENERATED: admin-acceptance-v1 -->
// <!-- END RBP GENERATED: ui-polish-v1 -->
