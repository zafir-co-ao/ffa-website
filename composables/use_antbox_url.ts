export default function () {
	return useState(
		"antboxUrl",
		() => useRuntimeConfig().antboxUrl ?? useRuntimeConfig().public.antboxUrl
	);
}
