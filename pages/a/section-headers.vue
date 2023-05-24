<script lang="ts" setup>
import { I18nSectionHeader } from "~/lib/model/types/section_header";

definePageMeta({ layout: "admin", middleware: "auth-guard" });

const { data: sectionHeaders } = await useFetch<I18nSectionHeader[]>(
	"/api/section-headers?lang=pt"
);
</script>

<template>
	<div>
		<admin-page-title>Separadores</admin-page-title>

		<list-group>
			<list-group-item
				v-for="header in sectionHeaders"
				:title="header.title"
				:details="header.subtitle ?? ''"
				:routeTo="`/a/edit-section-header?uuid=${header.uuid}`"
			/>
		</list-group>
	</div>
</template>
