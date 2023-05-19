import { I18nMessagesEntry } from "~/lib/intl/strings";

export default function editIntlField(
	title: string,
	value: I18nMessagesEntry,
	transformFn?: (value: string) => string
) {
	props.content = { ...value };
	props.title = title;
	props.command = "show";

	props.callback = ({ en, pt }) => {
		if (transformFn) {
			value.pt = transformFn(pt);
			value.en = transformFn(en);
			return;
		}

		value.pt = pt;
		value.en = en;
	};
}

export function makeSaveHandler(dialogProps: IntlDialogProps) {
	return (evt) => {
		if (dialogProps.callback) {
			dialogProps.callback(evt);
		}

		dialogProps.command = "hide";
	};
}

export function makeDialogProps(): IntlDialogProps {
	return { command: "hide", content: { pt: undefined as string } };
}
