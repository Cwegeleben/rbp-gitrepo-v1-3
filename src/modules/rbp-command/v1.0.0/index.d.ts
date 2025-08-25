// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
// Types for side-effect module
declare global {
	interface Window {
		RBP_CMD?: {
			open: () => void;
			close: () => void;
			exec: (id: string) => boolean;
			register: (actions: any[]) => void;
			unregister: (ids: string[]) => void;
			_store?: any;
		};
	}
}
export {};
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
