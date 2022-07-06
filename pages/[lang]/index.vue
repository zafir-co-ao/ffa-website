<script lang="ts" setup>
import { fidToUuid, nodeServiceClient } from "~~/lib/deps";
import useLanguage from "~~/lib/useLanguage";
import { strings } from "~~/lib/intl/strings";
import BannerCarouselContainer from "~~/components/BannerCarouselContainer.vue";

const endpoint = (lang: string) => `/api/legal-alerts/-/${lang}?latest=2`;

const { lang } = useLanguage(useRouter(), useRoute());

const latestNews = await useFetch(endpoint(lang.value)).then(
	({ data }) => data as any
);

const mediaImageUrl = nodeServiceClient.getNodeUrl(
	fidToUuid("home_media__imagem_1.jpg")
);

const scopedMessages = {
	knowMore: { pt: "Saiba mais", en: "Know more" },
	media: { pt: "Media & Conhecimento", en: "Media & Insights" },
	aboutUsTeaserTitle: {
		pt: "International Standards, Local Knowledge",
		en: "International Standards, Local Knowledge",
	},
	aboutUsTeaserContent: {
		pt: "Servimos os nossos clientes onde eles mais precisam",
		en: "We serve out clients where they need us",
	},
	legalAlerts: { pt: "Alertas Jurídicos", en: "Legal Alerts" },
};
</script>

<template>
	<div>
		<banner-carousel-container />

		<div class="container mt-5">
			<text-container content-fid="home__titulo_1" />

			<text-container class="fs-5" content-fid="home__texto_1" />
		</div>

		<div class="container-fluid bgseparadorhome mt-5 position-relative">
			<div class="paratransparente"></div>
			<div class="parabranco"></div>

			<div class="container mt-5">
				<div class="row mt-5 pt-5">
					<div class="col-md-6 text-white">
						<p class="h2 fw-bold text-white">
							{{ scopedMessages.aboutUsTeaserTitle[lang] }}
						</p>
						<p class="h5 fw-light text-white">
							{{ scopedMessages.aboutUsTeaserContent[lang] }}
						</p>
						<br />
						<a
							target="_blank"
							href="https://www.mirandalawfirm.com/pt/alliance/overview"
						>
							<know-more-button :dark="false" :lang="lang" />
						</a>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 offset-md-6 text-right mt-3 mt-md-0 mb-5">
					<a
						href="https://www.mirandalawfirm.com/alliance/overview/"
						target="_blank"
						class="miranda-link"
					>
						<img
							src="/images/mirandaalliance.png"
							alt="Miranda Alliance"
						/>
					</a>
				</div>
			</div>
		</div>

		<div class="container pb-5">
			<div class="row">
				<div class="col-lg-5 col-md-5 mt-5">
					<p class="h2 fw-bold azul mb-3">
						{{ scopedMessages.media[lang] }}
					</p>
					<img
						class="mb-3 events"
						:src="mediaImageUrl"
						alt="events"
					/>
					<div class="body1 text-black">
						<borderless-text-container
							contentFid="home_media__text"
							:lang="lang"
						/>
					</div>
					<div class="body2">
						<nuxt-link :to="`/${lang}/media`">
							{{ strings.know_more[lang] }}
						</nuxt-link>
					</div>
				</div>
				<div class="col-lg-5 offset-lg-2 offset-md-2 col-md-5 mt-5">
					<p class="h2 fw-bold azul mb-3">
						{{ scopedMessages.legalAlerts[lang] }}
					</p>
					<div v-for="article in latestNews">
						<legal-alert
							:uuid="article.uuid"
							:big-button="true"
							:lang="lang"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
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

.miranda-link {
	margin-bottom: 28px;
}

.miranda-link img {
	max-width: 300px;
	margin-bottom: 20px;
}

.events {
	min-height: 60px;
	width: 100%;
	max-width: 500px;
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
