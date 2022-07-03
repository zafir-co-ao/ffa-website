export default function getLawyerPrintTemplate(content: string) {
    const cssUrl = `${location.origin}/__portal/css/main.css`;

	return `<html><head>
		<link rel="stylesheet" href="${cssUrl}" />
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" />
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800,900&amp;display=swap&amp;subset=latin-ext" />
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700,800,900&amp;display=swap&amp;subset=latin-ext" />
		<link rel="stylesheet" href="/_nuxt/assets/sass/fatimafreitas.scss" />

		
	</head>
	<body>
		<div class="ffa" style="padding: 1cm">
			<div>
				<img class="mb-5" height="48px" src="/images/ffa-logo-2.svg">			
			</div>
			${content}
		</div>
		<style>
			.curriculum-header {
				text-align: center;
				margin-bottom: 2em !important;
			}

			p {
				margin-block-end: 0 !important;
			}

		</style>
		<script>
			window.onload = () => window.print();			
		</script>
	</body></html>`;
}

