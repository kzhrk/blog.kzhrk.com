interface Window {
	twttr: {
		widgets: {
			load: () => void;
		};
	};
	dataLayer: {
		push: (...args: unknown) => void;
	};
}
declare const window: Window;
