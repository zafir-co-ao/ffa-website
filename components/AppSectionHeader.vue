<script lang="ts">
import { LocalizedSectionHeader } from "~/lib/model/types/section_header";
import { I18nSectionHeaderGetter } from "~/lib/server_api_clients/section_headers_client";
</script>

<script lang="ts" setup>
interface SectionHeaderProps {
	getter: I18nSectionHeaderGetter;
}

const props = defineProps<SectionHeaderProps>();

const header = ref<LocalizedSectionHeader>();
const headerRef = ref<HTMLElement>();

onMounted(async () => {
	header.value = await props.getter();
	headerRef.value!.style.backgroundImage = `url(${header.value?.imageUrl})`;
});
</script>

<template>
	<div ref="headerRef" class="section-header container-fluid bg-azul">
		<div class="container">
			<div class="text-center">
				<h1 class="titulo fw-bold text-white text-uppercase" v-html="header?.title ?? ''" />
				<p class="h4 fw-normal text-white" v-html="header?.subtitle ?? ''" />
			</div>
		</div>
		<div v-if="header?.clipTop ?? false" class="paratransparente" />
		<div v-if="header?.clipBottom ?? true" class="parabranco" />
	</div>
</template>

<style type="scss" scoped>
.section-header {
	position: relative;
	background-position: center top;
	background-repeat: no-repeat;
	background-size: cover;
	min-height: 240px;
	max-height: 660px;
	padding: 0;
	height: auto;
	width: 100%;
	padding-top: 10%;
	padding-bottom: 10%;
}

.titulo {
	line-height: 1.25em;
}

.parabranco,
.paratransparente {
	z-index: 2;
	position: absolute;
	display: block;
	left: 0px;
	width: 100%;
	height: 60px;
}

.parabranco {
	bottom: 0px;
	background: linear-gradient(to right bottom, rgba(255, 255, 255, 0) 49.5%, white 50.5%);
}

.paratransparente {
	top: 0px;
	background: linear-gradient(to right bottom, white 49.5%, rgba(255, 255, 255, 0) 50.5%);
}

@media (min-width: 576px) {
	.parabranco,
	.paratransparente {
		height: 80px;
	}
}

@media (min-width: 768px) {
	.parabranco,
	.paratransparente {
		height: 100px;
	}
}

@media (min-width: 1200px) {
	_:-ms-fullscreen,
	:root .parabranco {
		background: linear-gradient(to right bottom, rgba(255, 255, 255, 0) 50%, white 50%);
	} /* IE 11 */

	_:-ms-fullscreen,
	:root .paratransparente {
		background: linear-gradient(to right bottom, white 50%, rgba(255, 255, 255, 0) 50%);
	} /* IE 11 */
}
</style>
