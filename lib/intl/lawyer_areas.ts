import areasOfPractice from "./areas_of_practice";
import industries from "./industries";
import { I18nMessagesEntry } from "./strings";

const lawyerAreas: Record<string, I18nMessagesEntry> = {
	...areasOfPractice,
	...industries,
};

export default lawyerAreas;
