<template>
  <div
    :class="`absolute top-[${event.style.top}] left-[${event.style.left}] h-[${event.style.height}] w-[${event.style.width}] p-1 m-1 rounded ${classes} cursor-pointer`"
    :style="event.style"
    @click="onContextMenu"
  >
  <UBadge size="xs" :color="SCHEDULE_STATUS_COLORS[event.status]">{{ g(`schedules.status.${event.status}`) }}</UBadge>

    <p :class="`text-sm font-semibold text-gray-900`">{{ event.label }}</p>
    <p :class="`text-xs font-semibold text-gray-900`">
      {{ format(event.date, "HH:mm") }} -
      {{ format(addMinutes(event.date, event.duration), "HH:mm") }}
    </p>
    <UContextMenu v-model="isOpen" :virtual-element="virtualElement">
      <div class="p-4 w-80 space-y-4">
        <div class="flex justify-between items-center">
            <p class="font-semibold text-lg text-gray-900 dark:text-gray-200">
                {{ event.label }}
            </p>
            <UBadge size="xs" variant="soft">{{ g(`schedules.status.${event.status}`) }}</UBadge>
        </div>
        <div class="flex flex-col items-start">
            <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-calendar-days-solid" class="text-gray-500" />
                <p class="text-sm text-gray-700 dark:text-gray-300">
                    {{ format(event.date, "PPPP", { locale: currentLocale }) }}
                </p>
            </div>
            <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-clock-solid" class="text-gray-500" />
                <p class="text-sm text-gray-700 dark:text-gray-300">
                    {{ format(event.date, "HH:mm") }} - {{ format(addMinutes(event.date, event.duration), "HH:mm") }}
                </p>
            </div>
        </div>
        <div v-if="event.assigned_to" class="flex items-center space-x-2">
            <UAvatar size="sm" :icon="'i-heroicons-user'" />
            <p class="font-semibold text-gray-700 dark:text-gray-300">
                {{ event.assigned_to.firstname }} {{ event.assigned_to.lastname }}
            </p>
        </div>
        <div class="flex flex-col items-start">
            <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-user-group-solid" class="text-gray-500" />
                <p class="text-sm text-gray-700 dark:text-gray-300">
                    {{ event.activity_attendees_count }} {{ t('attendees') }}
                </p>
            </div>
        </div>
        <div class="flex">
            <UButton block size="xs" color="primary" variant="solid" @click="() => $emits('event-click', event.id)">
                {{ t('view_details') }}
            </UButton>
        </div>
    </div>
    </UContextMenu>
  </div>
</template>

<script setup lang="ts">
import type { AppCalendarEvent } from "../AppCalendar.vue";
import { format, addMinutes } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { useMouse, useWindowScroll } from "@vueuse/core";
import { SCHEDULE_STATUS_COLORS, type ActivityColor } from "~/constants";

export type AppCalendarEventBlock = AppCalendarEvent & {
  style: {
    top: string;
    left: string;
    height: string;
    width: string;
    color: string;
  };
};

const { t, locale } = useI18n({
  useScope: "local",
});

const { t:g } = useI18n({
  useScope: "global",
});

const currentLocale = computed(() => {
  return locale.value === "de" ? de : enUS;
});

const props = defineProps<{
  event: AppCalendarEventBlock;
}>();

const $emits = defineEmits<{
  (e: "event-click", id: string): void;
}>();
const { x, y } = useMouse();
const { y: windowY } = useWindowScroll();

const isOpen = ref(false);
const virtualElement = ref({ getBoundingClientRect: () => ({}) });

function onContextMenu() {
    if(isOpen.value) {
      isOpen.value = false;
      return;
    }
  const top = unref(y) - unref(windowY);
  const left = unref(x);

  virtualElement.value.getBoundingClientRect = () => ({
    width: 0,
    height: 0,
    top,
    left,
  });

  isOpen.value = true;
}

const classes = computed(() => {
  const colors: Record<ActivityColor, string> = {
    red: "bg-red-500 border-red-600 hover:bg-red-600",
    blue: "border-l-4 bg-blue-500 border-blue-900 hover:bg-blue-600",
    orange: "border-l-4 bg-orange-500 border-orange-900 hover:bg-orange-600",
    green: "border-l-4 bg-green-500 border-green-900 hover:bg-green-600",
  };

  const color = props.event.style.color as ActivityColor;
  return colors[color] || colors['blue'];
})
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "attendees": "Teilnehmer",
    "view_details": "Details ansehen"
  },
  "en": {
    "attendees": "Attendees",
    "view_details": "View Details"
  }
}</i18n>
