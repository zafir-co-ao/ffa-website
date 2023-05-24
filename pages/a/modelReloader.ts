import { Ref } from "vue";
import { ApiController } from "./apiController";
import { ApiResponseHandler } from "./apiResponseHandler";

export default function makeModelReloader<T>(
	apiHandler: ApiResponseHandler,
	apiCtrl: ApiController<T>,
	builder: () => Partial<T>,
	routeUuid: string,
	model: Ref<T | any>
) {
	return {
		async reload() {
			const uuid = assertUuid(model.value?.uuid ?? routeUuid);

			if (!uuid) {
				model.value = builder();
				return;
			}

			model.value = await apiHandler.handle(apiCtrl.load(uuid, builder));
		},
	};
}

function assertUuid(uuid: string): string {
	return (uuid?.match(/\w+/)?.[0] ?? undefined) as string;
}
