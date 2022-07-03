<script lang="ts"></script>
<script lang="ts" setup>
defineProps<{ title: string; url: string }>();
</script>

<template>
	<li class="nav-item">
		<NuxtLink :to="url" class="nav-link" aria-current="page">
			<svg class="bi me-2" width="16" height="16">
				<use xlink:href="#home" />
			</svg>
			{{ title }}
		</NuxtLink>
	</li>
</template>

<style scoped>
li {
	padding-left: 0;
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

.bi {
	vertical-align: -0.125em;
	pointer-events: none;
	fill: currentColor;
}
</style>
