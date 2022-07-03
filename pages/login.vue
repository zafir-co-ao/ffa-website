<script lang="ts" setup>
import { strings } from "~~/lib/intl/strings";
import useLanguage from "~~/lib/useLanguage";

definePageMeta({ layout: "none" });

const { lang } = useLanguage(useRouter(), useRoute());

const username = ref<string>();
const password = ref<string>();
const errors = ref<string[]>();

const hasErrors = computed(() => errors.value?.length > 0);

function login() {
	const validationErrors = validateForm(username.value, password.value);

	if (validationErrors.length > 0) {
		errors.value = validationErrors;
		return;
	}

	errors.value = ["Nome de utilizador ou palavra-passe inválidos"];
}

function validateForm(username: string, password: string): string[] {
	const errors: string[] = [];

	if (!username) errors.push("Indique um nome de utilizador");
	if (!password) errors.push("Indique uma palavra passe");

	return errors;
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

			<div class="form-floating w-100 mb-2">
				<input
					v-model="username"
					class="form-control"
					:placeholder="strings.username[lang]"
				/>
				<label for="floatingInput">{{ strings.username[lang] }}</label>
			</div>

			<div class="form-floating w-100 mb-2">
				<input
					type="password"
					v-model="password"
					class="form-control"
					:placeholder="strings.password[lang]"
				/>
				<label for="floatingInput">{{ strings.password[lang] }}</label>
			</div>

			<app-button
				class="w-100"
				:dark="false"
				:label="strings.login[lang]"
				@click="login"
			/>

			<div v-if="hasErrors" class="alert alert-danger mt-4" role="alert">
				<div v-for="error in errors">* {{ error }}</div>
			</div>
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
