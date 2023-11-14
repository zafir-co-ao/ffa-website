<script lang="ts" setup>
import "@zafir.co.ao/lightray/style.css";
import { LrDiscovery } from "@zafir.co.ao/lightray";

const url = useAntboxUrl();

definePageMeta({ layout: "admin", middleware: "auth-guard" });
</script>

<template>
	<div>
		<ClientOnly>
			<LrDiscovery :antbox-url="url" />
		</ClientOnly>
	</div>
</template>
