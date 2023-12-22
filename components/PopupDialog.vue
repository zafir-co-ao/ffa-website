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
	player.value?.mute();
	player.value?.stopVideo();
	dialogRef.value?.close();
}

function open() {
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

	dialogRef.value?.showModal();
}

defineExpose({ open, close });

function onPlayerReady(event: any) {
	event.target.playVideo();
}

function onPlayerStateChange(event: any) {
	if (event.data === YT.PlayerState.ENDED) {
		close();
	}
}
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
					src="//www.youtube.com/embed/NlqY0D84H4c?enablejsapi=1&showinfo=0&rel=0&modestbranding=0&rel=0"
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
	/* padding: 3.5rem; */
	padding: 4rem 0;
}

.popup-dialog__button {
	position: fixed;
	top: 1rem;
	right: 1rem;

	display: flex;
	align-items: center;
	justify-content: center;

	width: 3rem;
	height: 3rem;

	border-radius: 50%;
	/* #0071bc */
	background-color: rgba(255, 255, 255, 0.5);
}

.popup-dialog__button:hover {
	background-color: rgba(255, 255, 255, 1);
	cursor: pointer;
}

.popup-dialog__button span {
	color: #0071bc;
	font-size: 2.5rem;
	font-weight: 300;
	transform: rotate(45deg);
}

#player {
	width: 320px;
	height: 180px;
}

@media (min-width: 640px) {
	#player {
		width: 540px;
		height: 304px;
	}
}

@media (min-width: 768px) {
	#player {
		width: 640px;
		height: 360px;
	}
}

@media (min-width: 1024px) {
	.popup-dialog__wrapper {
		padding: 4rem;
	}
	.popup-dialog__button {
		position: absolute;
	}

	#player {
		width: 720px;
		height: 400px;
	}
}
</style>
