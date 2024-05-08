<script lang="ts" setup>
import {
	left,
	type Either,
	type WebContent,
	right,
	nodeServiceClient,
	fidToUuid,
} from "~/lib/deps";
import { i18nSectionHeaderGetter } from "~/lib/server_api_clients/section_headers_client";
import {
	i18nWebContentGetter,
	webContentGetter,
	webContentSaver,
} from "~/lib/server_api_clients/web_content_client";

const dateFormatter = new Intl.DateTimeFormat("pt-PT", {
	timeZone: "Africa/Luanda",
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
});

const hasErrors = ref(false);
const messages = ref<string[]>([]);
const fileRef = ref<HTMLInputElement>(null as unknown as HTMLInputElement);

const name = ref("");
const email = ref("");
const comments = ref("");

const recaptchaSiteKey = useRuntimeConfig().public.recaptchaSiteKey;
const antboxUrl = useRuntimeConfig().public.antboxUrl;
const applicantsKey = useRuntimeConfig().public.applicantsKey;

const nodeService = nodeServiceClient({ url: antboxUrl, apiKey: applicantsKey });

const { $messages, $locale: lang } = useI18n();

function attachCurriculum() {
	const errors = validateForm(name.value, email.value);

	if (errors.length > 0) {
		hasErrors.value = true;
		messages.value = errors;
		return;
	}

	fileRef.value.click();
}

function getRecaptchaToken() {
	return new Promise<Either<Error, string>>((resolve) => {
		window.grecaptcha.ready(() => {
			resolve(onCaptchaReady());
		});
	});
}

async function onCaptchaReady(): Promise<Either<Error, string>> {
	try {
		const token = await window.grecaptcha.execute(recaptchaSiteKey, { action: "submit" });
		return right(token);
	} catch (e) {
		console.error(e);
		return left(e as Error);
	}
}

async function submitApplication() {
	const tokenOrErr = await getRecaptchaToken();

	if (tokenOrErr.isLeft()) {
		console.error(tokenOrErr.value);
		return;
	}

	const { data, status, error } = await sendRecaptchaToken(tokenOrErr.value);

	if (error.value || status.value === "error") {
		hasErrors.value = true;
		messages.value = ["Ocorreu um erro ao validar o reCAPTCHA. Tente novamente mais tarde"];
		console.error(error.value);
		return;
	}

	if (status.value !== "success" || data.value?.errors) {
		hasErrors.value = true;
		messages.value = translateRecaptchaErrors(data.value?.errors ?? []);
		return;
	}

	return uploadApplicationAndResetForm();
}

function translateRecaptchaErrors(errors: string[]): string[] {
	return errors.map((err) => {
		switch (err) {
			case "missing-input-secret":
				return "O segredo do reCAPTCHA está em falta";
			case "invalid-input-secret":
				return "O segredo do reCAPTCHA é inválido ou mal formatado";
			case "missing-input-response":
				return "A resposta do reCAPTCHA está em falta";
			case "invalid-input-response":
				return "A resposta do reCAPTCHA é inválida ou mal formatada";
			case "bad-request":
				return "O pedido ao reCAPTCHA é inválido ou mal formatado";
			case "timeout-or-duplicate":
				return "O pedido ao reCAPTCHA expirou ou é duplicado";
		}

		if (err.startsWith("score-too-low-")) {
			const score = err.split("-")[3];
			return `O seu score do reCAPTCHA é muito baixo (${score})`;
		}

		return err;
	});
}

function sendRecaptchaToken(token: string) {
	return useFetch<{ score?: number; errors: string[] }>("/api/recaptcha", {
		method: "POST",
		body: JSON.stringify({ token }),
		headers: { "Content-Type": "application/json", "csrf-token": useCsrf().csrf },
		ignoreResponseError: true,
	});
}

async function uploadApplicationAndResetForm() {
	const parentOrErr = await nodeService.get(fidToUuid("now-hiring"));
	if (parentOrErr.isLeft()) {
		console.error(parentOrErr.value);
		messages.value = [$messages.pages.careers.text.unknown_error];
		return;
	}

	const today = new Date().toISOString().substring(0, 10);

	const applicationOrErr = await nodeService.createFolder({
		title: `${today} - ${name.value}`,
		parent: parentOrErr.value.uuid,
		description: buildDescription(),
	});

	if (applicationOrErr.isLeft()) {
		console.error(applicationOrErr.value);
		messages.value = [$messages.pages.careers.text.unknown_error];
		return;
	}

	const fileOrErr = await nodeService.createFile(fileRef.value.files![0], {
		parent: applicationOrErr.value.uuid,
		title: `CV - ${name.value} - ${today}`,
	});

	if (fileOrErr.isLeft()) {
		console.error(fileOrErr.value);
		messages.value = [$messages.pages.careers.text.unknown_error];

		return;
	}

	name.value = "";
	email.value = "";
	messages.value = [];
	hasErrors.value = false;
	comments.value = "";
	fileRef.value.value = "";

	messages.value = [$messages.pages.careers.text.thanks_for_your_application];
}

function buildDescription() {
	const now = dateFormatter.format(new Date());

	return `
Nome: ${name.value}
Email: ${email.value}
Comentários: ${comments.value}
Data e Hora: ${now}
`;
}

function validateForm(name: string, email: string): string[] {
	const errors: string[] = [];

	if (!validateName(name)) errors.push("Indique um nome válido");
	if (!validateEmail(email)) errors.push("Indique um endereço de email válido");

	return errors;
}

function validateName(name: string): boolean {
	const nameRe = /^\w+\s+\w+/;

	if (!name || typeof name !== "string" || !name.trim().match(nameRe)) return false;

	return true;
}

function validateEmail(email: string): boolean {
	const emailRe =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (!email || typeof email !== "string" || !email.trim().match(emailRe)) return false;

	return true;
}

function handleWebContentSave(content: WebContent) {
	const saveWebContent = webContentSaver();
	return saveWebContent(content).then(() => {
		// Reload the page
		window.location.reload();
	});
}

useHead({
	script: [
		{
			src: `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`,
			defer: true,
		},
	],
});
</script>

<template>
	<div>
		<Title>{{ $messages.pages.careers.text.page_title }} - {{ $messages.meta.title }}</Title>

		<app-section-header :getter="i18nSectionHeaderGetter('carreiras__separador_1', lang)" />

		<app-web-content
			:getter="i18nWebContentGetter('carreiras__texto_1', lang)"
			:edit-getter="webContentGetter('carreiras__texto_1')"
			:edit-saver="handleWebContentSave"
		/>

		<div class="container">
			<div class="row g-2 mt-5 mb-2">
				<div class="col-12 col-sm-6">
					<div class="form-floating">
						<input
							v-model="name"
							class="form-control"
							:placeholder="$messages.pages.careers.text.name"
						/>
						<label for="floatingInput">{{ $messages.pages.careers.text.name }}</label>
					</div>
				</div>
				<div class="col-12 col-sm-6">
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

			<div class="row g-2 mb-5">
				<div class="col d-flex gap-4 align-items-baseline">
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
					<div
						v-if="messages.length"
						class="alert flex-grow-1"
						:class="{ 'alert-success': !hasErrors, 'alert-danger': hasErrors }"
						role="alert"
					>
						<div v-for="msg in messages">* {{ msg }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.h-10 {
	height: 10rem;
}
</style>
