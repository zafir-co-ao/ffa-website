<script lang="ts" setup>
import { ref, watch, watchEffect } from "vue";
import Editor from "@tinymce/tinymce-vue";

interface EditorProps {
	modelValue: string;
}

interface EditorEvents {
	(e: "update:modelValue", value: string): void;
}

const EDITOR_INIT = {
	language: "pt_PT",
	plugins: "link lists code",
	toolbar:
		"undo redo | blocks | bold italic underline strikethrough  | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | casechange removeformat | link | emoticons  | code ",
};

const props = defineProps<EditorProps>();
const emit = defineEmits<EditorEvents>();

const loadEditor = ref(false);
const htmlContent = ref("");

const apiKey = useRuntimeConfig().public.tinyMceApiKey;

function updateModel() {
	emit("update:modelValue", htmlContent.value);
}

watchEffect(() => {
	if (!loadEditor.value) {
		// Foi aqui posto para deixar o resto da página carregar
		// estava com probleas de carregamento. Não sei porquê e
		// nem como descrever da melhor forma. O timeout que funcionou
		// foram 2000 ms. Tentar ir dimunuindo o tempo.
		setTimeout(() => {
			loadEditor.value = true;
		}, 500);
	}
});

watch(props, () => {
	htmlContent.value = props.modelValue;
});
</script>

<template>
	<div>
		<editor
			v-if="loadEditor"
			v-model="htmlContent"
			:init="EDITOR_INIT"
			:api-key="apiKey"
			@change="updateModel"
		/>
	</div>
</template>

<style lang="scss">
#htmlEditor {
	min-height: 240px;
}
</style>
