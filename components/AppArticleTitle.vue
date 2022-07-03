<script lang="ts"></script>

<script lang="ts" setup>
defineProps<{ title: string }>();
</script>

<template>
	<div class="text-center">
		<h1 id="tituloartigo" class="h3 font-weight-700 azul">
			{{ title }}
		</h1>
	</div>
</template>
