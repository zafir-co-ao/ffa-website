<script lang="ts" setup>
import Discovery from "~lightray/Discovery.vue";
import { aspectServiceClient, nodeServiceClient } from "~~/lib/deps";

definePageMeta({ layout: "admin" });
</script>

<template>
	<div>
		<discovery
			:aspect-service-client="aspectServiceClient"
			:node-service-client="nodeServiceClient"
		/>
	</div>
</template>
