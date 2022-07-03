var URL;

try {
	URL = process ? process.env.ANTBOX_SERVER_URL : "http://localhost:7180";
} catch (e) {}

export const ANTBOX_SERVER_URL = URL;

export const useAntboxServerUrl = () =>
	useState("antboxServerUrl", () => ANTBOX_SERVER_URL);
