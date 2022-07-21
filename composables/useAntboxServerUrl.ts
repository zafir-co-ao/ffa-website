function getAntboxUrl() {
	return process.env?.ANTBOX_URL ?? "http://localhost:7180";
}

export default function () {
	return useState("antboxUrl", getAntboxUrl);
}

export const ANTBOX_URL = getAntboxUrl();
