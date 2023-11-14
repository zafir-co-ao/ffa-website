<script lang="ts"></script>

<script lang="ts" setup>
defineProps<{ metadata: string[] }>();
defineEmits([]);
</script>

<template>
	<div class="body2 text-black text-center">
		{{ metadata.join(" | ") }}
	</div>
</template>
