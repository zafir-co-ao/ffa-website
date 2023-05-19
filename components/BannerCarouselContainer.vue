<script lang="ts">
import { Ref } from "vue";
import { LocalizedBanner } from "~/lib/model/types/banner";
import { PortalLocale } from "~/lib/model/types/portal_locale";
import { I18nBannersGetter } from "~/lib/server_api_clients/banners_client";

function initializeComponent(currentIndex: Ref<number>, banners: LocalizedBanner[], intervalId: Ref<number>) {
	if (banners.length == 0) return;
	currentIndex.value = 0;
	animateBanners(currentIndex, banners.length, intervalId);
}

function animateBanners(indexRef: Ref<number>, bannersCount: number, intervalIdRef: Ref<unknown>) {
	intervalIdRef.value = setInterval(() => {
		indexRef.value = indexRef.value + 1;

		if (indexRef.value >= bannersCount) indexRef.value = 0;
	}, ANIMATION_INTERVAL);
}

function restartBannersAnimation(indexRef: Ref<number>, bannersCount: number, intervalIdRef: Ref<unknown>) {
	clearInterval(intervalIdRef.value as number);
	animateBanners(indexRef, bannersCount, intervalIdRef);
}

const ANIMATION_INTERVAL = 10000;
</script>

<script lang="ts" setup>
const props = defineProps<{ getter: I18nBannersGetter; lang: PortalLocale }>();

const currentIndex = ref(0);
const intervalIdRef = ref(-1);
const banners = ref<LocalizedBanner[]>([]);

const hasBanners = computed(() => (banners.value?.length ?? 0) > 0);

const selectIndex = (index: number) => {
	currentIndex.value = index;
	restartBannersAnimation(currentIndex, banners.value?.length ?? 0, intervalIdRef);
};

watch(banners, () => initializeComponent(currentIndex, banners.value ?? [], intervalIdRef));

onMounted(async () => {
	banners.value = await props.getter();
});
</script>

<template>
	<div class="banners-carousel" v-if="hasBanners">
		<app-banner
			v-for="(banner, index) in banners"
			:class="{ 'd-none': index !== currentIndex }"
			:title1="banner.title1"
			:title2="banner.title2"
			:subtitle="banner.subtitle"
			:imageUrl="banner.imageUrl"
			:href="banner.href"
			:lang="lang"
		/>

		<div class="banner-ellipsis">
			<div
				v-for="(_, index) in banners"
				class="banner-selector"
				:class="{ 'banner-selector__selected': index === currentIndex }"
				@click="selectIndex(index)"
			/>
		</div>
	</div>
</template>
