const USERNAME_PARAM = "ffa:username";
const TOKEN_PARAM = "ffa:token";

export default function () {
	const username = useState("username", getUsernameFromLocalStorage);
	const token = useState("token", getTokenFromLocalStorage);

	return {
		username: username.value,
		token: token.value,

		login: (theUsername: string, theToken: string) => {
			username.value = theUsername;
			token.value = theToken;
			storeUsernameAndToken(theUsername, theToken);
		},

		logout: () => {
			username.value = null as unknown as string;
			token.value = null as unknown as string;
			clearUsernameAndToken();
		},
	};
}

function getUsernameFromLocalStorage() {
	if (!process.client) {
		return null;
	}

	return localStorage.getItem(USERNAME_PARAM);
}

function getTokenFromLocalStorage() {
	if (!process.client) {
		return null;
	}

	return localStorage.getItem(TOKEN_PARAM);
}

function storeUsernameAndToken(username: string, token: string) {
	localStorage.setItem(USERNAME_PARAM, username);
	localStorage.setItem(TOKEN_PARAM, token);
}

function clearUsernameAndToken() {
	localStorage.removeItem(USERNAME_PARAM);
	localStorage.removeItem(TOKEN_PARAM);
}
