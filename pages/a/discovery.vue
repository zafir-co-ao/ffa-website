<script lang="ts" setup>
import { LrDiscovery } from "@zafir.co.ao/lightray";
import "@zafir.co.ao/lightray/style.css";

const url = useAntboxUrl();
const tinyMceApiKey = useRuntimeConfig().public.tinyMceApiKey;

definePageMeta({ layout: "none" });
</script>

<template>
	<div>
		<ClientOnly>
			<LrDiscovery :antbox-url="url" :tiny-mce-api-key="tinyMceApiKey" />
		</ClientOnly>
	</div>
</template>
<style scoped></style>
