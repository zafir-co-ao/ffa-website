<script lang="ts" setup>
const router = useRouter();

router.afterEach(() => {
	if (process.client) {
		window.scrollTo({ top: 0 });
	}
});
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>
