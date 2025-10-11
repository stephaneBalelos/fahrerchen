<template>
  <section class="relative h-full">
    <div class="w-full overflow-hidden h-full">
      <AppCalendarWeekView 
      :selected-date="props.selectedDate" :events="calendarEvents"
      @create-schedule="$date => $emit('createSchedule', $date)"
      @select-date="$date => $emit('selectDate', $date)"
      @edit-schedule="$id => $emit('editSchedule', $id)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
// import { useScroll } from "@vueuse/core";
import AppCalendarWeekView from "./views/AppCalendarWeekView.vue";
import type { AppCourseActivitySchedule } from "~/types/app.types";

export type AppCalendarEvent = {
  id: string;
  label: string;
  date: Date;
  duration: number; // in minutes
  schedule: AppCourseActivitySchedule;
};

type AppCalendarProps = {
  selectedDate: Date;
  events: AppCalendarEvent[];
  refreshEvents?: () => Promise<void>;
};

const $emit = defineEmits<{
  (e: "createSchedule" | "selectDate", value: Date): void;
  (e: "editSchedule", scheduleId: string): void;
}>();


const props = defineProps<AppCalendarProps>();

const calendarEvents = computed(() => {
  const $events = props.events || [];
  return $events.sort((a, b) => a.date.getTime() - b.date.getTime());
});


const _calendarEl = ref<HTMLElement | null>(null);
// const { y } = useScroll(calendarEl);

// watch(calendarEvents, () => {
//   // scroll to earliest event of the day
//   const earliestEvent = calendarEvents.value[0];

//   if (earliestEvent) {
//     y.value = 6 * 16 * earliestEvent.start_hour;
//   }
// });

// onMounted(() => {
//   // Scroll to the current hour
//   y.value = 6 * 16 * new Date().getHours();
// });
</script>

<style scoped></style>
