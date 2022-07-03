<script lang="ts"></script>

<script lang="ts" setup>
const props = defineProps<{ fid: string; lang: string }>();

const { data: header } = await useFetch(
	`/api/section-headers/fid:${props.fid}/${props.lang}`
);
</script>

<template>
	<app-section-header :header="header" />
</template>
