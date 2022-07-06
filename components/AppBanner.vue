<script lang="ts" setup>
import PortalLanguage from "~~/lib/model/portalLanguage";

interface BannerProps {
	title1: string;
	title2?: string;
	href?: string;
	subtitle?: string;
	imageUrl: string;
	lang: PortalLanguage;
}

const props = defineProps<BannerProps>();
const bannerRef = ref<HTMLDivElement>();

onMounted(() => {
	const el = bannerRef.value;
	el.style.backgroundImage = `url(${props.imageUrl})`;
});
</script>

<template>
	<div ref="bannerRef" class="container-fluid banner">
		<div class="text-center">
			<h1 class="titulo fw-bold text-white text-uppercase">
				{{ title1 }}
				<span v-if="title2"><br />{{ title2 }}</span>
			</h1>

			<p
				id="legendabanner"
				class="h4 fw-normal text-white"
				v-html="subtitle ?? ''"
			/>
			<a v-if="href" :href="href">
				<know-more-button :lang="lang" />
			</a>
		</div>
		<div class="corte" />
	</div>
</template>

<style scoped>
.banner {
	position: relative;

	box-sizing: border-box;

	height: 472px !important;

	width: 100%;
	overflow: hidden;
	background-position: center top;
	background-repeat: no-repeat;
	background-size: cover;
	padding: 0;

	padding-top: 10%;
	padding-bottom: 10%;

	animation: fadein 5s;

	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
}

.corte {
	z-index: 2;
	position: absolute;
	display: block;
	bottom: 0px;
	left: 0px;
	width: 100%;
	height: 60px;
	background: linear-gradient(
		to right bottom,
		rgba(255, 255, 255, 0) 49.5%,
		white 50.5%
	);
}

.titulo {
	font-size: 1.5rem;
	line-height: 1.25em;
}

/* sm */

@media (min-width: 576px) {
	.corte {
		height: 80px;
	}

	.titulo {
		font-size: 1.8rem;
		line-height: 26px;
	}
}

/* md */

@media (min-width: 768px) {
	.corte {
		height: 100px;
	}

	.titulo {
		font-size: 2.5rem;
		line-height: 32px;
	}
}

/* lg */

@media (min-width: 992px) {
	.titulo {
		font-size: 2.5rem;
		line-height: 40px;
	}
}

/* xl */

@media (min-width: 1200px) {
	.titulo {
		font-size: 2.5rem;
		line-height: 32px;
	}

	/* Acerto dos gradientes para internet explorer */
}
_:-ms-fullscreen,
:root .corte {
	background: linear-gradient(
		to right bottom,
		rgba(255, 255, 255, 0) 50%,
		white 50%
	);
} /* IE 11 */
</style>
