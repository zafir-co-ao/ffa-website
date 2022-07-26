<script lang="ts"></script>

<script lang="ts" setup>
const { $locale: lang } = useI18n();
</script>

<template>
	<div>
		<text-container contentFid="disclaimer" :lang="lang" />
	</div>
</template>
