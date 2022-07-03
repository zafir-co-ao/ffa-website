<script lang="ts" setup>
defineProps<{ backTo?: string }>();
</script>

<template>
	<div class="fs-2 azul mt-3 mb-5 d-flex align-items-center">
		<nuxt-link v-if="backTo" class="me-2" :to="backTo">
			<i class="bi bi-x azulescuro"></i>
		</nuxt-link>

		<h2><slot /></h2>
	</div>
</template>
