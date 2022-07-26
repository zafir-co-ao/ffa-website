<script lang="ts" setup>
import Lawyer from "~~/lib/model/types/lawyer";
import { categories, strings } from "~~/lib/intl/strings";

const { $locale } = useI18n();

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
			>{{ strings.people[$locale] }} -
			{{ strings.meta_title[$locale] }}</Title
		>

		<app-section-header-container
			fid="colaboradores__separador_1"
			:lang="$locale"
		/>

		<text-container contentFid="colaboradores__texto_1" :lang="$locale" />

		<div id="socios" class="container" v-if="socios.length">
			<div class="row mt-5 mb-5">
				<div class="col-sm-12 text-center">
					<h2 class="h3 fw-bold azul">
						{{ categories.Socios[$locale] }}
					</h2>
				</div>
			</div>
			<div class="row mt-5 mb-5 justify-content-center">
				<nuxt-link
					v-for="socio in socios"
					:to="`/${$locale}/lawyers/${socio.fid}`"
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
						{{ categories.Consultores[$locale] }}
					</h2>
				</div>
			</div>
			<div class="row mt-5 mb-5 justify-content-center">
				<nuxt-link
					v-for="consultor in consultores"
					:to="`/${$locale}/lawyers/${consultor.fid}`"
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
						{{ categories.AssociadosCoordenadores[$locale] }}
					</h2>
				</div>
			</div>
			<div class="row mt-5 mb-5 justify-content-center">
				<nuxt-link
					v-for="senior in seniores"
					:to="`/${$locale}/lawyers/${senior.fid}`"
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
						{{ categories.Associados[$locale] }}
					</h2>
				</div>
			</div>
			<div class="row mt-5 mb-5 justify-content-center">
				<nuxt-link
					v-for="junior in associados"
					:to="`/${$locale}/lawyers/${junior.fid}`"
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
						{{ categories.Estagiarios[$locale] }}
					</h2>
				</div>
			</div>
			<div class="row mt-5 mb-5 justify-content-center">
				<nuxt-link
					v-for="estagiario in estagiarios"
					:to="`/${$locale}/lawyers/${estagiario.fid}`"
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
						categories.Socios[$locale]
					}}</a>
				</div>
				<div class="col-auto">
					<a class="btnmenuabout" href="#of-counsels">{{
						categories.Consultores[$locale]
					}}</a>
				</div>
				<div class="col-auto">
					<a class="btnmenuabout" href="#managing-associates">{{
						categories.AssociadosCoordenadores[$locale]
					}}</a>
				</div>
				<div class="col-auto">
					<a class="btnmenuabout" href="#associates">{{
						categories.Associados[$locale]
					}}</a>
				</div>
				<div class="col-auto">
					<a class="btnmenuabout" href="#trainees">{{
						categories.Estagiarios[$locale]
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
