import { LrToast } from "@zafir.co.ao/lightray/dist/plugin";
import { Ref } from "vue";
import { Either } from "~/lib/deps";

export interface ApiResponseHandler {
	handle<L, R>(request: Promise<Either<L, R>>, success?: string): Promise<R | undefined>;
}

export default function makeApiResponseHandler(toast: Ref<LrToast>): ApiResponseHandler {
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
