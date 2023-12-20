<script lang="ts"></script>
<script lang="ts" setup>
defineProps<{ title: string; url: string }>();
</script>

<template>
	<li class="nav-item">
		<NuxtLink :to="url" class="nav-link" aria-current="page">
			{{ title }}
		</NuxtLink>
	</li>
</template>

<style scoped>
li {
	padding: 0.5rem 0;
}
li::before {
	content: none !important;
}
.nav-link {
	color: white;
}

.nav-link:hover {
	background-color: #0d6efd;
}
</style>
