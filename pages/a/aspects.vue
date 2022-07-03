<script setup>
import AspectsComponent from "~lightray/Aspects.vue";
import { aspectServiceClient } from "~~/lib/deps";

definePageMeta({ layout: "admin" });
</script>

<template>
	<div>
		<aspects-component :aspectServiceClient="aspectServiceClient" />
	</div>
</template>
