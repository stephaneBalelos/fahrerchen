<template>
  <section class="relative h-full">
    <div class="w-full overflow-hidden h-full">
      <UDashboardToolbar>
        <div class="flex justify-between items-center space-x-4 w-full">
          <div class="flex flex-col">
            <span class="text-lg font-semibold">
              {{ t("calendar_week", { week: getWeek(selectedDate) }) }}
            </span>
          </div>
          <div class="flex gap-2">
            <UButton
              :icon="`i-heroicons-chevron-left-solid`"
              variant="ghost"
              color="gray"
              @click="() => $emits('selectDate', subDays(selectedDate, 7))"
            />
            <UButton
              :icon="`i-heroicons-chevron-right-solid`"
              variant="ghost"
              color="gray"
              @click="() => $emits('selectDate', addDays(selectedDate, 7))"
            />
          </div>
        </div>
      </UDashboardToolbar>
      <AppCalendarWeekView
        :selected-date="props.selectedDate"
        :events="calendarEvents"
        @create-schedule="($date) => $emit('createSchedule', $date)"
        @select-date="($date) => $emit('selectDate', $date)"
        @edit-schedule="($id) => $emit('editSchedule', $id)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
// import { useScroll } from "@vueuse/core";
import { getWeek, subDays, addDays } from "date-fns";
import AppCalendarWeekView from "./views/AppCalendarWeekView.vue";
import type {
  AppCourseActivitySchedule,
  AppCourseActivityType,
} from "~/types/app.types";

export type AppCalendarEvent = {
  id: string;
  label: string;
  date: Date;
  duration: number; // in minutes
  schedule: AppCourseActivitySchedule;
  type: AppCourseActivityType;
};

type AppCalendarProps = {
  selectedDate: Date;
  events: AppCalendarEvent[];
  refreshEvents?: () => Promise<void>;
};

const { t } = useI18n({
  useScope: "local",
});

const $emits = defineEmits<{
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

<i18n lang="json">
{
  "de": {
    "calendar_week": "Kalender Woche { week }"
  },
  "en": {
    "calendar_week": "Calendar Week { week }"
  }
}
</i18n>
