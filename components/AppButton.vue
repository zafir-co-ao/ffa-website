<script lang="ts" setup>
interface AppButtonProps {
	dark?: boolean;
	label: string;
	condensed?: boolean;
}

withDefaults(defineProps<AppButtonProps>(), {
	lang: "pt",
	dark: false,
	condensed: false,
});
</script>

<template>
	<button
		type="button"
		class="app-btn"
		:class="{ 'btn-claro': !dark, 'btn-escuro': dark, 'btn-condensed': condensed }"
	>
		{{ label }}
	</button>
</template>

<style scoped>
.app-btn {
	font-size: 14px;
	color: #fff;
	padding-top: 1.5em;
	padding-bottom: 1.5em;
	padding-left: 2.5em;
	padding-right: 2.5em;
	border-radius: 0px;
	font-family: "Montserrat", sans-serif;
}

.btn-condensed {
	padding-top: 0.5em;
	padding-bottom: 0.5em;
	padding-left: 1.5em;
	padding-right: 1.5em;
}

.btn-escuro {
	background-color: #003152;
	border-color: #003152;
}

.btn-escuro:hover {
	background-color: #001030;
	border-color: #001030;
}

.btn-escuro:focus,
.btn-escuro.focus {
	box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
}

.btn-escuro.disabled,
.btn-escuro:disabled {
	background-color: #003152;
	border-color: #003152;
}

.btn-escuro:not(:disabled):not(.disabled):active,
.btn-escuro:not(:disabled):not(.disabled).active {
	background-color: #001030;
	border-color: #001030;
}

.btn-escuro:not(:disabled):not(.disabled):active:focus,
.btn-escuro:not(:disabled):not(.disabled).active:focus,
.show > .btn-escuro.dropdown-toggle:focus {
	box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
}

.btn-claro {
	background-color: #0071bc;
	border-color: #0071bc;
}

.btn-claro:hover {
	background-color: #005e9a;
	border-color: #005e9a;
}

.btn-claro:focus,
.btn-claro.focus {
	box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
}

.btn-claro.disabled,
.btn-claro:disabled {
	background-color: #0071bc;
	border-color: #0071bc;
}

.btn-claro:not(:disabled):not(.disabled):active,
.btn-claro:not(:disabled):not(.disabled).active {
	background-color: #005e9a;
	border-color: #005e9a;
}

.btn-claro:not(:disabled):not(.disabled):active:focus,
.btn-claro:not(:disabled):not(.disabled).active:focus {
	box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
}
</style>
