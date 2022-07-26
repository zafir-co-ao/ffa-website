<script lang="ts"></script>

<script lang="ts" setup>
const { fid } = defineProps<{ fid: string }>();
const { $locale } = useI18n();

const { data: header } = await useFetch(
	`/api/section-headers/fid:${fid}/${$locale.value}`
);
</script>

<template>
	<app-section-header :header="header" />
</template>
