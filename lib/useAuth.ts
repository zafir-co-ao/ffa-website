const username = ref<string>();

export default function () {
	return {
		username,

		login(theUsername: string) {
			username.value = theUsername;
		},

		logout: () => {
			username.value = undefined;
		},
	};
}
