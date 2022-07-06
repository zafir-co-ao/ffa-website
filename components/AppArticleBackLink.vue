<script lang="ts"></script>

<script lang="ts" setup>
import { strings } from "~~/lib/intl/strings";
import PortalLanguage from "~~/lib/model/portalLanguage";
defineProps<{ lang: PortalLanguage; backPage: string }>();
const emit = defineEmits([]);
</script>

<template>
	<div class="my-5 wrapper">
		<!-- Mesma cor que os breadcrumbs -->
		<span>&lt;&lt;</span>
		<router-link :to="backPage">
			{{ strings.back[lang] }}
		</router-link>
	</div>
</template>

<style lang="scss" scoped>
.wrapper {
	font-size: 0.85em;
}

.wrapper span {
	color: #6c757d;
}
</style>
