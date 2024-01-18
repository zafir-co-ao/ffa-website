<script lang="ts" setup>
import { strings } from "~/lib/intl/strings";

definePageMeta({ layout: "none" });

const { $locale: lang } = useI18n();
const auth = useAuth();
const { csrf } = useCsrf();

const router = useRouter();
const route = useRoute();

const username = ref<string>("");
const code = ref<string>("");
const errors = ref<string[]>([]);

const hasErrors = computed(() => errors.value?.length > 0);

async function login() {
	const validationErrors = validateForm(username.value, code.value);

	if (validationErrors.length > 0) {
		errors.value = validationErrors;
		return;
	}

	const response = await sendLogin(username.value, code.value);

	if (response.error && response.errorCode) {
		return handleError(response.errorCode);
	}

	auth.login(username.value, response.token!);

	redirect();
}

function handleError(errorCode: number) {
	switch (errorCode) {
		case 401:
			errors.value = ["Nome de utilizador ou palavra-passe inválidos"];
			break;
		default:
			errors.value = ["Erro desconhecido, contacte o administrador do sistema"];
	}
}

async function sendLogin(
	username: string,
	code: string
): Promise<{
	error: boolean;
	errorCode?: number;
	token?: string;
	errorMessage?: string;
}> {
	const headers = new Headers();
	headers.set("Content-Type", "application/json");
	headers.set("csrf-token", csrf);

	return fetch("/api/login", {
		method: "POST",
		headers,
		body: JSON.stringify({ username, code }),
	})
		.then(async (res) => {
			if (res.status !== 200) {
				return { error: true, errorCode: res.status };
			}
			const token = await res.text();
			return { error: false, token };
		})
		.catch((err) => {
			return { error: true, errorMessage: err.message };
		});
}

function validateForm(username: string, password: string): string[] {
	const errors: string[] = [];

	if (!username) errors.push("Indique um nome de utilizador");
	if (!password) errors.push("Indique uma palavra passe");

	return errors;
}

onMounted(() => {
	if (auth.username) redirect();
});

function redirect() {
	router.push((route.query.redirect as string) || "/a");
}
</script>

<template>
	<div class="ffa d-flex p-4 justify-content-center">
		<div class="form-container pt-5">
			<div class="px-5 mb-3">
				<nuxt-link :to="`/${lang}`">
					<img src="/images/ffa-logo.svg" />
				</nuxt-link>
			</div>

			<div class="h2 text-center mb-3 azulescuro">Área Reservada</div>

			<form action="#">
				<div class="form-floating w-100 mb-2">
					<input
						v-model="username"
						class="form-control"
						:placeholder="strings.username[lang]"
						autocomplete="username"
					/>
					<label for="floatingInput">{{ strings.username[lang] }}</label>
				</div>

				<div class="form-floating w-100 mb-2">
					<input
						type="password"
						v-model="code"
						class="form-control"
						:placeholder="strings.password[lang]"
						autocomplete="current-password"
					/>
					<label for="floatingInput">{{ strings.password[lang] }}</label>
				</div>

				<app-button
					class="w-100"
					:dark="false"
					:label="strings.login[lang]!"
					@click="login"
				/>

				<div v-if="hasErrors" class="alert alert-danger mt-4" role="alert">
					<div v-for="error in errors">* {{ error }}</div>
				</div>
				<input type="hidden" name="csrf_token" :value="csrf" />
			</form>
		</div>
	</div>
</template>

<style scoped>
.form-container {
	width: 100%;
}

@media (min-width: 400px) {
	.form-container {
		width: 366px;
	}
}

input {
	border-radius: 0;
}
</style>
