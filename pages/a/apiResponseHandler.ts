import { Ref } from "vue";

import { Toast } from "~~/lib/deps";
import { Either } from "~~/lib/either";

export interface ApiResponseHandler {
	handle<T>(
		request: Promise<Either<T, string>>,
		success?: string
	): Promise<T | undefined>;
}

export default function makeApiResponseHandler(
	toast: Ref<Toast>
): ApiResponseHandler {
	return {
		async handle<T>(
			request: Promise<Either<T, string>>,
			success = "Operação executada com sucesso"
		) {
			const result = await request;

			if (result.error) {
				toast.value?.exception({
					name: "ApiCtrlError",
					message: result.error,
				});

				return result.alt;
			}

			toast.value?.success(success);

			return result.success;
		},
	};
}
