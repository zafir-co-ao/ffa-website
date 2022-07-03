<template>
	<div class="text-white p-3 pt-5 city-address" @click="select()">
		<p class="h3 fw-900">{{ name }}</p>
		<p class="body2 fw-normal">
			<span v-html="address"></span><br />
			T {{ phoneNumbers }} <br />
			F {{ faxNumbers }} <br />
			E <a href="mailto:{{email}}">{{ email }}</a>
		</p>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	props: { officeInfo: Object },
	emit: ["changeMap"],
	setup(props: any, ctx: any) {
		const { id, name, address, phoneNumbers, faxNumbers, email } =
			props.officeInfo as OfficeInfo;

		function select() {
			ctx.emit("changeMap", id);
		}

		return {
			name,
			address,
			phoneNumbers,
			faxNumbers,
			email,

			select,
		};
	},
});

interface OfficeInfo {
	id: string;
	name: string;
	address: string;
	phoneNumbers: string;
	faxNumbers: string;
	email: string;
}
</script>

<style lang="scss">
/* Maps */
.city-address:hover {
	cursor: pointer;
	box-shadow: 0px 0px 4px 0px white;
}

.portrait-img-container {
	position: relative;
	width: 100%;
	padding-top: 133%;
	overflow: hidden;
	/* border-radius: 50%;*/
}

.portrait-img-container img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
}
</style>
