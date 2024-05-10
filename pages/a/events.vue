<script lang="ts" setup>
import { type I18nEvent } from "~/lib/model/types/event";

definePageMeta({ layout: "admin" });

const { data: events } = await useFetch<I18nEvent[]>("/api/events?lang=pt");
</script>

<template>
	<div>
		<admin-page-title>Eventos</admin-page-title>
		<div class="d-flex justify-content-end">
			<nuxt-link to="/a/edit-event">
				<app-button label="Adicionar" :dark="true" />
			</nuxt-link>
		</div>
		<list-group>
			<list-group-item
				v-for="e in events"
				:title="e.title"
				:details="` ${e.eventDateTime} | ${e.eventPlace ?? 'Local Desconhecido'}`"
				:routeTo="`/a/edit-event?uuid=${e.uuid}`"
			/>
		</list-group>
	</div>
</template>
