export function makeWhatsappShareUrl() {
	return "https://wa.me/?text=".concat(location.href);
}

export function makeLinkedinShareUrl() {
	return "https://www.linkedin.com/shareArticle?mini=true&url=".concat(
		location.href
	);
}
