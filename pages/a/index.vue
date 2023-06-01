<script setup>
definePageMeta({ layout: "admin", middleware: "auth-guard" });
</script>

<template>
	<div>
		<admin-page-title>Changelog</admin-page-title>
		<ul>
			<li>Os eventos passam a ter uma página para o arquivo, tal como os artigos e media</li>
			<li>Adição do campo prioridade aos banners para controlar a ordem de visualização</li>
			<li>Remoção do <i>padding</i> no texto da home referente ao "Media & Conhecimento"</li>
		</ul>
	</div>
</template>
