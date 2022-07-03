<script lang="ts">
import { fidToUuid } from "antbox";

import { webContentServiceClient, nodeServiceClient } from "~~/lib/deps";
import PortalLanguage from "~~/lib/model/portalLanguage";
</script>

<script lang="ts" setup>
interface SectionHeaderProps {
	titleFid?: string;
	subtitleFid?: string;
	imageFid: string;
	lang: PortalLanguage;
	clipTop?: "true" | "false";
	clipBottom?: "true" | "false";
}

const { titleFid, subtitleFid, imageFid, lang, clipTop, clipBottom } =
	withDefaults(defineProps<SectionHeaderProps>(), {
		clipBottom: "false",
		clipTop: "false",
	});

const state = reactive({ titleContent: "", subtitleContent: "", imageUrl: "" });

state.imageUrl = nodeServiceClient.getNodeUrl(fidToUuid(imageFid));

if (titleFid) {
	const titleUuid = fidToUuid(titleFid);
	state.titleContent = await webContentServiceClient.get(titleUuid, lang);
}

if (subtitleFid) {
	const subtitleUuid = fidToUuid(subtitleFid);
	state.subtitleContent = await webContentServiceClient.get(
		subtitleUuid,
		lang
	);
}
</script>

<template>
	<div
		class="section-header container-fluid d-table"
		:style="{ 'background-image': `url(${state.imageUrl})` }"
	>
		<div class="d-table-cell align-middle text-center">
			<h1
				class="titulo fw-bold text-white text-uppercase"
				style="line-height: 1.25em"
				v-html="state.titleContent"
			/>
			<p class="h4 fw-normal text-white" v-html="state.subtitleContent" />
		</div>
		<div v-if="clipTop === 'true'" class="paratransparente" />
		<div v-if="clipBottom === 'true'" class="parabranco" />
	</div>
</template>

<style type="scss" scoped>
.section-header {
	position: relative;
	background-position: center center;
	background-repeat: no-repeat;
	background-size: cover;
	min-height: 200px;
	padding: 0;
	height: auto;
	width: 100%;
	padding-top: 10%;
	padding-bottom: 10%;
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
	background: linear-gradient(
		to right bottom,
		rgba(255, 255, 255, 0) 49.5%,
		white 50.5%
	);
}

.paratransparente {
	top: 0px;
	background: linear-gradient(
		to right bottom,
		white 49.5%,
		rgba(255, 255, 255, 0) 50.5%
	);
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
		background: linear-gradient(
			to right bottom,
			rgba(255, 255, 255, 0) 50%,
			white 50%
		);
	} /* IE 11 */

	_:-ms-fullscreen,
	:root .paratransparente {
		background: linear-gradient(
			to right bottom,
			white 50%,
			rgba(255, 255, 255, 0) 50%
		);
	} /* IE 11 */
}
</style>
