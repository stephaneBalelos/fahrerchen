<template>
  <div ref="calendarEl" class="absolute inset-0 overflow-y-auto p-4 pt-8">
    <div class="calendar-bg">
      <div
        v-for="hour in HoursBlocks"
        :key="hour"
        class="calendar-hour h-24 flex items-start gap-2"
      >
        <div class="w-full flex items-start justify-center gap-2">
          <div class="calendar-hour-label -translate-y-3">{{ hour }}</div>
          <UDivider />
        </div>
      </div>
    </div>
    <div class="calendar-fg absolute top-4 bottom-0 left-20 right-4">
      <AppCalendarBlock
        v-for="(block, idx) in HoursBlocks"
        :key="idx"
        :block-index="idx"
        :events="calendarEvents.filter((event) => event.start_hour == idx)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScroll } from "@vueuse/core";
import AppCalendarBlock from "./AppCalendarBlock.vue";

type AppCalendarProps = {
  selectedDate: Date;
  events: {
    id: string;
    label: string;
    date: Date;
    start: Date;
    end: Date;
  }[]
};

const props = defineProps<AppCalendarProps>();

const calendarEvents = computed(() => {
  return props.events.map((event) => {
    return {
      id: event.id,
      label: event.label,
        date: event.date,
      start_hour: event.start.getHours(),
      end_hour: event.end.getHours(),
    };
  });
});

const HoursBlocks = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const calendarEl = ref<HTMLElement | null>(null);
const { y } = useScroll(calendarEl);

onMounted(() => {
    // Scroll to the current hour
    y.value = 6 * 16 * new Date().getHours();
})
</script>

<style scoped></style>
