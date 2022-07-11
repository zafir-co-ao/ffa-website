<script lang="ts" setup>
import { LocalizedBanner } from "~~/lib/model/banner";

definePageMeta({ layout: "admin" });

const { data: banners } = await useFetch<LocalizedBanner[]>(
	"/api/banners/-/pt"
);

function cleanTitle(banner: LocalizedBanner): string {
	const stage = banner.title1.concat(" ", banner.title2 ?? "").trim();
	return stage.length > 0 ? stage : "SEM TÍTULO";
}
</script>

<template>
	<div>
		<admin-page-title>Banners</admin-page-title>
		<div class="d-flex justify-content-end">
			<nuxt-link to="/a/edit-banner?uuid=_new_">
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
