import type { Ref } from "vue";
import type { Either } from "~/lib/deps";
import type { Toaster } from "~/types/toaster";

export interface ApiResponseHandler {
	handle<L, R>(request: Promise<Either<L, R>>, success?: string): Promise<R | undefined>;
}

export default function makeApiResponseHandler(toast: Ref<Toaster>): ApiResponseHandler {
	return {
		async handle<L, R>(
			request: Promise<Either<L, R>>,
			success = "Operação executada com sucesso"
		) {
			const result = await request;

			if (result.isLeft()) {
				toast.value?.exception({
					name: "ApiCtrlError",
					message: result.value as string,
				});

				return;
			}

			toast.value?.success(success);

			return result.value;
		},
	};
}
