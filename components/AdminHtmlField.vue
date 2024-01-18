<script lang="ts"></script>

<script lang="ts" setup>
defineProps<{ content: string }>();
</script>

<template>
	<div class="html-field ffa" v-html="content ?? '&nbsp'" />
</template>

<style scoped>
.html-field {
	padding: 0.75em 0.75em;
	border-radius: 0;
	border: 1px solid #ced4da;
}
</style>
