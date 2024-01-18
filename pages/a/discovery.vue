<script lang="ts" setup>
import { LrDiscovery } from "@zafir.co.ao/lightray";
import "@zafir.co.ao/lightray/style.css";

const url = useAntboxUrl();

definePageMeta({ layout: "none", middleware: "auth-guard" });
</script>

<template>
	<div>
		<ClientOnly>
			<LrDiscovery :antbox-url="url" />
		</ClientOnly>
	</div>
</template>
<style scoped></style>
