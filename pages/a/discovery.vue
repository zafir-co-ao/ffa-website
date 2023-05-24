<script lang="ts" setup>
const url = useAntboxUrl();

definePageMeta({ layout: "admin", middleware: "auth-guard" });
</script>

<template>
	<div>
		<ClientOnly>
			<Discovery :antbox-url="url" />
		</ClientOnly>
	</div>
</template>
