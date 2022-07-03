<script lang="ts">
import useLanguage from "~~/lib/useLanguage";
</script>

<script lang="ts" setup>
const { lang } = useLanguage(useRouter(), useRoute());
</script>

<template>
	<div>
		<text-container contentFid="disclaimer" :lang="lang" />
	</div>
</template>
