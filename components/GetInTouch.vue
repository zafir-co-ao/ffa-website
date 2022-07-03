<template>
	<div>
		<div class="container-fluid bgazul">
			<div class="row">
				<div class="col-sm-12 mt-4 mb-1 text-center">
					<p id="getintouch" class="h2 fw-900 text-white">
						{{ message.getInTouch }}
					</p>
				</div>
			</div>
		</div>

		<div class="container-fluid bgcinzaescuro" style="position: relative">
			<div class="paracinzentoescuro"></div>
			<div class="row">
				<div class="col-sm-12 m-0 p-0 text-center">
					<iframe
						class="office-address"
						:src="selectedMap"
						width="100%"
						height="400"
						frameborder="0"
						allowfullscreen
					></iframe>
				</div>
			</div>
		</div>

		<div class="container-fluid bgcinzaescuro">
			<div class="container pt-2 pb-2">
				<div class="row city-address-container">
					<div
						class="col-lg-3 col-md-4 col-sm-6"
						v-for="office in offices"
					>
						<OfficeLocation
							:officeInfo="office"
							@changeMap="changeMap"
						/>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<div class="text-white p-3 pt-5">
							<p class="h3 fw-900">{{ message.followUs }}</p>
							<p class="body2 fw-normal">
								<a
									class="follow-us"
									target="_blank"
									href="https://ao.linkedin.com/company/fatima-freitas-advogados"
								>
									<img
										style="
											width: 1.5em;
											color: white;
											margin-right: 1.5em;
										"
										src="/images/linkedin-icon-white.svg"
									/>
									LinkedIn
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import offices from "~~/lib/stubs/offices";
import useLanguage from "~~/lib/useLanguage";

const messages = {
	pt: {
		getInTouch: "Contacte-nos",
		followUs: "Siga-nos",
	},
	en: {
		getInTouch: "Get in touch",
		followUs: "Follow us",
	},
};

const { lang } = useLanguage(useRouter(), useRoute());
const selectedMap = ref(offices[0].pin);

const message = computed(() => messages[lang.value]);

function changeMap(officeId: string) {
	selectedMap.value = offices.find((el) => el.id === officeId)?.pin ?? "";
}
</script>

<style lang="scss" scoped>
.follow-us,
.follow-us:link {
	color: white;
	text-decoration: none;
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
}

.paracinzentoescuro {
	z-index: 2;
	position: absolute;
	display: block;
	bottom: 4px;
	left: 0px;
	width: 100%;
	height: 60px;
	background: linear-gradient(
		to right bottom,
		rgba(255, 255, 255, 0) 49.5%,
		rgb(38, 50, 56) 50.5%
	);
}

@media (min-width: 576px) {
	.paracinzentoescuro {
		height: 80px;
	}
}
@media (min-width: 768px) {
	.paracinzentoescuro {
		height: 100px;
	}
}
_:-ms-fullscreen,
:root .paracinzentoescuro {
	background: linear-gradient(
		to right bottom,
		rgba(255, 255, 255, 0) 50%,
		#333333 50%
	);
}
</style>
