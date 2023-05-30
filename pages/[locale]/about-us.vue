<script lang="ts" setup>
import { strings } from "~/lib/intl/strings";
import {
	i18nWebContentGetter,
	webContentGetter,
	webContentSaver,
} from "~/lib/server_api_clients/web_content_client";
import { i18nSectionHeaderGetter } from "~/lib/server_api_clients/section_headers_client";

const { $locale: lang } = useI18n();
</script>

<template>
	<div>
		<Title>{{ strings.about_us[lang] }} - {{ strings.meta_title[lang] }}</Title>
		<app-section-header :getter="i18nSectionHeaderGetter('sobre_nos__separador_1', lang)" />

		<app-web-content
			:getter="i18nWebContentGetter('sobre_nos__texto_1', lang)"
			:edit-getter="webContentGetter('sobre_nos__texto1')"
			:edit-saver="webContentSaver()"
		/>

		<app-section-header :getter="i18nSectionHeaderGetter('sobre_nos__separador_2', lang)" />

		<app-web-content
			:getter="i18nWebContentGetter('sobre_nos__texto_2', lang)"
			:edit-getter="webContentGetter('sobre_nos__texto_2')"
			:edit-saver="webContentSaver()"
		/>

		<app-section-header :getter="i18nSectionHeaderGetter('sobre_nos__separador_3', lang)" />

		<app-web-content
			:getter="i18nWebContentGetter('sobre_nos__texto_3', lang)"
			:edit-getter="webContentGetter('sobre_nos__texto_3')"
			:edit-saver="webContentSaver()"
		/>
		/>

		<app-section-header :getter="i18nSectionHeaderGetter('sobre_nos__separador_4', lang)" />

		<app-web-content
			:getter="i18nWebContentGetter('sobre_nos__texto_4', lang)"
			:edit-getter="webContentGetter('sobre_nos__texto_4')"
			:edit-saver="webContentSaver()"
		/>
	</div>
</template>
