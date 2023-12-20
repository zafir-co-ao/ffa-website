import { H3Event, readBody } from "h3";

import * as jose from "jose";

const VALID_CREDENTIALS: Record<string, string> = {
	// "vanessa.silva@fatimafreitas.com": "0932",
	// "luisa.moreira@fatimafreitas.com": "7819",
	"webdev@qwerty.academy": "0180",
	"tiago.teixeira@mirandaalliance.com": "wtymyuk6",
};

interface LoginPayload {
	username: string;
	code: string;
}

export default defineEventHandler(async (req: H3Event) => {
	const { username, code }: LoginPayload = await readBody(req);
	const validCode = VALID_CREDENTIALS[username];

	if (validCode !== code) {
		return sendNoContent(req, 401);
	}

	return buildToken(username);
});

function buildToken(username: string) {
	const payload = {
		username,
		iat: Date.now(),
		exp: Date.now() + 90 * 24 * 60 * 60 * 1000,
	};

	const secret = new TextEncoder().encode("secret-ffa");

	return new jose.SignJWT({ payload })
		.setIssuedAt(Date.now() + 90 * 24 * 60 * 60 * 1000)
		.setExpirationTime("90d")
		.setProtectedHeader({ alg: "HS256" })
		.sign(secret);
}
