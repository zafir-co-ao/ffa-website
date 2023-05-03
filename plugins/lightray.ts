import Lightray from "@zafir.co.ao/lightray";

export default defineNuxtPlugin(async (nuxt) => {
  nuxt.vueApp.use(Lightray);
});
