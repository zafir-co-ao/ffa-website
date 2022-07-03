<script lang="ts"></script>

<script lang="ts" setup>
import { strings } from "~~/lib/intl/strings";
import PortalLanguage from "~~/lib/model/portalLanguage";
defineProps<{ lang: PortalLanguage; backPage: string }>();
const emit = defineEmits([]);
</script>

<template>
	<div style="font-size: 0.85em" class="my-5">
		<!-- Mesma cor que os breadcrumbs -->
		<span style="color: #6c757d">&lt;&lt;</span>
		<router-link :to="backPage">
			{{ strings.back[lang] }}
		</router-link>
	</div>
</template>
