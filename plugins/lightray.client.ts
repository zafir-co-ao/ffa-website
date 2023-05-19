import Lightray, { components } from "@zafir.co.ao/lightray/dist/plugin";

export default defineNuxtPlugin(async (nuxt) => {
	nuxt.vueApp.use(Lightray);
});
