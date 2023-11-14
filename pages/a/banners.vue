<script lang="ts" setup>
import { type I18nBanner } from "~~/lib/model/types/banner";

definePageMeta({ layout: "admin", middleware: "auth-guard" });

const { data: banners } = await useFetch<I18nBanner[]>("/api/banners?lang=pt");

function cleanTitle(banner: I18nBanner): string {
	const stage = banner.title1.concat(" ", banner.title2 ?? "").trim();
	return stage.length > 0 ? stage : "SEM TÍTULO";
}
</script>

<template>
	<div>
		<admin-page-title>Banners</admin-page-title>
		<div class="d-flex justify-content-end">
			<nuxt-link to="/a/edit-banner">
				<app-button label="Adicionar" :dark="true" />
			</nuxt-link>
		</div>
		<list-group>
			<list-group-item
				v-for="banner in banners"
				:title="cleanTitle(banner)"
				:details="''"
				:routeTo="`/a/edit-banner?uuid=${banner.uuid}`"
			/>
		</list-group>
	</div>
</template>
