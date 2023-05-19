<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{ name: string; urlGetter: () => string }>();
const photoUrl = computed(() => props.urlGetter() ?? "/images/anonymous-headshot.png");
</script>

<template>
	<div class="lawyer-card text-center">
		<img :src="photoUrl" class="fotopartner" alt="" />
		<div></div>
		<span class="body1 azul mt-4">{{ name }}</span>
	</div>
</template>

<style lang="scss" scoped>
.lawyer-card div {
	height: 0.5em;
}
</style>
