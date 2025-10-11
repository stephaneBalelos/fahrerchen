<template>
  <div class="relative flex flex-col h-full">
    <UDashboardToolbar>
      <div class="flex items-center space-x-4">
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
    <div class="grid grid-cols-7 sticky top-0 left-0 w-full">
      <div
        v-for="(date, index) in DatesBlocks"
        :key="`header-${index}`"
        :class="`p-3.5 flex items-center justify-center text-sm font-medium text-gray-900 dark:text-gray-200 ${
          date.is_selected ? 'text-primary-600 dark:text-primary-400' : ''
        }`"
      >
        {{ format(date.date, "EEE dd.MM.", { locale: currentLocale }) }}
      </div>
    </div>
    <div ref="calendarContainerEl" class="relative overflow-auto">
      <div ref="calendarEl" class="grid grid-cols-7 w-full min-h-screen">
        <template v-for="hour in HoursBlocks" :key="hour">
          <template v-for="(date, index) in DatesBlocks" :key="index">
            <div
              class="h-32 lg:h-28 p-0.5 md:p-3.5 border-t border-r border-gray-200 dark:border-gray-800 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              @click="
                () => $emits('createSchedule', setHours(date.date, hour.hour))
              "
            />
          </template>
        </template>
      </div>
      <div
        v-for="event in eventBlocks"
        :key="event.id"
        :class="`absolute top-[${event.style.top}] left-[${event.style.left}] h-[${event.style.height}] w-[${event.style.width}] p-1.5 m-1 rounded border-l-2 border-blue-600 bg-blue-50 shadow cursor-pointer hover:bg-blue-100 cursor-pointer`"
        :style="event.style"
        @click="() => $emits('editSchedule', event.id)"
      >
        <p class="text-xs font-normal text-gray-900 mb-px">{{ event.label }}</p>
        <p class="text-xs font-semibold text-blue-600">
          {{ format(event.date, "HH:mm") }} -
          {{ format(addMinutes(event.date, event.duration), "HH:mm") }}
        </p>
      </div>

      <div class="absolute left-0 top-0 w-16 h-full grid">
        <div
          v-for="hour in HoursBlocks"
          :key="hour.hour"
          class="h-32 lg:h-28 w-full flex flex-col"
        >
          <p class="text-xs font-normal text-gray-900 dark:text-gray-200 p-2">
            {{ hour.label }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, setHours, startOfWeek, addMinutes, getWeek, subDays, addDays } from "date-fns";
import { de, enUS } from "date-fns/locale";
import type { AppCalendarEvent } from "../AppCalendar.vue";
import { useElementBounding, useScroll } from "@vueuse/core";

const { t, locale } = useI18n({
  useScope: "local",
});

const props = defineProps<{
  selectedDate: Date;
  events: AppCalendarEvent[];
}>();

const currentLocale = computed(() => {
  return locale.value === "de" ? de : enUS;
});

const HoursBlocks = computed(() => {
  return Array.from({ length: 24 }).map((_, i) => {
    return {
      hour: i,
      label: i.toString().padStart(2, "0") + ":00",
    };
  });
});

const $emits = defineEmits<{
  (e: "createSchedule" | "selectDate", date: Date): void;
  (e: "editSchedule", scheduleId: string): void;
}>();

const DatesBlocks = computed(() => {
  // Get all dates of the week based on selectedDate
  const start = startOfWeek(props.selectedDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return {
      date,
      label: format(date, "dd.MM."),
      is_selected:
        format(date, "yyyy-MM-dd") === format(props.selectedDate, "yyyy-MM-dd"),
    };
  });
});

const calendarEl = ref<HTMLElement | null>(null);
const calendarContainerEl = ref<HTMLElement | null>(null);
const { width, height } = useElementBounding(calendarEl);
const { y } = useScroll(calendarContainerEl);

const filteredEvents = computed(() => {
  return props.events.filter((event) => {
    return (
      event.date >= DatesBlocks.value[0].date &&
      event.date < addMinutes(DatesBlocks.value[6].date, 24 * 60)
    );
  });
});

const eventBlocks = computed(() => {
  const blockHeight = height.value / 24; // 24 hours in a day
  const blockWidth = width.value / 7; // 7 days in a week

  return filteredEvents.value.map((event, index) => {
    const dayIndex = event.date.getDay() === 0 ? 6 : event.date.getDay() - 1; // Adjust for week starting on Monday
    const startHour = event.date.getHours() + event.date.getMinutes() / 60;
    const top = Math.floor(startHour * blockHeight);
    const left = Math.floor(dayIndex * blockWidth) + 4;
    const eventHeight = Math.floor((event.duration / 60) * blockHeight); // duration is in minutes

    // Check for overlapping events and adjust width and left position
    const overlappingEvents = filteredEvents.value.filter((e, i) => {
      if (i === index) return false;
      const eDayIndex = e.date.getDay() === 0 ? 6 : e.date.getDay() - 1;
      const eStartHour = e.date.getHours() + e.date.getMinutes() / 60;
      const eEndHour = eStartHour + e.duration / 60;
      const eventEndHour = startHour + event.duration / 60;
      return (
        eDayIndex === dayIndex &&
        ((eStartHour >= startHour && eStartHour < eventEndHour) ||
          (eEndHour > startHour && eEndHour <= eventEndHour) ||
          (eStartHour <= startHour && eEndHour >= eventEndHour))
      );
    });

    const overlapCount = overlappingEvents.length + 1; // including the event itself
    const width = Math.floor(blockWidth / overlapCount) - 16;
    const adjustedLeft = Math.floor(
      left +
        (width + 8) *
          overlappingEvents.filter((e) => e.date < event.date).length
    );

    return {
      ...event,
      style: {
        top: `${top}px`,
        left: `${adjustedLeft}px`,
        height: `${eventHeight}px`,
        width: `${width}px`, // Subtracting some padding
      },
    };
  });
});

watch(props.events, () => {
  // scroll to earliest event of the day
  const earliestEvent = props.events[0];

  if (earliestEvent) {
    y.value = (height.value / 24) * earliestEvent.date.getHours();
  }
});

onMounted(() => {
  // Scroll to the 7th hour (7 AM)
  y.value = (height.value / 24) * 7;
  console.log("y", y.value);
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "calendar_week": "Kalenderwoche {week}"
  },
  "en": {
    "calendar_week": "Calendar Week {week}"
  }
}
</i18n>
