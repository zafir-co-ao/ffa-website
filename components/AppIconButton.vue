<script lang="ts" setup>
defineProps<{ iconClass: string }>();
</script>

<template>
	<a href="#" class="btn mx-2"><i class="azul" :class="iconClass"></i></a>
</template>
