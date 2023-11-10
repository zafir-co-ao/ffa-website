import { nodeServiceClient } from "~/lib/deps";

export default function () {
	return nodeServiceClient({ url: useAntboxUrl().value });
}
