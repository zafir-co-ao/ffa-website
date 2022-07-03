<script lang="ts"></script>

<script lang="ts" setup>
defineProps<{ content: string }>();
</script>

<template>
	<div class="html-field" v-html="`${content ?? ''} &nbsp;`" />
</template>

<style scoped>
.html-field {
	padding: 0.75em 0.75em;
	border: solid 1px #73777f;
	border-radius: 0;
}
</style>
