<script lang="ts">
/* __placeholder__ */
import type { I18nEventGetter } from "~/lib/server_api_clients/events_client";
import { strings } from "~/lib/intl/strings";
import type { I18nEvent } from "~/lib/model/types/event";
import type { PortalLocale } from "~/lib/model/types/portal_locale";

function getVCalendarContentFromEvent(
	eventFid: string,
	eventTitle: string,
	eventPlace: string,
	eventDateTime: string
) {
	return [
		toVCalendarLine("BEGIN:VCALENDAR"),
		toVCalendarLine("VERSION:2.0"),
		toVCalendarLine("PRODID:-//Fatima Freitas e Associados//PT"),
		toVCalendarLine("BEGIN:VEVENT"),
		toVCalendarLine("UID:", eventFid),
		toVCalendarLine("DTSTAMP:", toVCalendarDateTime(eventDateTime)),
		toVCalendarLine("DTSTART:", toVCalendarDateTime(eventDateTime)),
		toVCalendarLine("DTEND:", toVCalendarDateTime(addOneHour(eventDateTime))),
		toVCalendarLine("LOCATION:", eventPlace),
		toVCalendarLine("SUMMARY:", eventTitle),
		toVCalendarLine("END:VEVENT"),
		toVCalendarLine("END:VCALENDAR"),
	]
		.join("\r\n")
		.concat("\r\n");
}

function addOneHour(value: string) {
	const ONE_HOUR_IN_MILLISECS = 1 * 60 * 60 * 1000;
	return new Date(Date.parse(value) + ONE_HOUR_IN_MILLISECS).toISOString();
}

function toVCalendarLine(...args: string[]) {
	return "".concat(...args);
}

function toVCalendarDateTime(value: string | number | Date) {
	return new Date(value).toISOString().replace(/([-:]|\.\d{3})/g, "");
}

function addToCalendar(eventFid: string, eventTitle: any, eventPlace: any, eventDateTime: any) {
	const calendarContent = getVCalendarContentFromEvent(
		eventFid,
		eventTitle,
		eventPlace,
		eventDateTime
	);
	const file = new File([calendarContent], eventFid.concat(".ics"), {
		type: "text/calendar",
	});

	const url = URL.createObjectURL(file);

	const a = document.createElement("a");
	a.href = url;
	a.click();
}
</script>

<script lang="ts" setup>
interface EventProps {
	getter: I18nEventGetter;
	lang: PortalLocale;
}

const props = defineProps<EventProps>();

const event = ref<I18nEvent>();

const formatedEventDate = computed(() => {
	if (!event.value?.eventDateTime) {
		console.error("Event date is missing");
		console.error(JSON.stringify(event.value, null, 2));

		return "";
	}

	return event.value?.eventDateTime.substring(0, 10);
});

const tooltipTitle = computed(() => strings.add_to_calendar[props.lang]);

const handleAddToCalendar = () =>
	addToCalendar(
		event.value!.fid,
		event.value!.title,
		event.value!.eventPlace,
		event.value!.eventDateTime
	);

onMounted(async () => {
	const res = await props.getter();

	if (res.isLeft()) {
		console.error("Error fetching event ", event.value?.fid, res.value);
		return;
	}

	event.value = res.value;
});
</script>

<template>
	<div class="event-component mt-5">
		<div v-if="event">
			<h5 class="h5 text-black font-weight-500 mb-3">{{ event.title }}</h5>
			<div class="body2">
				<div v-if="(event.eventPlace?.length ?? 0) > 0">
					<i class="bi bi-geo-alt"></i>&nbsp;{{ event.eventPlace }}
				</div>
				<div>
					<a
						class="event-date"
						target="_blank"
						href="#"
						@click="handleAddToCalendar"
						data-bs-toggle="tooltip"
						:title="tooltipTitle"
					>
						<i class="bi bi-calendar"></i>&nbsp;{{ formatedEventDate }}
					</a>
				</div>

				<div>
					<nuxt-link :to="`/${lang}/events/${event.fid}`">
						{{ strings.know_more[lang] }}
					</nuxt-link>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.event-date {
	text-decoration: none;
}
</style>
