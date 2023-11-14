<script lang="ts" setup>
import { type PortalLocale } from "~/lib/model/types/portal_locale";

const { $messages, $locale, localePath } = useI18n();
const route = useRoute();

const navbarRef = ref<HTMLDivElement>();

onMounted(() => setupIntersectionObserver());

function closeNavbar() {
	navbarRef.value?.classList.remove("show");
}

function changeLocale(locale: PortalLocale) {
	window.location.href = route.fullPath.replace(/^\/\w\w/, `/${locale}`);
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
</script>

<template>
	<div class="navbar-container">
		<nav class="navbar navbar-expand-xl navbar-light bgwhite pt-0 pb-0">
			<div class="container pt-0 pb-0">
				<nuxt-link class="navbar-brand" :to="localePath('')">
					<img
						class="logo"
						src="/images/FatimaFreitas-02.png"
						alt="Fátima Freitas Associados"
					/>
				</nuxt-link>

				<div
					class="locale-search-container order-lg-1 order-0 ml-auto ml-lg-3 mr-3 mr-lg-0"
				>
					<a
						class="btnlingua"
						:class="{ active: $locale === 'en' }"
						href="#"
						@click="changeLocale('en')"
						>EN</a
					>
					|
					<a
						class="btnlingua"
						:class="{ active: $locale === 'pt' }"
						href="#"
						@click="changeLocale('pt')"
						>PT</a
					>
					&nbsp;
					<nuxt-link :to="localePath('/search')"><i class="bi bi-search"></i></nuxt-link>
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
								:to="localePath('about-us')"
								@click="closeNavbar()"
								>{{ $messages.components.navbar.text.about_us }}</nuxt-link
							>
						</li>

						<li class="nav-item">
							<nuxt-link
								class="nav-link"
								:to="localePath('services')"
								@click="closeNavbar()"
								>{{ $messages.components.navbar.text.services }}
							</nuxt-link>
						</li>

						<li class="nav-item">
							<nuxt-link
								class="nav-link"
								:to="localePath('media')"
								@click="closeNavbar()"
								>{{ $messages.components.navbar.text.media }}
							</nuxt-link>
						</li>

						<li class="nav-item">
							<nuxt-link
								class="nav-link"
								:to="localePath('people')"
								@click="closeNavbar()"
								>{{ $messages.components.navbar.text.people }}
							</nuxt-link>
						</li>
						<li class="nav-item">
							<nuxt-link
								class="nav-link"
								:to="localePath('careers')"
								@click="closeNavbar()"
								>{{ $messages.components.navbar.text.careers }}
							</nuxt-link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	</div>
</template>

<style lang="scss" scoped>
.locale-search-container {
	min-width: 80px;
	max-width: 80px;
}
.bi {
	font-size: 00.85em;
}
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
	display: flex;
	align-items: center;
	justify-content: center;
	color: #1470b9;
	text-transform: uppercase;
	font-weight: 400;
	font-size: 14px;
	padding-left: 12px;
	padding-right: 12px;
	min-height: 70px;
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
		padding-left: 24px;
		padding-right: 24px;
	}
}
</style>
