import useAuth from "~/composables/use_auth";

export default defineNuxtRouteMiddleware((to) => {
	const { username } = useAuth();

	console.log("username", username);

	if (!username) {
		return navigateTo({
			path: "/login",
			query: { redirect: to.fullPath },
		});
	}
});
