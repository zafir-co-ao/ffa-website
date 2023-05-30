<script lang="ts">
const hasErrors = ref(false);
const applicationSent = ref(false);
const errorMessages = ref([""]);
const fileRef = ref<HTMLInputElement>(null as unknown as HTMLInputElement);

const name = ref("");
const email = ref("");
const comments = ref("");

function attachCurriculum() {
	validateForm(getRecaptcha(), name.value, email.value);
	fileRef.value.click();
}

function submitApplication() {
	applicationSent.value = true;
}

function getRecaptcha(): string {
	return (document.getElementById("g-recaptcha-response") as HTMLTextAreaElement)?.value ?? "";
}

function validateForm(recaptcha: string, name: string, email: string): string[] {
	const errors: string[] = [];

	if (recaptcha === "") errors.push("Prove-nos que não é um robot");
	if (!validateName(name)) errors.push("Indique um nome válido");
	if (!validateEmail(email)) errors.push("Indique um endereço de email válido");

	return errors;
}

function validateName(name: string): boolean {
	return name?.length > 6;
}

// function validateMobilePhone(mobilePhone: string): boolean {
// 	if (!mobilePhone) return false;

// 	const cleanedNumber = mobilePhone.replace(/[^0-9]/g, "");

// 	return cleanedNumber?.length === 9;
// }

function validateEmail(email: string): boolean {
	const emailRe =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (!email || typeof email !== "string" || !email.trim().match(emailRe)) return false;

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
import { i18nSectionHeaderGetter } from "~/lib/server_api_clients/section_headers_client";
import {
	i18nWebContentGetter,
	webContentGetter,
	webContentSaver,
} from "~/lib/server_api_clients/web_content_client";

const { $messages, $locale: lang } = useI18n();

onMounted(addScripts);
</script>

<template>
	<div>
		<Title>{{ $messages.pages.careers.text.page_title }} - {{ $messages.meta.title }}</Title>

		<app-section-header :getter="i18nSectionHeaderGetter('carreiras__separador_1', lang)" />

		<app-web-content
			:getter="i18nWebContentGetter('carreiras__texto_1', lang)"
			:edit-getter="webContentGetter('carreiras__texto_1')"
			:edit-saver="webContentSaver()"
		/>
		/>

		<div class="container">
			<div v-if="applicationSent" class="my-5">
				<h3 class="text-center">
					{{ $messages.pages.careers.text.thanks_for_your_application }}
				</h3>
			</div>
			<template v-else>
				<div class="row g-2 mt-5 mb-2">
					<div class="col">
						<div class="form-floating">
							<input
								v-model="name"
								class="form-control"
								:placeholder="$messages.pages.careers.text.name"
							/>
							<label for="floatingInput">{{
								$messages.pages.careers.text.name
							}}</label>
						</div>
					</div>
					<div class="col">
						<div class="form-floating">
							<input
								v-model="email"
								type="email"
								class="form-control"
								:placeholder="$messages.pages.careers.text.email"
							/>
							<label>{{ $messages.pages.careers.text.email }}</label>
						</div>
					</div>
				</div>

				<div class="row g-2 mb-2">
					<div class="form-floating col">
						<textarea
							v-model="comments"
							class="form-control h-10"
							:placeholder="$messages.pages.careers.text.leave_you_message"
							maxlength="600"
						></textarea>
						<label>{{ $messages.pages.careers.text.message }}</label>
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
								:label="$messages.pages.careers.text.attach_and_send"
								@click="attachCurriculum"
							/>

							<div class="azul mt-1 fs-085">
								{{ $messages.pages.careers.text.warning_file_formats }}
							</div>
						</div>
						<div v-if="hasErrors" class="alert alert-danger me-3" role="alert">
							<div v-for="error in errorMessages">* {{ error }}</div>
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
