//@ts-ignore
import LightrayComponentsClientOnly from "@zafir.co.ao/lightray/clientOnlyComponents";

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.use(LightrayComponentsClientOnly);
});
