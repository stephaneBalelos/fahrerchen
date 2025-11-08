<template>
  <div class="p-4 w-80 space-y-4">
    <div class="flex justify-between items-center">
      <p class="font-semibold text-lg text-gray-900 dark:text-gray-200">
        {{ props.event.label }}
      </p>
      <UBadge size="xs" variant="soft">{{
        g(`schedules.status.${props.event.status}`)
      }}</UBadge>
    </div>
    <div class="flex flex-col items-start">
      <div class="flex items-center space-x-2">
        <UIcon name="i-heroicons-calendar-days-solid" class="text-gray-500" />
        <p class="text-sm text-gray-700 dark:text-gray-300">
          {{ format(props.event.date, "PPPP", { locale: currentLocale }) }}
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <UIcon name="i-heroicons-clock-solid" class="text-gray-500" />
        <p class="text-sm text-gray-700 dark:text-gray-300">
          {{ format(props.event.date, "HH:mm") }} -
          {{
            format(addMinutes(props.event.date, props.event.duration), "HH:mm")
          }}
        </p>
      </div>
    </div>
    <div v-if="props.event.assigned_to" class="flex items-center space-x-2">
      <UAvatar size="sm" :icon="'i-heroicons-user'" />
      <p class="font-semibold text-gray-700 dark:text-gray-300">
        {{ props.event.assigned_to.firstname }}
        {{ props.event.assigned_to.lastname }}
      </p>
    </div>
    <div class="flex flex-col items-start">
      <div class="flex items-center space-x-2">
        <UIcon name="i-heroicons-user-group-solid" class="text-gray-500" />
        <p class="text-sm text-gray-700 dark:text-gray-300">
          {{ props.event.activity_attendees_count }} {{ t("attendees") }}
        </p>
      </div>
    </div>
    <div class="flex">
      <UButton
        block
        size="xs"
        color="primary"
        variant="solid"
        @click="() => $emits('view-details', props.event.id)"
      >
        {{ t("view_details") }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppCalendarEvent } from "../AppCalendar.vue";
import { format, addMinutes } from "date-fns";
import { de, enUS } from "date-fns/locale";

type Props = {
  event: AppCalendarEvent;
};

const props = defineProps<Props>();
const { t } = useI18n({
  useScope: "local",
});
const { t: g, locale } = useI18n({
  useScope: "global",
});
const currentLocale = computed(() => {
  return locale.value === "de" ? de : enUS;
});

const $emits = defineEmits<{
  (e: "view-details", id: string): void;
}>();
</script>

<style scoped></style>

<i18n lang="json">
{
  "en": {
    "attendees": "attendees",
    "view_details": "View Details"
  },
  "de": {
    "attendees": "Teilnehmer",
    "view_details": "Details anzeigen"
  }
}
</i18n>
