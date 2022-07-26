<script lang="ts" setup>
import { LocalizedSectionHeader } from "~~/lib/model/types/sectionHeader";

definePageMeta({ layout: "admin" });

const { data: sectionHeaders } = await useFetch<
	string,
	LocalizedSectionHeader[]
>("/api/section-headers/-/pt");
</script>

<template>
	<div>
		<admin-page-title>Separadores</admin-page-title>

		<list-group>
			<list-group-item
				v-for="header in sectionHeaders"
				:title="header.nodeTitle"
				:details="''"
				:routeTo="`/a/edit-section-header?uuid=${header.uuid}`"
			/>
		</list-group>
	</div>
</template>
