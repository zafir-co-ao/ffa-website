<script lang="ts" setup>
import { strings } from "~~/lib/intl/strings";
import useLanguage from "~~/lib/useLanguage";

const { lang } = useLanguage(useRouter(), useRoute());
</script>

<template>
	<div>
		<Title
			>{{ strings.about_us[lang] }} -
			{{ strings.meta_title[lang] }}</Title
		>
		<app-section-header-container
			fid="sobre_nos__separador_1"
			:lang="lang"
		/>

		<text-container contentFid="sobre_nos__texto_1" :lang="lang" />

		<app-section-header-container
			fid="sobre_nos__separador_2"
			:lang="lang"
		/>

		<text-container contentFid="sobre_nos__texto_2" :lang="lang" />

		<app-section-header-container
			fid="sobre_nos__separador_3"
			:lang="lang"
		/>

		<text-container contentFid="sobre_nos__texto_3" :lang="lang" />

		<app-section-header-container
			fid="sobre_nos__separador_4"
			:lang="lang"
		/>

		<text-container contentFid="sobre_nos__texto_4" :lang="lang" />
	</div>
</template>
