<script lang="ts"></script>

<script lang="ts" setup>
const props = defineProps();
const emit = defineEmits([]);
</script>

<template>
	<div class="ffa container">
		<h1 class>
			<span class="erro d-block fs-3">404</span>
			Page cannot be found
		</h1>
		<p>
			Sorry, we're unable to bring you the page you're looking for. Please
			try:
		</p>
		<ul>
			<li>Double checking the url</li>
			<li>Hitting the refresh button in your browser</li>
		</ul>
		<p>
			Alternatively, please visit the F&aacute;tima Freitas e Associados
			<a href="/">homepage</a>.
		</p>
	</div>
</template>

<style scoped>
.container {
	margin: 0 auto;
	max-width: 600px;
	padding: 5em 1rem;
}
</style>
