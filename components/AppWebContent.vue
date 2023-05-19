<script lang="ts" setup>
import { I18nWebContentGetter } from "~/lib/server_api_clients/web_content_client";

const props = defineProps<{
	getter: I18nWebContentGetter;
}>();

const content = ref<string>("");
onMounted(async () => {
	content.value = await props.getter();
});
</script>

<template>
	<div class="app-web-content container mt-5 mb-5">
		<div class="row">
			<div class="col" v-html="content" />
		</div>
	</div>
</template>

<style scoped></style>
