export {};

declare interface ReCAPTCHAv3 {
	ready: (callback: () => void) => void;

	/**
	 * Will execute the ReCaptcha using the given SiteKey and the given options.
	 * @param siteKey The ReCaptcha SiteKey.
	 * @param options The options for the execution. (Only known property is "action")
	 */
	execute: (siteKey: string, options: ExecuteOptions) => Promise<string>;

	/**
	 * Will render the ReCaptcha widget into the given container with the given parameters. This render function is
	 * useful when using `badge: 'inline'`, which lets you render the ReCaptcha widget into the given container and
	 * let's you style it with CSS by yourself.
	 *
	 * @param container The container into which the widget shall be rendered.
	 * @param parameters The rendering parameters for the widget.
	 */
	render: ((container: string | Element, parameters: RenderParameters) => string) &
		((parameters: RenderParameters) => string);

	enterprise: Omit<ReCAPTCHAv3, "enterprise">;
}

declare interface ExecuteOptions {
	action?: "submit" | string;
}

declare interface RenderParameters {
	sitekey: string;
	badge?: "bottomright" | "bottomleft" | "inline";
	size?: "invisible";
	tabindex?: number;
}

declare global {
	interface Window {
		grecaptcha: ReCAPTCHAv3;
	}
}
