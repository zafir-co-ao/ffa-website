import { left, type Either, right } from "~/lib/deps";

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export default defineEventHandler(async (evt) => {
	const cfg = useRuntimeConfig();
	const { token }: { token: string } = await readBody(evt);

	if (!token) {
		return sendNoContent(evt, 400);
	}

	const scoreOrErr = await getRecaptchaScore(cfg.private.recaptchaSecretKey, token);

	if (scoreOrErr.isLeft()) {
		console.error(scoreOrErr.value);

		setResponseStatus(evt, 500);
		return { errors: scoreOrErr.value };
	}

	return { score: scoreOrErr.value };
});

async function getRecaptchaScore(
	secret: string,
	response: string
): Promise<Either<string[], number>> {
	const url = new URL(VERIFY_URL);
	url.searchParams.append("secret", secret);
	url.searchParams.append("response", response);

	try {
		const response = await fetch(url, { method: "POST" });

		const data: RecaptchaResponseModel = await response.json();
		if (!data.success) {
			return left(data["error-codes"] ?? []);
		}

		return data.score >= 0.5 ? right(data.score) : left(["score-too-low-" + data.score]);
	} catch (e: any) {
		return left([e.message]);
	}
}

interface RecaptchaResponseModel {
	success: boolean; // whether this request was a valid reCAPTCHA token for your site
	score: number; // the score for this request (0.0 - 1.0)
	action: string; // the action name for this request (important to verify)
	challenge_ts?: string; // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
	hostname: string; // the hostname of the site where the reCAPTCHA was solved
	"error-codes"?: string[]; // optional
}
