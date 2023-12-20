<script lang="ts" setup>
import { ref } from "vue";

declare global {
	interface Window {
		onYouTubeIframeAPIReady: () => void;
	}
}

declare namespace YT {
	class Player {
		constructor(id: string, options?: any);
		[key: string]: any;
	}

	export enum PlayerState {
		UNSTARTED = -1,
		ENDED = 0,
		PLAYING = 1,
		PAUSED = 2,
		BUFFERING = 3,
		CUED = 5,
	}
}

const player = ref<YT.Player>();
const dialogRef = ref<HTMLDialogElement>();

function close() {
	dialogRef.value?.close();
	player.value?.stopVideo();
}

function open() {
	dialogRef.value?.showModal();
}

defineExpose({ open, close });

function onPlayerReady(event: any) {
	event.target.unMute();
	event.target.playVideo();
}

function onPlayerStateChange(event: any) {
	console.log(event.data);
	if (event.data === YT.PlayerState.ENDED) {
		close();
	}
}

onMounted(() => {
	window.onYouTubeIframeAPIReady = () => {
		player.value = new YT.Player("player", {
			events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange },
		});
	};

	useHead({
		script: [
			{
				src: "https://www.youtube.com/iframe_api",
			},
		],
	});
});
</script>

<template>
	<dialog ref="dialogRef" class="popup-dialog" @cancel="close">
		<div class="popup-dialog__wrapper">
			<div class="popup-dialog__button" @click="close">
				<span>+</span>
			</div>

			<div class="popup-dialog__container">
				<iframe
					id="player"
					src="//www.youtube.com/embed/NlqY0D84H4c?enablejsapi=1&showinfo=0&rel=0&modestbranding=0&mute=1&rel=0&autoplay=1"
					frameborder="0"
					allow="autoplay; encrypted-media"
				></iframe>
			</div>
		</div>
	</dialog>
</template>

<style scoped>
.popup-dialog {
	border: none;
	padding: 0;
	background-color: transparent;
}
.popup-dialog::backdrop {
	background-color: rgba(0, 0, 0, 0.85);
}

.popup-dialog__wrapper {
	position: relative;
	padding: 3.5rem;
}

.popup-dialog__button {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;

	display: flex;
	align-items: center;
	justify-content: center;

	width: 3rem;
	height: 3rem;

	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.15);

	cursor: pointer;
}

.popup-dialog__button span {
	color: aliceblue;
	font-size: 2.5rem;
	font-weight: 300;
	transform: rotate(45deg);
}

#player {
	width: 560px;
	height: 315px;
}
</style>
