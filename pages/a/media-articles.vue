<script lang="ts" setup>
import { type I18nMediaArticle } from "~/lib/model/types/media_article";

definePageMeta({ layout: "admin", middleware: "auth-guard" });

const { data: articles } = await useFetch<I18nMediaArticle[]>(
	"/api/media-articles?lang=pt&latest=1000"
);
</script>

<template>
	<div>
		<admin-page-title>Artigos de Imprensa</admin-page-title>
		<div class="d-flex justify-content-end">
			<nuxt-link to="/a/edit-media-article">
				<app-button label="Adicionar" :dark="true" />
			</nuxt-link>
		</div>
		<list-group>
			<list-group-item
				v-for="a in articles"
				:title="a.title"
				:details="a.publishedOn"
				:routeTo="`/a/edit-media-article?uuid=${a.uuid}`"
			/>
		</list-group>
	</div>
</template>
