<script lang="ts" setup>
import { type I18nLawyer } from "~~/lib/model/types/lawyer";

const nodeClient = useAntboxClient();

definePageMeta({ layout: "admin" });

const { data: lawyers } = await useFetch<void, I18nLawyer[]>("/api/lawyers?lang=pt");

function avatarUrl(uuid: string): string {
	if (!uuid) {
		return "/images/anonymous-headshot.png";
	}

	return nodeClient.getNodeUrl(uuid);
}
</script>

<template>
	<div>
		<admin-page-title>Advogados</admin-page-title>
		<div class="d-flex justify-content-end">
			<nuxt-link to="/a/edit-lawyer">
				<app-button label="Adicionar" :dark="true" />
			</nuxt-link>
		</div>
		<list-group>
			<list-group-item
				v-for="lawyer in lawyers"
				:title="lawyer.name"
				:details="lawyer.position?.pt ?? ''"
				:imageSrc="avatarUrl(lawyer.thumbnailUuid)"
				:routeTo="`/a/edit-lawyer?uuid=${lawyer.uuid}`"
			/>
		</list-group>
	</div>
</template>
