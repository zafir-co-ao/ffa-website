<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{ name: string; urlGetter: () => string }>();
const photoUrl = computed(() => props.urlGetter() ?? "/images/anonymous-headshot.png");
</script>

<template>
	<div class="lawyer-card">
		<img :src="photoUrl" class="fotopartner" alt="" />
		<span class="body1 azul">{{ name }}</span>
	</div>
</template>

<style scoped>
.lawyer-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4px;
}
.fotopartner {
	width: 130px;
	height: 130px;
	border-radius: 50%;
	background-position: center center;
	background-repeat: no-repeat;
	background-size: cover;

	object-position: center center;
	object-fit: cover;
}

@media (min-width: 576px) {
	.fotopartner {
		width: 150px;
		height: 150px;
	}
}

@media (min-width: 768px) {
	.fotopartner {
		width: 160px;
		height: 160px;
	}
}
</style>
