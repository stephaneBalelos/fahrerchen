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
    <div v-if="scheduleRequest?.user" class="flex items-center space-x-2">
      <UAvatar size="sm" :icon="'i-heroicons-user'" />
      <p class="font-semibold text-gray-700 dark:text-gray-300">
        {{ scheduleRequest.user.firstname }}
        {{ scheduleRequest.user.lastname }}
      </p>
    </div>
    <div v-if="scheduleRequest?.subscription" class="flex items-center space-x-2">
      <UAvatar size="sm" :icon="'i-heroicons-user'" />
      <p class="font-semibold text-gray-700 dark:text-gray-300">
        {{ scheduleRequest.subscription.student.firstname }}
        {{ scheduleRequest.subscription.student.lastname }}
      </p>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <UButton
        block
        size="xs"
        color="primary"
        variant="solid"
        @click="() => $emits('accept-request', props.event.id)"
      >
        {{ t("accept_request") }}
      </UButton>
      <UButton
        block
        size="xs"
        color="red"
        variant="soft"
        @click="() => $emits('reject-request', props.event.id)"
      >
        {{ t("reject_request") }}
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
  (e: "accept-request" | "reject-request" | "delete-request" | "edit-request", id: string): void;
}>();

const { getCourseActivitySchedulesRequestById } = useCourseActivitySchedules();

const { data: scheduleRequest } = useAsyncData(
  `schedule-request-${props.event.id}`,
  async () => {
    return await getCourseActivitySchedulesRequestById(props.event.id);
  },
  { immediate: true }
);
</script>

<style scoped></style>

<i18n lang="json">
{
  "en": {
    "accept_request": "Accept Request",
    "reject_request": "Reject Request"
  },
  "de": {
    "accept_request": "Anfrage annehmen",
    "reject_request": "Anfrage ablehnen"
  }
}
</i18n>
