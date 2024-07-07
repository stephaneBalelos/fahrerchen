<template>
  <UTable :rows="hours" :columns="days" :ui="tableConfig.ui">
    <template #empty-state>

    </template>
  </UTable>
</template>

<script setup lang="ts">
import { addDays, format, setHours, setMinutes, subDays } from "date-fns";

type Hour = {
  id: number;
  label: string;
};

type Day = {
  label: string;
  key: string;
};

const props = defineProps<{
  selectedDate: Date;
}>();

const days = ref<Day[]>([]);

const hours = ref<Hour[]>([]);

watch(() => props.selectedDate, load, { immediate: true });

function load() {
    days.value = []
    hours.value = []
  for (let i = 0; i < 24; i++) {
    hours.value.push({
      id: i,
      label: format(setMinutes(setHours(props.selectedDate, i), 0), "HH:mm"),
    });
  }
  days.value = Array.from({ length: 8 }, (_, i) => {
    if (i == 0) {
      return { label: "hour", key: "label" };
    }
    const date = subDays(props.selectedDate, props.selectedDate.getDay() - i);
    const key = format(date, "yyyy-MM-dd");
    const label = format(date, "EEEE dd.");

    return {label: label, key};
  });

}

const tableConfig = {
  ui: {
    wrapper: "overflow-x-auto",
    base: "min-w-full table-fixed",
    divide: "divide-y divide-gray-200 dark:divide-gray-800",
    thead: "sticky top-0",
    tbody: "divide-y divide-gray-200 dark:divide-gray-800",
    caption: "sr-only",
    tr: {
      base: "divide-x divide-gray-200 dark:divide-gray-800",
      selected: "bg-gray-50 dark:bg-gray-800/50",
      active: "hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer",
    },
    th: {
      base: "text-left rtl:text-right",
      padding: "px-4 py-3.5",
      color: "text-gray-900 dark:text-white",
      font: "font-semibold",
      size: "text-sm",
    },
    td: {
      base: "whitespace-nowrap",
      padding: "px-4 py-4",
      color: "text-gray-500 dark:text-gray-400",
      font: "",
      size: "text-sm",
    },
    checkbox: {
      padding: "ps-4",
    },
    loadingState: {
      wrapper:
        "flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14",
      label: "text-sm text-center text-gray-900 dark:text-white",
      icon: "w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-4 animate-spin",
    },
    emptyState: {
      wrapper:
        "flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14",
      label: "text-sm text-center text-gray-900 dark:text-white",
      icon: "w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-4",
    },
    progress: {
      wrapper: "absolute inset-x-0 -bottom-[0.5px] p-0",
    },
    default: {
      sortAscIcon: "i-heroicons-bars-arrow-up-20-solid",
      sortDescIcon: "i-heroicons-bars-arrow-down-20-solid",
      sortButton: {
        icon: "i-heroicons-arrows-up-down-20-solid",
        trailing: true,
        square: true,
        color: "gray",
        variant: "ghost",
        class: "-m-1.5",
      },
      checkbox: {
        color: "primary",
      },
      progress: {
        color: "primary",
        animation: "carousel",
      },
      loadingState: {
        icon: "i-heroicons-arrow-path-20-solid",
        label: "Loading...",
      },
      emptyState: {
        icon: "i-heroicons-circle-stack-20-solid",
        label: "No items.",
      },
    },
  },
};
</script>

<style scoped></style>
