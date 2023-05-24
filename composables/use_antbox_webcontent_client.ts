import { webContentServiceClient } from "~/lib/deps";

export default function () {
	return webContentServiceClient(useAntboxUrl().value);
}
