<template>
  <section class="relative h-full">
    <div class="w-full overflow-hidden h-full">
      <UDashboardToolbar v-if="activeView === 'week'">
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
      <UDashboardToolbar v-if="activeView === 'day'">
        <div class="flex justify-between items-center space-x-4 w-full">
          <div class="flex flex-col">
            <span class="text-lg font-semibold">
              {{ format(selectedDate, 'EEEE, dd.MM.yyyy', { locale: currentLocale }) }}
            </span>
          </div>
          <div class="flex gap-2">
            <UButton
              :icon="`i-heroicons-chevron-left-solid`"
              variant="ghost"
              color="gray"
              @click="() => $emits('selectDate', subDays(selectedDate, 1))"
            />
            <UButton
              :icon="`i-heroicons-chevron-right-solid`"
              variant="ghost"
              color="gray"
              @click="() => $emits('selectDate', addDays(selectedDate, 1))"
            />
          </div>
        </div>
      </UDashboardToolbar>
      
      <AppCalendarDayView
        v-if="activeView === 'day'"
        :selected-date="props.selectedDate"
        :events="calendarEvents"
        @create-schedule="($date) => $emit('createSchedule', $date)"
        @select-date="($date) => $emit('selectDate', $date)"
        @edit-schedule="($id) => $emit('editSchedule', $id)"
      />
      <AppCalendarWeekView
        v-else
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
import { getWeek, subDays, addDays, format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import AppCalendarWeekView from "./views/AppCalendarWeekView.vue";
import AppCalendarDayView from "./views/AppCalendarDayView.vue";
import type {
  AppCourseActivitySchedule,
  AppCourseActivityType,
} from "~/types/app.types";
import { useMediaQuery } from "@vueuse/core";

export type AppCalendarEvent = {
  id: string;
  label: string;
  date: Date;
  duration: number; // in minutes
  schedule: AppCourseActivitySchedule;
  type: AppCourseActivityType;
};

export type AppCalendarViewType = "month" | "week" | "day";

type AppCalendarProps = {
  selectedDate: Date;
  events: AppCalendarEvent[];
  viewType?: AppCalendarViewType;
  refreshEvents?: () => Promise<void>;
};

const { t, locale } = useI18n({
  useScope: "local",
});

const currentLocale = computed(() => {
  return locale.value === "de" ? de : enUS;
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

const isMobile = useMediaQuery("(max-width: 768px)");
const activeView = computed(() => (isMobile.value ? "day" : props.viewType || "week"));


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
