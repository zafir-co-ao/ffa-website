<script lang="ts" setup>
import { strings } from "~/lib/intl/strings";

import getLawyerPrintTemplate from "./GetLawyerPrintTemplate";
import { languages } from "~/lib/intl/strings";
import lawyerAreas from "~/lib/intl/lawyer_areas";
import { I18nLawyer } from "~/lib/model/types/lawyer";
import { getI18nLawyer } from "~/lib/server_api_clients/lawyers_client";

const { nodeClient } = useAntboxClient();

const fid = useRoute().params.fid as string;
const { $locale: lang } = useI18n();

const lawyer = ref<I18nLawyer>();

const portraitUrl = computed(() =>
	lawyer.value?.uuid ? nodeClient.getNodeUrl(lawyer.value?.portraitUuid!) : "/images/anonymous-headshot.png"
);

const lawyerLanguages = computed(() => {
	return formatLanguages(lawyer.value?.languages as string[]);
});

const areasOfExpertise = computed(() =>
	lawyer.value?.areas?.map((a) => lawyerAreas[a]?.[lang.value] ?? `%${a}%`).sort((a, b) => a.localeCompare(b))
);

onMounted(() => {
	getI18nLawyer(fid, lang.value).then((l) => (lawyer.value = l));
});

function printCurriculum() {
	const content = document.getElementById("curriculopartner")?.innerHTML;
	const a = window.open("", "", "height=842, width=595");

	a?.document.write(getLawyerPrintTemplate(content as string));
	a?.document.close();
}

function translateLanguages(rawLanguages: string[]): string[] {
	if (!rawLanguages || rawLanguages.length === 0) return [];

	return rawLanguages.map((l: string) => languages[l][lang.value] as string);
}

function formatLanguages(languages: string[]): string {
	if (!languages?.length) return "";

	const joinArray = (acc: string, cur: any, index: number, src: string[]) => {
		const lastSeparator = lang.value === "en" ? " and " : " e ";

		if (index === src.length - 1) return acc.concat(lastSeparator, cur);

		return acc.concat(", ", cur);
	};

	return translateLanguages(languages).reduce(joinArray);
}

const scopedMessages = {
	people: { pt: "Colaboradores", en: "People" },

	contacts: { pt: "Contactos", en: "Contacts" },
	officeContacts: { pt: "Escritório", en: "Office" },
	mobilePhone: { pt: "Telemóvel", en: "Mobile Phone" },
	career: { pt: "Carreira / Qualificações", en: "Career / Qualifications" },
	areas: { pt: "Áreas de Prática", en: "Areas of Practice" },
	languages: { pt: "Idiomas", en: "Languages" },
	back: { pt: "Voltar", en: "Back" },
};

const ldJson = JSON.stringify({
	"@context": "https://schema.org",
	"@type": "Person",
	name: lawyer.value?.name,
	url: `https://fatimafreitas.com/${lang.value}/lawyers/${lawyer.value?.fid}`,
	image: portraitUrl.value,
	affiliation: {
		"@type": "Organization",
		name: strings.meta_og_site_name[lang.value],
	},
	email: lawyer.value?.email,
	jobTitle: lawyer.value?.position,
	knowsLanguage: lawyer.value?.languages,
	telephone: lawyer.value?.officeTelephones,
});
</script>

<template>
	<div class="container">
		<div v-if="lawyer">
			<Script type="application/ld+json" :children="ldJson" />

			<Title>{{ lawyer.name }} - {{ strings.meta_title[lang] }}</Title>
			<nav class="pt-3" aria-label="breadcrumb">
				<div class="breadcrumb fs-085">
					<span class="breadcrumb-item"><a href="/">Home</a></span>
					<span class="breadcrumb-item">
						<router-link to="../people">
							<span>{{ scopedMessages.people[lang] }}</span>
						</router-link>
					</span>
					<span class="breadcrumb-item active" aria-current="page">{{ lawyer.name }}</span>
				</div>
			</nav>

			<div class="row mt-5 mb-5">
				<div class="col-md-4 mb-5 text-center">
					<div class="portrait-img-container">
						<img :src="portraitUrl" class="anonymous-headshot w-100" alt="" />
					</div>
				</div>

				<div id="curriculopartner" class="col-md-8">
					<div class="mb-3 curriculum-header">
						<h1 class="h4 fw-bold azul mb-2 mb-0">
							{{ lawyer?.name }}
						</h1>
						<div class="h5 font-weight-500 azulescuro">
							{{ lawyer.position }}
						</div>
					</div>
					<div class="mt-3" v-html="lawyer.bio"></div>
					<div class="fs-0925">
						<p class="mt-3">
							<span id="labelemail" class="azul">E-mail</span>
							<br />
							<a :href="'mailto:' + lawyer?.email">{{ lawyer?.email }}</a>
						</p>
						<p class="mt-3">
							<span id="labelcontacto" class="azul">{{ scopedMessages.contacts[lang] }}</span>
							<br />
							<label>{{ scopedMessages.officeContacts[lang] }}</label
							>&nbsp;
							<span>{{ lawyer?.officeTelephones }}</span>
							<span v-if="lawyer.mobilePhone">
								<br />
								<label>{{ scopedMessages.mobilePhone[lang] }}</label
								>&nbsp;
								<a :href="'tel:' + lawyer?.mobilePhone">{{ lawyer.mobilePhone }}</a>
							</span>
						</p>
						<div class="mt-3">
							<span class="azul">{{ scopedMessages.career[lang] }}</span>
							<div v-html="lawyer.career"></div>
						</div>
						<div class="mt-3">
							<span id="labelarea" class="azul">{{ scopedMessages.areas[lang] }}</span>
							<br />
							<ul>
								<li v-for="area in areasOfExpertise">{{ area }}</li>
							</ul>
						</div>
						<p class="mt-3">
							<span class="azul">{{ scopedMessages.languages[lang] }}</span>
							<br />
							<span id="linguaspartner">{{ lawyerLanguages }}</span>
						</p>
					</div>

					<a @click="printCurriculum" href="#"><i class="bi bi-printer azul"></i></a>
				</div>
				<div class="mt-5 fs-085">
					<span class="color-gray">&lt;&lt;</span>
					<router-link to="../people"
						><span>{{ scopedMessages.back[lang] }}</span></router-link
					>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
nav {
	--bs-breadcrumb-divider: ">";
}

.color-gray {
	color: #6c757d;
}
</style>
