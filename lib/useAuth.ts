export default function () {
	const { username } = retrieveCredentials();
	return {
		username,

		login(theUsername: string, theToken: string) {
			storeCredentials(theUsername, theToken);
		},

		logout: () => {
			clearCredentials();
		},
	};
}

function storeCredentials(username: string, token: string) {
	localStorage.setItem("ffa-username", username);
	localStorage.setItem("ffa-token", token);
}

function retrieveCredentials() {
	if (process.server) {
		return { username: null, token: "" };
	}

	const username = localStorage.getItem("ffa-username");
	const token = localStorage.getItem("ffa-token");
	return { username, token };
}

function clearCredentials() {
	localStorage.removeItem("ffa-username");
	localStorage.removeItem("ffa-token");
}
