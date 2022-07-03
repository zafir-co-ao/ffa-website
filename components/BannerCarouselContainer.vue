<script lang="ts">
import { Ref } from "vue";
import PortalLanguage from "~~/lib/model/portalLanguage";

function initializeComponent(
	currentIndex: Ref<number>,
	banners: Ref,
	intervalId: Ref<number>
) {
	if (banners.value.length == 0) return;
	currentIndex.value = 0;
	animateBanners(currentIndex, banners.value.length, intervalId);
}

function animateBanners(
	indexRef: Ref<number>,
	bannersCount: number,
	intervalIdRef: Ref<unknown>
) {
	intervalIdRef.value = setInterval(() => {
		indexRef.value = indexRef.value + 1;

		if (indexRef.value >= bannersCount) indexRef.value = 0;
	}, ANIMATION_INTERVAL);
}

function restartBannersAnimation(
	indexRef: Ref<number>,
	bannersCount: number,
	intervalIdRef: Ref<unknown>
) {
	clearInterval(intervalIdRef.value as number);
	animateBanners(indexRef, bannersCount, intervalIdRef);
}

const ANIMATION_INTERVAL = 10000;
</script>

<script lang="ts" setup>
import useLanguage from "~~/lib/useLanguage";

const { lang } = useLanguage(useRouter(), useRoute());

const currentIndex = ref(0);
const intervalIdRef = ref(-1);

const { data: banners } = await useFetch<any[]>("/api/banners/-/" + lang);

const hasBanners = computed(() => banners.value?.length > 0);

const selectIndex = (index: number) => {
	currentIndex.value = index;
	restartBannersAnimation(currentIndex, banners.value.length, intervalIdRef);
};

watch(banners, () => initializeComponent(currentIndex, banners, intervalIdRef));
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
				v-for="(banner, index) in banners"
				class="banner-selector"
				:class="{ 'banner-selector__selected': index === currentIndex }"
				@click="selectIndex(index)"
			/>
		</div>
	</div>
</template>
