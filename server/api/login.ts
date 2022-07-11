import { useBody } from "h3";
import { IncomingMessage, ServerResponse } from "http";

import * as jose from "jose";

const VALID_CREDENTIALS = {
	"vanessa.silva@fatimafreitas.com": "0932",
	"luisa.moreira@fatimafreitas.com": "7819",
	"webdev@qwerty.academy": "0180",
};

export default async function (req: IncomingMessage, res: ServerResponse) {
	const { username, code }: { username: string; code: string } =
		await useBody(req);

	const validCode = VALID_CREDENTIALS[username];

	if (validCode === code) {
		return await buildToken(username);
	}

	res.statusCode = 401;
	res.end("NOK");
}

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
