<script lang="ts" setup>
import LegalAlert, {
	LocalizedLegalAlert,
} from "~~/lib/model/types/legalAlerts";

definePageMeta({ layout: "admin" });

const { data: alerts } = await useFetch<LocalizedLegalAlert[]>(
	"/api/legal-alerts/-/pt"
);
</script>

<template>
	<div>
		<admin-page-title>Alertas Jurídicos</admin-page-title>
		<div class="d-flex justify-content-end">
			<nuxt-link to="/a/edit-legal-alert?uuid=_new_">
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
