<script lang="ts" setup>
import { I18nLegalAlert } from "~/lib/model/types/legal_alert";

definePageMeta({ layout: "admin", middleware: "auth-guard" });

const { data: alerts } = await useFetch<I18nLegalAlert[]>("/api/legal-alerts?lang=pt&latest=1000");
</script>

<template>
	<div>
		<admin-page-title>Alertas Jurídicos</admin-page-title>
		<div class="d-flex justify-content-end">
			<nuxt-link to="/a/edit-legal-alert">
				<app-button label="Adicionar" :dark="true" />
			</nuxt-link>
		</div>
		<list-group>
			<list-group-item
				v-for="a in alerts"
				:title="a.title"
				:details="a.publishedOn"
				:routeTo="`/a/edit-legal-alert?uuid=${a.uuid}`"
			/>
		</list-group>
	</div>
</template>
