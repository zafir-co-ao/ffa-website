<script lang="ts" setup>
import { useAntboxServerUrl } from "./composables/containerConfig";
import { configureAntboxServer } from "./lib/deps";

const antboxServerUrl = useAntboxServerUrl();
configureAntboxServer(antboxServerUrl.value);

const router = useRouter();

router.afterEach(() => {
	if (window) {
		window.scrollTo({ top: 0 });
	}
});
</script>

<template>
	<nuxt-layout>
		<nuxt-page />
	</nuxt-layout>
</template>
