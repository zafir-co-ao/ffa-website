import useAuth from "~~/lib/useAuth";

function isBackoffice(path: string = ""): boolean {
	return path.startsWith("/a");
}

export default defineNuxtPlugin(() => {
	addRouteMiddleware((to) => {
		if (!isBackoffice(to.path)) {
			return;
		}

		const { username } = useAuth();

		if (!username) {
			return navigateTo({
				path: "/login",
				query: { redirect: to.fullPath },
			});
		}
	});
});
