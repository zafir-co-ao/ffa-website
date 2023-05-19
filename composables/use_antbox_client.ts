import { nodeServiceClient, webContentServiceClient } from "~/lib/deps";
import useAntboxUrl from "./use_antbox_url";

export default function () {
	const url = useAntboxUrl();
	return {
		nodeClient: nodeServiceClient(useAntboxUrl().value),
		webContentClient: webContentServiceClient(url.value),
	};
}
