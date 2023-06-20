<script setup>
definePageMeta({ layout: "admin", middleware: "auth-guard" });
</script>

<template>
	<div>
		<admin-page-title>Changelog</admin-page-title>
		<ul>
			<li>Adição do editor inplace de conteúdos</li>
			<li>Adição de logout à página de admnistração</li>
			<li>Correcção do bug do bootstrap no toggle da navbar</li>
			<li>
				Melhoria da performace SEO com o SSR dos conteúdos web no compoment
				"app-web-content"
			</li>
			<li>Ajuste do layout conforme indicação da Dra Luísa</li>
			<li>Os eventos passam a ter uma página para o arquivo, tal como os artigos e media</li>
			<li>Adição do campo prioridade aos banners para controlar a ordem de visualização</li>
			<li>Remoção do <i>padding</i> no texto da home referente ao "Media & Conhecimento"</li>
		</ul>
	</div>
</template>
