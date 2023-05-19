<script lang="ts"></script>

<script lang="ts" setup>
import { i18nWebContentGetter } from "~/lib/server_api_clients/web_content_client";

const { $locale: lang } = useI18n();
</script>

<template>
	<div>
		<app-web-content :getter="i18nWebContentGetter('disclaimer', lang)" />
	</div>
</template>
