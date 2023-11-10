export default function () {
	return useState("antboxUrl", () => useRuntimeConfig().public.antboxUrl);
}
