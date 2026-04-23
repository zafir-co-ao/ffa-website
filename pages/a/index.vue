<script setup>
definePageMeta({ layout: "admin" });
</script>

<template>
	<div>
		<admin-page-title>Changelog</admin-page-title>
		<ul>
			<li>Atualizacao do branding com novos assets de logo em <code>public/images</code></li>
			<li>Atualizacao da pagina de login para usar o novo logotipo principal</li>
			<li>Atualizacao do logo usado nos dados estruturados da pagina de servicos</li>
			<li>
				Correcao do arranque em desenvolvimento no Nuxt ao desativar
				<code>experimental.appManifest</code>
			</li>
			<li>Adicao do editor inplace de conteudos</li>
			<li>Adicao de logout a pagina de administracao</li>
			<li>Correcao do bug do bootstrap no toggle da navbar</li>
			<li>
				Melhoria da performance SEO com o SSR dos conteudos web no componente
				"app-web-content"
			</li>
			<li>Ajuste do layout conforme indicacao da Dra Luisa</li>
			<li>Os eventos passam a ter uma pagina para o arquivo, tal como os artigos e media</li>
			<li>Adicao do campo prioridade aos banners para controlar a ordem de visualizacao</li>
			<li>Remocao do <i>padding</i> no texto da home referente ao "Media & Conhecimento"</li>
		</ul>
	</div>
</template>
