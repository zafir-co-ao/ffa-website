<script lang="ts">
import PortalLanguage from "~~/lib/model/portalLanguage";
</script>

<script lang="ts" setup>
interface Props {
	lang: PortalLanguage;
	backPageUrl: string;
	backPageTile: string;
	thirdLevelTitle: string;
	articleTitle: string;
}

defineProps<Props>();
const emit = defineEmits([]);
</script>

<template>
	<nav class="pt-3 mb-5" aria-label="breadcrumb">
		<div class="breadcrumb">
			<span class="breadcrumb-item"><a href="/">Home</a></span>
			<span class="breadcrumb-item">
				<nuxt-link :to="backPageUrl">
					{{ backPageTile }}
				</nuxt-link>
			</span>
			<span class="breadcrumb-item active" aria-current="page">{{
				thirdLevelTitle
			}}</span>
			<span class="breadcrumb-item active" aria-current="page">{{
				articleTitle
			}}</span>
		</div>
	</nav>
</template>

<style lang="scss" scoped>
nav {
	--bs-breadcrumb-divider: ">";
}

.breadcrumb {
	font-size: 0.85em;
}
</style>
