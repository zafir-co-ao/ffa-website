<script lang="ts" setup>
import { I18nLawyer } from "~/lib/model/types/lawyer";
import { categories, strings } from "~/lib/intl/strings";
import { getLawyersByCategory } from "~/lib/server_api_clients/lawyers_client";
import { i18nSectionHeaderGetter } from "~/lib/server_api_clients/section_headers_client";
import { i18nWebContentGetter } from "~/lib/server_api_clients/web_content_client";

const { $locale: lang } = useI18n();

const socios = ref<I18nLawyer[]>([]);
const consultores = ref<I18nLawyer[]>([]);
const seniores = ref<I18nLawyer[]>([]);
const associados = ref<I18nLawyer[]>([]);
const estagiarios = ref<I18nLawyer[]>([]);

const { nodeClient } = useAntboxClient();

onMounted(() => {
	getLawyersByCategory(lang.value, "Socio").then((l) => (socios.value = l));
	getLawyersByCategory(lang.value, "Consultor").then((l) => (consultores.value = l));
	getLawyersByCategory(lang.value, "AssociadoCoordenador").then((l) => (seniores.value = l));
	getLawyersByCategory(lang.value, "Associado").then((l) => (associados.value = l));
	getLawyersByCategory(lang.value, "Estagiario").then((l) => (estagiarios.value = l));
});
</script>

<template>
	<div>
		<Title>{{ strings.people[lang] }} - {{ strings.meta_title[lang] }}</Title>

		<app-section-header :getter="i18nSectionHeaderGetter('colaboradores__separador_1', lang)" />

		<app-web-content :getter="i18nWebContentGetter('colaboradores__texto_1', lang)" />

		<div id="socios" class="container" v-if="socios.length">
			<div class="row mt-5 mb-5">
				<div class="col-sm-12 text-center">
					<h2 class="h3 fw-bold azul">
						{{ categories.Socios[lang] }}
					</h2>
				</div>
			</div>
			<div class="row mt-5 mb-5 justify-content-center">
				<nuxt-link
					v-for="socio in socios"
					:to="`/${lang}/lawyers/${socio.fid}`"
					class="col-lg-4 col-6 lawyer-link mb-5"
				>
					<app-lawyer-card
						:name="socio.name"
						:urlGetter="() => nodeClient.getNodeUrl(socio.thumbnailUuid!)"
					/>
				</nuxt-link>
			</div>
		</div>

		<div id="of-counsels" class="container" v-if="consultores.length">
			<div class="row mt-5 mb-5">
				<div class="col-sm-12">
					<h2 class="h3 fw-bold azul">
						{{ categories.Consultores[lang] }}
					</h2>
				</div>
			</div>
			<div class="row mt-5 mb-5 justify-content-center">
				<nuxt-link
					v-for="consultor in consultores"
					:to="`/${lang}/lawyers/${consultor.fid}`"
					class="col-lg-4 col-6 lawyer-link mb-5"
				>
					<app-lawyer-card
						:name="consultor.name"
						:urlGetter="() => nodeClient.getNodeUrl(consultor.thumbnailUuid!)"
					/>
				</nuxt-link>
			</div>
		</div>

		<div id="managing-associates" class="container" v-if="seniores.length">
			<div class="row mt-5 mb-5">
				<div class="col-sm-12">
					<h2 class="h3 fw-bold azul">
						{{ categories.AssociadosCoordenadores[lang] }}
					</h2>
				</div>
			</div>
			<div class="row mt-5 mb-5 justify-content-center">
				<nuxt-link
					v-for="senior in seniores"
					:to="`/${lang}/lawyers/${senior.fid}`"
					class="col-lg-4 col-6 lawyer-link mb-5"
				>
					<app-lawyer-card
						:name="senior.name"
						:urlGetter="() => nodeClient.getNodeUrl(senior.thumbnailUuid!)"
					/>
				</nuxt-link>
			</div>
		</div>

		<div id="associates" class="container" v-if="associados.length">
			<div class="row mt-5 mb-5">
				<div class="col-sm-12">
					<h2 class="h3 fw-bold azul">
						{{ categories.Associados[lang] }}
					</h2>
				</div>
			</div>
			<div class="row mt-5 mb-5 justify-content-center">
				<nuxt-link
					v-for="junior in associados"
					:to="`/${lang}/lawyers/${junior.fid}`"
					class="col-lg-4 col-6 lawyer-link mb-5"
				>
					<app-lawyer-card
						:name="junior.name"
						:urlGetter="() => nodeClient.getNodeUrl(junior.thumbnailUuid!)"
					/>
				</nuxt-link>
			</div>
		</div>

		<div id="trainees" class="container" v-if="estagiarios.length">
			<div class="row mt-5 mb-5">
				<div class="col-sm-12">
					<h2 class="h3 fw-bold azul">
						{{ categories.Estagiarios[lang] }}
					</h2>
				</div>
			</div>
			<div class="row mt-5 mb-5 justify-content-center">
				<nuxt-link
					v-for="estagiario in estagiarios"
					:to="`/${lang}/lawyers/${estagiario.fid}`"
					class="col-lg-4 col-6 lawyer-link mb-5"
				>
					<app-lawyer-card
						:name="estagiario.name"
						:urlGetter="() => nodeClient.getNodeUrl(estagiario.thumbnailUuid!)"
					/>
				</nuxt-link>
			</div>
		</div>

		<div class="container mt-5 mb-5">
			<div class="row justify-content-center">
				<div class="col-auto">
					<a class="btnmenuabout" href="#partners">{{ categories.Socios[lang] }}</a>
				</div>
				<div class="col-auto">
					<a class="btnmenuabout" href="#of-counsels">{{ categories.Consultores[lang] }}</a>
				</div>
				<div class="col-auto">
					<a class="btnmenuabout" href="#managing-associates">{{
						categories.AssociadosCoordenadores[lang]
					}}</a>
				</div>
				<div class="col-auto">
					<a class="btnmenuabout" href="#associates">{{ categories.Associados[lang] }}</a>
				</div>
				<div class="col-auto">
					<a class="btnmenuabout" href="#trainees">{{ categories.Estagiarios[lang] }}</a>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.lawyer-link {
	text-decoration: none;
}

h2 {
	text-align: center;
}
</style>
