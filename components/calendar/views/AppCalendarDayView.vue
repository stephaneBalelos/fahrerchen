<template>
  <div class="relative flex flex-col h-full">
    <div
      ref="calendarContainerEl"
      class="relative overflow-auto"
    >
      <div
        v-for="event in eventBlocks"
        :key="event.id"
        :class="`absolute top-[${event.style.top}] left-[${event.style.left}] h-[${event.style.height}] w-[${event.style.width}] p-1 m-1 rounded border-l-2 border-${event.style.color}-600 bg-${event.style.color}-50 shadow cursor-pointer hover:bg-${event.style.color}-100 cursor-pointer`"
        :style="event.style"
        @click="() => $emits('editSchedule', event.id)"
      >
        <p :class="`text-sm font-semibold text-gray-900`">
          {{ event.label }}
        </p>
        <p :class="`text-xs font-semibold text-${event.style.color}-900`">
          {{ format(event.date, "HH:mm") }} -
          {{ format(addMinutes(event.date, event.duration), "HH:mm") }}
        </p>
      </div>
      <div class="absolute top-0 left-0 flex flex-col">
        <div
          v-for="hour in HoursBlocks"
          :key="hour.hour"
          class="w-12 h-20 p-2 flex"
        >
          <p class="text-xs font-normal text-gray-900 dark:text-gray-200">
            {{ hour.label }}
          </p>
        </div>
      </div>
      <div ref="calendarEl" class="grid grid-cols-1 w-full">
        <div
          v-for="hour in HoursBlocks"
          :key="`block-${hour}`"
          class="w-full h-20 p-1.5 border-t border-gray-200 dark:border-gray-800 transition-all cursor-pointer"
          @click="
            () => $emits('createSchedule', setHours(selectedDate, hour.hour))
          "
        >
          <div
            class="hidden w-full h-full rounded p-1.5 border-l-2 border-purple-600 bg-purple-50"
          >
            <p class="text-xs font-normal text-gray-900 mb-px">
              Pickup the grandmother
            </p>
            <p class="text-xs font-semibold text-purple-600">06:00 - 07:30</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, setHours, addMinutes } from "date-fns";
import type { AppCalendarEvent } from "../AppCalendar.vue";
import { useElementBounding, useScroll } from "@vueuse/core";
import { ACTIVITY_COLORS } from "~/constants";

type Props = {
  selectedDate: Date;
  events: AppCalendarEvent[];
};

const $emits = defineEmits<{
  (e: "createSchedule" | "selectDate", date: Date): void;
  (e: "editSchedule", id: string): void;
}>();

const props = defineProps<Props>();

const HoursBlocks = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  label: i === 0 ? "00:00" : i < 10 ? `0${i}:00` : `${i}:00`,
}));

const calendarEl = ref<HTMLElement | null>(null);
const calendarContainerEl = ref<HTMLElement | null>(null);
const { width, height } = useElementBounding(calendarEl);
const { y } = useScroll(calendarContainerEl);

const filteredEvents = computed(() =>
  props.events.filter(
    (event) =>
      format(event.date, "yyyy-MM-dd") ===
      format(props.selectedDate, "yyyy-MM-dd")
  )
);

const eventBlocks = computed(() => {
  const blockHeight = height.value / 24; // height per hour
  const blockWidth = width.value - 64; // full width minus padding
  return filteredEvents.value.map((event) => {
    const top =
      (event.date.getHours() + event.date.getMinutes() / 60) * blockHeight;
    const height = (event.duration * blockHeight) / 60; // minus margin

    // Check for overlapping events and adjust left and width accordingly
    const overlappingEvents = filteredEvents.value.filter(
      (e) =>
        e.id !== event.id &&
        ((e.date <= event.date &&
          addMinutes(e.date, e.duration) > event.date) ||
          (e.date < addMinutes(event.date, event.duration) &&
            addMinutes(e.date, e.duration) >=
              addMinutes(event.date, event.duration)))
    );
    const overlapCount = overlappingEvents.length + 1; // including the current event
    const width = blockWidth / overlapCount;
    const adjustedLeft = 64 + overlappingEvents.filter((e) => e.date < event.date).length * width;

    return {
      ...event,
      style: {
        top: `${Math.floor(top)}px`,
        left: `${Math.floor(adjustedLeft)}px`,
        height: `${Math.floor(height)}px`,
        width: `${Math.floor(width) - 8}px`, // minus margin
        color: ACTIVITY_COLORS[event.type],
      },
    };
  });
});

onMounted(() => {
  // Scroll to the 7th hour (7 AM)
  y.value = (height.value / 24) * 7;
});
</script>

<style scoped></style>
