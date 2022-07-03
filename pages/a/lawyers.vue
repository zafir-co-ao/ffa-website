<script lang="ts" setup>
import { nodeServiceClient } from "~~/lib/deps";
import Lawyer from "~~/lib/model/lawyer";

definePageMeta({ layout: "admin" });

const { data: lawyers } = await useFetch<void, string, Lawyer[]>(
	"/api/lawyers/-/pt"
);

function avatarUrl(uuid: string): string {
	if (!uuid) {
		return "/images/anonymous-headshot.png";
	}

	return nodeServiceClient.getNodeUrl(uuid);
}
</script>

<template>
	<div>
		<admin-page-title>Advogados</admin-page-title>
		<div class="d-flex justify-content-end">
			<nuxt-link to="/a/edit-lawyer?uuid=_new_">
				<app-button lang="pt" pt="Adicionar" :dark="true" />
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
