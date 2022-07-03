<script lang="ts"></script>

<script lang="ts" setup>
const props = defineProps<{ metadata: string[] }>();
const emit = defineEmits([]);
</script>

<template>
	<div class="body2 text-black text-center">
		{{ metadata.join(" | ") }}
	</div>
</template>
