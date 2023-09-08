<script lang="ts" setup>
import { I18nLegalAlert } from "~/lib/model/types/legal_alert";
import { i18nBannersGetter } from "~/lib/server_api_clients/banners_client";
import { getLatestLegalAlerts } from "~/lib/server_api_clients/legal_alerts_client";
import {
	i18nWebContentGetter,
	webContentGetter,
	webContentSaver,
} from "~/lib/server_api_clients/web_content_client";
import { i18nLegalAlertGetter } from "~/lib/server_api_clients/legal_alerts_client";

import { WebContent, fidToUuid } from "~/lib/deps";
import { strings } from "~/lib/intl/strings";

const nodeClient = useAntboxClient();
const { $locale: lang } = useI18n();

const latestNews = ref<I18nLegalAlert[]>([]);

onMounted(async () => {
	latestNews.value = (await getLatestLegalAlerts(lang.value)) as I18nLegalAlert[];
});

// const mediaImageUrl = nodeClient.getNodeUrl(fidToUuid("home_media__imagem_1.jpg"));
const esgVideoUrl = nodeClient.getNodeUrl(fidToUuid("esg-540p-mp4"));

const scopedMessages = {
	knowMore: { pt: "Saiba mais", en: "Know more" },
	media: { pt: "Media & Conhecimento", en: "Media & Insights" },
	aboutUsTeaserTitle: {
		pt: "International Standards, Local Knowledge",
		en: "International Standards, Local Knowledge",
	},
	aboutUsTeaserContent: {
		pt: "Servimos os nossos Clientes onde eles mais precisam",
		en: "We serve our Clients where they need us most",
	},
	legalAlerts: { pt: "Alertas Jurídicos", en: "Legal Alerts" },
};

function handleWebContentSave(content: WebContent) {
	const saveWebContent = webContentSaver();
	return saveWebContent(content).then(() => {
		// Reload the page
		window.location.reload();
	});
}
</script>

<template>
	<div>
		<banner-carousel-container :lang="lang" :getter="i18nBannersGetter(lang)" />

		<div class="container mt-5">
			<app-web-content
				:getter="i18nWebContentGetter('home__titulo_1', lang)"
				:edit-getter="webContentGetter('home__titulo_1')"
				:edit-saver="handleWebContentSave"
			/>
			<app-web-content
				:getter="i18nWebContentGetter('home__texto_1', lang)"
				:edit-getter="webContentGetter('home__texto_1')"
				:edit-saver="handleWebContentSave"
			/>
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
						<img src="/images/mirandaalliance.png" alt="Miranda Alliance" />
					</a>
				</div>
			</div>
		</div>

		<div class="container pb-5">
			<div class="row">
				<div class="col-lg-5 col-md-5 mt-5">
					<p class="h2 fw-bold azul mb-3">{{ scopedMessages.media[lang] }}</p>
					<!-- <img class="mb-3 events" :src="mediaImageUrl" alt="events" /> -->
					<div class="body1 text-black mt-5">
						<app-web-content
							:getter="i18nWebContentGetter('home_media__text', lang)"
							:edit-getter="webContentGetter('home_media__text')"
							:edit-saver="handleWebContentSave"
							style="
								padding: 0;
								margin-top: 0 !important;
								margin-bottom: 0 !important;
							"
						/>
					</div>
					<div class="body2">
						<nuxt-link :to="`/${lang}/media`">
							{{ strings.know_more[lang] }}
						</nuxt-link>
					</div>
					<p class="h2 fw-bold azul mt-5 mb-1">ESG Impact+</p>
					<video
						:src="esgVideoUrl"
						controls
						autoplay
						muted
						style="width: 100%"
						class="my-4"
					>
						Your browser does not support the video tag.
					</video>
					<div class="body2">
						<a
							href="https://indd.adobe.com/view/e5859290-e7d5-451d-a835-de62145ab28a"
							target="_blank"
						>
							{{ strings.know_more[lang] }}
						</a>
					</div>
				</div>
				<div class="col-lg-5 offset-lg-2 offset-md-2 col-md-5 mt-5">
					<p class="h2 fw-bold azul mb-3">
						{{ scopedMessages.legalAlerts[lang] }}
					</p>
					<div v-for="article in latestNews">
						<app-legal-alert
							:getter="i18nLegalAlertGetter(article.uuid, lang, false)"
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
	background: linear-gradient(to right bottom, rgba(255, 255, 255, 0) 49.5%, white 50.5%);
}

.paratransparente {
	top: 0px;
	background: linear-gradient(to right bottom, white 49.5%, rgba(255, 255, 255, 0) 50.5%);
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
		background: linear-gradient(to right bottom, rgba(255, 255, 255, 0) 50%, white 50%);
	} /* IE 11 */

	_:-ms-fullscreen,
	:root .paratransparente {
		background: linear-gradient(to right bottom, white 50%, rgba(255, 255, 255, 0) 50%);
	} /* IE 11 */
}
</style>
