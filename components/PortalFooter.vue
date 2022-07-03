<script lang="ts" setup>
import { strings } from "~~/lib/intl/strings";
import useLanguage from "~~/lib/useLanguage";

const { lang } = useLanguage(useRouter(), useRoute());
const fullYear = new Date().getFullYear();
</script>

<template>
	<div class="container-fluid bgazul">
		<div class="container">
			<div class="row">
				<div class="col-md-6 pt-3 pt-md-4 pb-md-4 text-left">
					<p id="disclaimer" class="h6">
						<nuxt-link
							:to="`/${lang}/disclaimer`"
							class="disclaimer"
						>
							<i class="bi bi-share text-white"></i>&nbsp;
							{{ strings.disclaimer_and_privacy[lang] }}
						</nuxt-link>
					</p>
				</div>
				<div class="col-md-6 pt-md-4 pb-md-4 text-left">
					<p
						class="h6 fw-normal azulclaro"
						style="line-height: 50px; text-align: right"
					>
						&copy; Fátima Freitas & Associados
						{{ fullYear }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.disclaimer {
	color: #fff;
	text-decoration: none;
}
</style>
