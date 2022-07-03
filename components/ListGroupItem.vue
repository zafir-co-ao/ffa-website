<script lang="ts"></script>

<script lang="ts" setup>
interface ListGroupItemProps {
	readonly title: string;
	readonly details: string;
	readonly imageSrc?: string;
	readonly routeTo?: string;
}
defineProps<ListGroupItemProps>();
</script>

<template>
	<routerLink
		:to="routeTo ?? '#'"
		class="list-group-item list-group-item-action"
		aria-current="true"
	>
		<div class="d-flex w-100 justify-content-between">
			<div>
				<h5 class="mb-1">{{ title }}</h5>
				<small class="mb-1">{{ details }}</small>
			</div>
			<img
				v-if="imageSrc"
				:src="imageSrc"
				alt=""
				width="48"
				height="48"
				class="rounded-circle me-2"
			/>
		</div>
	</routerLink>
</template>

<style scoped>
.list-group-item {
	border-left: none;
	border-right: none;
	border-radius: 0;
}
</style>
