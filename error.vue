<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps({
	error: Object as () => NuxtError,
});
</script>

<template>
	<div class="ffa container">
		<template v-if="error?.statusCode === 404">
			<div class="ffa container">
				<h1 class>
					<span class="erro d-block fs-3">404</span>
					Page cannot be found
				</h1>
				<p>Sorry, we're unable to bring you the page you're looking for. Please try:</p>
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
		<template v-else>
			<h1 class>
				<span class="erro d-block fs-3">{{ error?.statusCode }}</span>
				Oops, something went wrong.
			</h1>
			<p>Try to refresh this page or feel free to contact us if the problem persists.</p>
		</template>
	</div>
</template>

<style scoped>
.container {
	margin: 0 auto;
	max-width: 600px;
	padding: 5em 1rem;
}
</style>
