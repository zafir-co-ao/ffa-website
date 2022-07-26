<script lang="ts" setup>
import { configureAntboxServer } from "./lib/deps";

const antboxServerUrl = useAntboxServerUrl();
configureAntboxServer(antboxServerUrl.value);

const router = useRouter();

router.afterEach(() => {
	if (process.client) {
		window.scrollTo({ top: 0 });
	}
});
</script>

<template>
	<nuxt-layout>
		<nuxt-page />
	</nuxt-layout>
</template>
