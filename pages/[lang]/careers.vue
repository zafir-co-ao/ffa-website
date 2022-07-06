<script lang="ts">
import useLanguage from "~~/lib/useLanguage";
import { strings } from "~~/lib/intl/strings";

const hasErrors = ref(false);
const applicationSent = ref(false);
const errorMessages = ref([""]);
const fileRef = ref<HTMLInputElement>(null as unknown as HTMLInputElement);

const name = ref("");
const mobileNumber = ref("");
const email = ref("");
const comments = ref("");

function attachCurriculum() {
	const validationErrors = validateForm(
		getRecaptcha(),
		name.value,
		mobileNumber.value,
		email.value
	);

	fileRef.value.click();
}

function submitApplication() {
	applicationSent.value = true;
}

function getRecaptcha(): string {
	return (
		(document.getElementById("g-recaptcha-response") as HTMLTextAreaElement)
			?.value ?? ""
	);
}

function validateForm(
	recaptcha: string,
	name: string,
	mobileNumber: string,
	email: string
): string[] {
	const errors: string[] = [];

	if (recaptcha === "") errors.push("Prove-nos que não é um robot");
	if (!validateName(name)) errors.push("Indique um nome válido");
	if (!validateEmail(email))
		errors.push("Indique um endereço de email válido");

	return errors;
}

function validateName(name: string): boolean {
	return name?.length > 6;
}

function validateMobilePhone(mobilePhone: string): boolean {
	if (!mobilePhone) return false;

	const cleanedNumber = mobilePhone.replace(/[^0-9]/g, "");

	return cleanedNumber?.length === 9;
}

function validateEmail(email: string): boolean {
	const emailRe =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (!email || typeof email !== "string" || !email.trim().match(emailRe))
		return false;

	return true;
}

function addScripts() {
	const element = document.querySelector("[ffa-type=recaptcha]");

	if (!element) {
		const script = document.createElement("script");
		script.setAttribute("ffa-type", "recaptcha");
		script.src = "https://www.google.com/recaptcha/api.js";
		script.defer = true;

		document.head.appendChild(script);
	}
}
</script>

<script lang="ts" setup>
const props = defineProps();
const emit = defineEmits([]);

const router = useRouter();

const { lang } = useLanguage(router, useRoute());

onMounted(addScripts);

const scopedMessages = {
	thanksForYourApplication: {
		pt: "Obrigado pela tua candidatura",
		en: "Thanks for your application",
	},
	name: {
		pt: "Nome",
		en: "Name",
	},
	email: { pt: "Endereço de Email", en: "Email Address" },
	message: { pt: "Mensagem", en: "Message" },
	leaveYourMessage: { pt: "Deixe a sua mensagem", en: "Leave your message" },
	applicationAttachmentMessage: {
		pt: "* Ficheiros apenas nos formatos .pdf .doc .docx até 1 MB",
		en: "* Only .pdf .doc .docx with less than 1 MB are allowed",
	},
	attachAndSend: { pt: "Anexar e Enviar", en: "Attach and Send" },
};
</script>

<template>
	<div>
		<Title
			>{{ strings.careers[lang] }} - {{ strings.meta_title[lang] }}</Title
		>

		<app-section-header-container
			fid="carreiras__separador_1"
			:lang="lang"
		/>

		<text-container contentFid="carreiras__texto_1" :lang="lang" />

		<div class="container">
			<div v-if="applicationSent" class="my-5">
				<h3 class="text-center">
					{{ scopedMessages.thanksForYourApplication[lang] }}
				</h3>
			</div>
			<template v-else>
				<div class="row g-2 mt-5 mb-2">
					<div class="col">
						<div class="form-floating">
							<input
								v-model="name"
								class="form-control"
								:placeholder="scopedMessages.name[lang]"
							/>
							<label for="floatingInput">{{
								scopedMessages.name[lang]
							}}</label>
						</div>
					</div>
					<div class="col">
						<div class="form-floating">
							<input
								v-model="email"
								type="email"
								class="form-control"
								:placeholder="scopedMessages.email[lang]"
							/>
							<label>{{ scopedMessages.email[lang] }}</label>
						</div>
					</div>
				</div>

				<div class="row g-2 mb-2">
					<div class="form-floating col">
						<textarea
							v-model="comments"
							class="form-control h-10"
							:placeholder="scopedMessages.leaveYourMessage[lang]"
							maxlength="600"
						></textarea>
						<label>{{ scopedMessages.message[lang] }}</label>
					</div>
				</div>
				<div class="row g-2 mb-2">
					<div class="col">
						<div
							class="g-recaptcha"
							data-sitekey="6LeWvCUcAAAAAL-Jm7O5rvk3CyExhFWzfOLJCF9r"
						/>
					</div>
				</div>
				<div class="row g-2 mb-5">
					<div class="col d-flex align-items-baseline">
						<div>
							<input
								type="file"
								class="d-none"
								ref="fileRef"
								accept=".pdf,.doc,.docx"
								@change="submitApplication"
							/>
							<app-button
								:label="scopedMessages.attachAndSend[lang]"
								@click="attachCurriculum"
							/>

							<div class="azul mt-1 fs-085">
								{{
									scopedMessages.applicationAttachmentMessage[
										lang
									]
								}}
							</div>
						</div>
						<div
							v-if="hasErrors"
							class="alert alert-danger me-3"
							role="alert"
						>
							<div v-for="error in errorMessages">
								* {{ error }}
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.h-10 {
	height: 10rem;
}
</style>
