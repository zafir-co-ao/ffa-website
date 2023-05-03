<script lang="ts" setup>
import { strings } from "~~/lib/intl/strings";
import { PortalLocale } from "~~/lib/model/types/portal_locale";
defineProps<{ lang: PortalLocale }>();
</script>

<template>
	<div class="my-5 wrapper">
		<!-- Mesma cor que os breadcrumbs -->
		<span>&lt;&lt;</span>
		<a href="#" @click="$router.back()">
			{{ strings.back[lang] }}
		</a>
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
