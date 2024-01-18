<script setup>
const auth = useAuth();

function logout() {
	auth.logout();
	window.location.href = "/";
}
</script>

<template>
	<main>
		<div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark sidebar">
			<a
				href="/"
				class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
			>
				<svg class="bi me-2" width="40" height="32">
					<use xlink:href="#bootstrap" />
				</svg>
				<span class="fs-4">Administração</span>
			</a>
			<hr />

			<admin-nav>
				<admin-nav-item title="Advogados" url="/a/lawyers" />
				<admin-nav-item title="Alertas Jurídicos" url="/a/legal-alerts" />
				<admin-nav-item title="Banners" url="/a/banners" />
				<admin-nav-item title="Eventos" url="/a/events" />
				<admin-nav-item title="Media" url="/a/media-articles" />
				<admin-nav-item title="Separadores" url="/a/section-headers" />
				<hr />
				<admin-nav-item title="Discovery" url="/a/discovery" target="_blank" />
				<admin-nav-item title="Sair" url="#" @click="logout" />
			</admin-nav>
			<hr />
			<!--
			<admin-user-drop-down />
			-->
		</div>

		<div class="b-example-divider"></div>

		<div class="container-fluid scrollarea">
			<slot />
		</div>
	</main>
</template>

<style>
:root {
	font-size: 16px;
}

body {
	min-height: 100vh;
	min-height: -webkit-fill-available;
}

html {
	height: -webkit-fill-available;
}

main {
	display: flex;
	flex-wrap: nowrap;
	height: 100vh;
	height: -webkit-fill-available;
	max-height: 100vh;
	overflow-x: auto;
	overflow-y: hidden;
}

.sidebar {
	width: 280px;
}

.b-example-divider {
	flex-shrink: 0;
	width: 0.25rem;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.1);
	border: solid rgba(0, 0, 0, 0.15);
	border-width: 1px 0;
	box-shadow: inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1), inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.scrollarea {
	overflow-y: auto;
}
</style>
