<script lang="ts" setup>
interface ActionProps {
	backTo: string;
	deleteDisabled: boolean;
	saveDisabled: boolean;
}

interface ActionEvents {
	(e: "delete"): void;
	(e: "save"): void;
}

defineProps<ActionProps>();
const emit = defineEmits<ActionEvents>();
</script>

<template>
	<div class="row">
		<div class="d-flex">
			<div class="flex-fill">
				<app-delete-button
					@click="emit('delete')"
					:disabled="deleteDisabled"
				/>
			</div>
			<div>
				<nuxt-link :to="backTo">
					<app-button label="Voltar" />
				</nuxt-link>
				&nbsp;

				<app-button
					:dark="true"
					:disabled="saveDisabled"
					label="Salvar"
					@click="emit('save')"
				/>
			</div>
		</div>
	</div>
</template>
