import { webContentServiceClient } from "~/lib/deps";

export default function () {
	return webContentServiceClient({ url: useAntboxUrl().value });
}
