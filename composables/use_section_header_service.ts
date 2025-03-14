import { left, right, type Either } from "antbox-sdk";
import type { SectionHeader } from "~/lib/model/types/section_header";

const API_BASE_URL = "/api/section-headers";

export default function () {
	const update = (uuid: string, formData: FormData): Promise<Either<string, void>> => {
		const url = `${API_BASE_URL}/${uuid}`;
		const headers = new Headers();
		headers.append("csrf-token", useCsrf().csrf);

		return fetch(url, { method: "PUT", body: formData, headers })
			.then(({ ok, statusText }) =>
				ok ? right<string, void>(undefined) : left<string, void>(statusText),
			)
			.catch((err) => left(err as string));
	};

	const load = async (uuid: string): Promise<Either<string, SectionHeader>> => {
		const url = `${API_BASE_URL}/${uuid}`;

		try {
			const data = await $fetch<SectionHeader>(url);
			return right(data);
		} catch (err) {
			console.error(err);
			return left((err as any).message ?? (err as string));
		}
	};

	return {
		load,
		update,
	};
}
