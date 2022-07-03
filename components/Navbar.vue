<script lang="ts" setup>
import useLanguage from "~~/lib/useLanguage";

const router = useRouter();
const route = useRoute();
const { lang, changePortalLanguage } = useLanguage(router, route);

const navbarRef = ref(null);
const message = computed(() => scopedMessages[lang.value]);
const routeTo = (dst: string) => `/${lang.value}/${dst}`;

onMounted(() => setupIntersectionObserver());

function closeNavbar() {
	new (window as any).bootstrap.Collapse(navbarRef.value);
}

function setupIntersectionObserver() {
	const observer = new IntersectionObserver(
		function (entries) {
			// no intersection
			if (entries[0].intersectionRatio !== 1)
				document
					.querySelector(".navbar-container")
					?.classList.add("navbar-container-stuck");
			// fully intersects
			else if (entries[0].intersectionRatio === 1)
				document
					.querySelector(".navbar-container")
					?.classList.remove("navbar-container-stuck");
		},
		{
			threshold: [0, 1],
		}
	);

	observer.observe(document.querySelector("body") as Element);
}

const scopedMessages = {
	pt: {
		aboutUs: "Sobre Nós",
		services: "Serviços",
		media: "Media e Conhecimento",
		people: "Colaboradores",
		careers: "Carreiras",
	},
	en: {
		aboutUs: "About Us",
		services: "Services",
		media: "Media & Insights",
		people: "People",
		careers: "Careers",
	},
};
</script>

<template>
	<div class="navbar-container">
		<nav class="navbar navbar-expand-xl navbar-light bgwhite pt-0 pb-0">
			<div class="container pt-0 pb-0">
				<nuxt-link class="navbar-brand" :to="routeTo('')">
					<img
						class="logo"
						src="/images/ffa-logo-2.svg"
						alt="Fátima Freitas Associados"
					/>
				</nuxt-link>

				<div class="order-lg-1 order-0 ml-auto ml-lg-3 mr-3 mr-lg-0">
					<a
						class="btnlingua"
						:class="{ active: lang === 'en' }"
						href="#"
						@click="changePortalLanguage('en')"
						>EN</a
					>
					|
					<a
						class="btnlingua"
						:class="{ active: lang === 'pt' }"
						href="#"
						@click="changePortalLanguage('pt')"
						>PT</a
					>
					&nbsp;
					<nuxt-link :to="`/${lang}/search`"
						><i style="font-size: 0.85em" class="bi bi-search"></i
					></nuxt-link>
				</div>

				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span class="navbar-toggler-icon"></span>
				</button>
				<div
					class="collapse navbar-collapse order-lg-0 order-1 justify-content-center"
					id="navbarSupportedContent"
					ref="navbarRef"
				>
					<ul class="navbar-nav ml-auto text-center">
						<li class="nav-item">
							<nuxt-link
								class="nav-link"
								:to="routeTo('about-us')"
								@click="closeNavbar()"
								>{{ message.aboutUs }}</nuxt-link
							>
						</li>

						<li class="nav-item">
							<nuxt-link
								class="nav-link"
								:to="routeTo('services')"
								@click="closeNavbar()"
								>{{ message.services }}
							</nuxt-link>
						</li>

						<li class="nav-item">
							<nuxt-link
								class="nav-link"
								:to="routeTo('media')"
								@click="closeNavbar()"
								>{{ message.media }}
							</nuxt-link>
						</li>

						<li class="nav-item">
							<nuxt-link
								class="nav-link"
								:to="routeTo('people')"
								@click="closeNavbar()"
								>{{ message.people }}
							</nuxt-link>
						</li>
						<li class="nav-item">
							<nuxt-link
								class="nav-link"
								:to="routeTo('careers')"
								@click="closeNavbar()"
								>{{ message.careers }}
							</nuxt-link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	</div>
</template>

<style lang="scss" scoped>
.navbar-brand:hover {
	cursor: pointer;
}

li.nav-item {
	display: list-item;
	padding: 0 !important;
	margin: 0 !important;
	width: auto !important;
}

li.nav-item::before {
	content: none !important;
}

ul.navbar-nav {
	margin: 0 !important;
}

.navbar-container {
	position: sticky;
	top: 0;
	z-index: 1000;
	background-color: white;
}

.navbar-container-stuck {
	box-shadow: 0px 0px 4px #0071bc;
}

ul.navbar-nav li::before {
	content: none;
}

.navbar-light .navbar-nav .nav-link {
	color: #1470b9;
	text-transform: uppercase;
	font-weight: 400;
	font-size: 14px;
	line-height: 60px;
	padding-left: 12px;
	padding-right: 12px;
}

.navbar-light .navbar-nav .nav-link:hover,
.navbar-light .navbar-nav .nav-link:focus {
	color: white;
	background-color: #1470b9;
}

.navbar-light .navbar-nav .show > .nav-link,
.navbar-light .navbar-nav .active > .nav-link,
.navbar-light .navbar-nav .nav-link.show,
.navbar-light .navbar-nav .nav-link.active {
	color: white;
	background-color: #1470b9;
}

/* sm */
@media (min-width: 576px) {
	.navbar-light .navbar-nav .nav-link {
		color: #1470b9;
		text-transform: uppercase;
		font-weight: 400;
		font-size: 14px;
		line-height: 60px;
		padding-left: 12px;
		padding-right: 12px;
	}
}

/* md */
@media (min-width: 768px) {
	.navbar-light .navbar-nav .nav-link {
		color: #1470b9;
		text-transform: uppercase;
		font-weight: 400;
		font-size: 14px;
		line-height: 60px;
		padding-left: 12px;
		padding-right: 12px;
	}

	.portal ul {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
	}

	.portal li {
		width: 49%;
	}
}

/* lg */
@media (min-width: 992px) {
	.portal li {
		width: 32%;
	}

	.navbar-light .navbar-nav .nav-link {
		color: #1470b9;
		text-transform: uppercase;
		font-weight: 400;
		font-size: 14px;
		line-height: 60px;
		padding-left: 12px;
		padding-right: 12px;
	}
}

/* xl */
@media (min-width: 1200px) {
	.navbar-light .navbar-nav .nav-link {
		color: #1470b9;
		text-transform: uppercase;
		font-weight: 400;
		font-size: 14px;
		line-height: 60px;
		padding-left: 24px;
		padding-right: 24px;
	}
}

/* dropdown items */
.dropdown-menu {
	color: white;
	background-color: rgba(20, 112, 185, 0.8);
	border-radius: 0;
	border: 0px solid white;
	margin-top: -1px;
}

.dropdown-item {
	color: white;
	border-bottom: solid 1px rgba(20, 112, 185, 1);
	line-height: 40px;
	text-transform: uppercase;
}

.dropdown-item:hover,
.dropdown-item:focus {
	color: #003152;
	text-decoration: none;
	/* background-color: #f8f9fa; */
	background-color: transparent;
	font-weight: 500;
}

.dropdown-item.active,
.dropdown-item:active {
	color: #003152;
	text-decoration: none;
	/* background-color: #007bff; */
	background-color: transparent;
	font-weight: 500;
}

.dropdown-item.disabled,
.dropdown-item:disabled {
	color: #6c757d;
	pointer-events: none;
	background-color: transparent;
}

/* borders com angulos rectos nos botoes e no hamburger */
.navbar-toggler,
.btn {
	border-radius: 0px;
}
</style>
