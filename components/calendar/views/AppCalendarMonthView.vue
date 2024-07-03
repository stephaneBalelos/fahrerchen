<template>
  <div class="grid grid-rows-5 grid-cols-7 h-full">
    <UCard v-for="(day, index) in days" :ui="uiCardConfig">
      <template #header>
        <div class="flex items-center gap-2">
          <UBadge
            color="primary"
            :variant="day.isToday ? 'solid' : 'soft'"
            :ui="{ rounded: 'rounded-full' }"
            >{{ day.date.getDate() }}</UBadge
          >
          {{
            day.date.toLocaleDateString("de", {
              weekday: "short",
            })
          }}
        </div>
      </template>
      next: {{ day.isNextMonth }} <br />
      prev: {{ day.isPrevMonth }} <br />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import {
  addDays,
  endOfMonth,
  getDay,
  getMonth,
  getYear,
  isToday,
  startOfMonth,
  subDays,
} from "date-fns";
import type { date } from "zod";

const uiCardConfig = {
  base: "h-full",
  background: "bg-white dark:bg-gray-900",
  divide: "",
  ring: "ring-1 ring-gray-200 dark:ring-gray-800",
  rounded: "rounded-none",
  shadow: "shadow",
  body: {
    base: "",
    background: "",
    padding: "px-4 py-2 sm:p-4 sm:py-2",
  },
  header: {
    base: "",
    background: "",
    padding: "px-4 py-2 sm:px-4",
  },
  footer: {
    base: "",
    background: "",
    padding: "px-0 py-4 sm:px-6",
  },
};

type Day = {
  date: Date;
  idx: number;
  isToday?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isPrevMonth?: boolean;
  isNextMonth?: boolean;
};
const props = defineProps<{
  selectedDate: Date;
}>();
const month = ref(getMonth(props.selectedDate));
const year = ref(getYear(props.selectedDate));
const start = ref(startOfMonth(props.selectedDate));
const end = ref(endOfMonth(props.selectedDate));
const startDay = ref(0);

const days = ref<Day[]>([]);

const rows = 5;
const cols = 7;

onMounted(() => {
  load();
});

watch(
  () => props.selectedDate,
  () => {
    console.log("selectedDate changed");
    load();
  }
);

function load() {
  month.value = getMonth(props.selectedDate);
  year.value = getYear(props.selectedDate);
  start.value = startOfMonth(props.selectedDate);
  end.value = endOfMonth(props.selectedDate);
  startDay.value = getDay(start.value) == 0 ? 6 : getDay(start.value) - 1;
  days.value = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const index = j + i * cols;
      const day: Day = getDayAtIndex(index);
      days.value.push(day);
    }
  }
}

function getDayAtIndex(index: number): Day {
  let date;
  let isPrevMonth = false;
  let isNextMonth = false;

  if (index < startDay.value) {
    const prevMonth = subDays(start.value, startDay.value - index);
    console.log(
      index,
      start.value.toLocaleDateString("de"),
      prevMonth.toLocaleDateString("de")
    );
    date = prevMonth;
    isPrevMonth = true;
  }
  date = addDays(start.value, index - startDay.value);
  if (date > end.value) {
    isNextMonth = true;
  }
  return {
    date: date,
    idx: index,
    isToday: isToday(date),
    isSelected: date === props.selectedDate,
    isPrevMonth: isPrevMonth,
    isNextMonth: isNextMonth,
  };
}
</script>

<style scoped></style>
