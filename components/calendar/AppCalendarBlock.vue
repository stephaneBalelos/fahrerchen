<template>
  <div
    v-for="(event, index) in events"
    :key="event.id"
    class="absolute bg-primary-50 dark:bg-primary-400 dark:bg-opacity-10
    text-primary-500 dark:text-primary-400 rounded-lg
    ring-1 ring-inset ring-primary-500 dark:ring-primary-400 ring-opacity-25 dark:ring-opacity-25 
    shadow p-4 cursor-pointer"
    :style="{
      width: `calc(100% / ${events.length})`,
      left: `calc(100% / ${events.length} * ${index})`,
      top: `calc(6rem * ${event.start_hour} + 1rem)`,
      height: `calc(6rem * ${event.end_hour - event.start_hour})`,
    }"
  >
    <div class="calendar-event-label">
      <p class="text-lg font-semibold truncate">{{ event.label }}</p>
      <p class="text-sm">{{ getLocalizedDateTimeString(event.date) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLocalizedDateTimeString } from "~/utils/formatters";

type Props = {
  blockIndex: number;
  events: {
    id: string;
    label: string;
    date: Date;
    start_hour: number;
    end_hour: number;
  }[];
};

const { events } = defineProps<Props>();
</script>

<style scoped></style>
