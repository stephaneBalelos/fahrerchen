<template>
  <div
    :class="`absolute top-[${event.style.top}] left-[${event.style.left}] h-[${event.style.height}] w-[${event.style.width}] p-1 m-1 rounded ${classes} cursor-pointer`"
    :style="event.style"
    @click="
      ($event) => eventBlockActions.onClick && eventBlockActions.onClick($event, event)
    "
  >
    <UBadge size="xs" :color="SCHEDULE_STATUS_COLORS[event.status]">{{
      g(`schedules.status.${event.status}`)
    }}</UBadge>

    <p :class="`text-sm font-semibold text-gray-900`">{{ event.label }}</p>
    <p :class="`text-xs font-semibold text-gray-900`">
      {{ format(event.date, "HH:mm") }} -
      {{ format(addMinutes(event.date, event.duration), "HH:mm") }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { AppCalendarEvent } from "../AppCalendar.vue";
import { format, addMinutes } from "date-fns";
import { SCHEDULE_STATUS_COLORS, type ActivityColor } from "~/constants";
import { AppCalenderProviderKey } from "../AppCalendarProvider";

export type AppCalendarEventBlock = AppCalendarEvent & {
  style: {
    top: string;
    left: string;
    height: string;
    width: string;
    color: string;
  };
};

const eventBlockActions = inject(AppCalenderProviderKey, {});

const { t: g } = useI18n({
  useScope: "global",
});

const props = defineProps<{
  event: AppCalendarEventBlock;
}>();

const classes = computed(() => {
  const colors: Record<ActivityColor, string> = {
    rose: "border-l-4 bg-rose-500 border-rose-600 hover:bg-rose-600",
    blue: "border-l-4 bg-blue-500 border-blue-900 hover:bg-blue-600",
    orange: "border-l-4 bg-orange-500 border-orange-900 hover:bg-orange-600",
    green: "border-l-4 bg-green-500 border-green-900 hover:bg-green-600",
  };

  const color = props.event.style.color as ActivityColor;
  return colors[color] || colors["blue"];
});
</script>

<style scoped></style>

