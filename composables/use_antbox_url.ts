const LOCALHOST_URL = "http://localhost:7180";

function getAntboxUrl() {
	try {
		return process.env.ANTBOX_URL ?? LOCALHOST_URL;
	} catch (e) {}

	return LOCALHOST_URL;
}

export default function () {
	if (!process.client) {
		return { value: getAntboxUrl() };
	}

	return useState("antboxUrl", getAntboxUrl);
}

export const ANTBOX_URL = getAntboxUrl();
