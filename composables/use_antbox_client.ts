import { nodeServiceClient, webContentServiceClient } from "~~/lib/deps";

export default function () {
	const url = useAntboxUrl();
	return {
		nodesClient: nodeServiceClient(useAntboxUrl().value),
		webContentClient: webContentServiceClient(url.value),
	};
}
