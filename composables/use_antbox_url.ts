function getAntboxUrl() {
	try {
		return process.env.ANTBOX_URL ?? "http://localhost:7180";
	} catch (e) {}

	return "http://localhost:7180";
}

export default function () {
	return useState("antboxUrl", getAntboxUrl);
}

export const ANTBOX_URL = getAntboxUrl();
