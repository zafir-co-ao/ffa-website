<script lang="ts" setup>
import useLanguage from "~~/lib/useLanguage";
import Lawyer from "~~/lib/model/lawyer";
import { categories, strings } from "~~/lib/intl/strings";

const router = useRouter();

const { lang } = useLanguage(router, useRoute());

const { data: socios } = await useFetch<Lawyer[]>(
	"/api/lawyers/?category=Socio"
);
const { data: consultores } = await useFetch<Lawyer[]>(
	"/api/lawyers/?category=Consultor"
);
const { data: seniores } = await useFetch<Lawyer[]>(
	"/api/lawyers/?category=AssociadoCoordenador"
);
const { data: associados } = await useFetch<Lawyer[]>(
	"/api/lawyers/?category=Associado"
);
const { data: estagiarios } = await useFetch<Lawyer[]>(
	"/api/lawyers/?category=Estagiario"
);
</script>

<template>
	<div>
		<Title
			>{{ strings.people[lang] }} - {{ strings.meta_title[lang] }}</Title
		>

		<app-section-header-container
			fid="colaboradores__separador_1"
			:lang="lang"
		/>

		<text-container contentFid="colaboradores__texto_1" :lang="lang" />

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
					<lawyer-card
						:name="socio.name"
						:portraitUuid="socio.thumbnailUuid"
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
					<lawyer-card
						:name="consultor.name"
						:portraitUuid="consultor.thumbnailUuid"
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
					<lawyer-card
						:name="senior.name"
						:portraitUuid="senior.thumbnailUuid"
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
					<lawyer-card
						:name="junior.name"
						:portraitUuid="junior.thumbnailUuid"
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
					<lawyer-card
						:name="estagiario.name"
						:portraitUuid="estagiario.thumbnailUuid"
					/>
				</nuxt-link>
			</div>
		</div>

		<div class="container mt-5 mb-5">
			<div class="row justify-content-center">
				<div class="col-auto">
					<a class="btnmenuabout" href="#partners">{{
						categories.Socios[lang]
					}}</a>
				</div>
				<div class="col-auto">
					<a class="btnmenuabout" href="#of-counsels">{{
						categories.Consultores[lang]
					}}</a>
				</div>
				<div class="col-auto">
					<a class="btnmenuabout" href="#managing-associates">{{
						categories.AssociadosCoordenadores[lang]
					}}</a>
				</div>
				<div class="col-auto">
					<a class="btnmenuabout" href="#associates">{{
						categories.Associados[lang]
					}}</a>
				</div>
				<div class="col-auto">
					<a class="btnmenuabout" href="#trainees">{{
						categories.Estagiarios[lang]
					}}</a>
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
