<template>
  <UDashboardCard v-if="subscriptionStore.subscription">
    <template #title>
      <div class="flex gap-4 items-center">
        <div
          class="relative flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md px-2 w-20 h-20"
        >
          <span
            class="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase"
          >
            {{ format(new Date(props.schedule.schedule_start_at), "EEEE") }}
          </span>
          <span class="day text-gray-900 dark:text-white font-bold">
            {{ format(new Date(props.schedule.schedule_start_at), "dd") }}
          </span>
          <span class="month">{{
            format(new Date(props.schedule.schedule_start_at), "MMM")
          }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex gap-2">
            <UBadge
              v-if="props.schedule.schedule_status === 'PLANNED'"
              color="primary"
              variant="soft"
              >{{
                g(
                  `courses.activities.schedules.schedules_status_${props.schedule.schedule_status}`
                )
              }}</UBadge
            >
            <UBadge
              v-else-if="props.schedule.schedule_status === 'CANCELED'"
              color="red"
              variant="soft"
              >{{
                g(
                  `courses.activities.schedules.schedules_status_${props.schedule.schedule_status}`
                )
              }}</UBadge
            >
            <UBadge
              v-else-if="props.schedule.schedule_status === 'COMPLETED'"
              color="green"
              variant="soft"
              >{{
                g(
                  `courses.activities.schedules.schedules_status_${props.schedule.schedule_status}`
                )
              }}</UBadge
            >
            <span
              :class="`text-sm ${
                isFuture(new Date(props.schedule.schedule_start_at))
                  ? 'text-primary-400'
                  : 'text-gray-400'
              }`"
              >{{
                getLocalizedDateTimeString(
                  new Date(props.schedule.schedule_start_at)
                )
              }}</span
            >
          </div>
          <h3 class="text-2xl font-semibold">
            {{ props.schedule.course_name }} | {{ props.schedule.activity_name }}
          </h3>
        </div>
      </div>
    </template>
    <template #links>
      <UButton v-if="canAttendSchedule" size="sm" color="gray" variant="solid" @click="attendSchedule">
        {{ t("attend_schedule") }}
      </UButton>
    </template>
    <div class="flex justify-between">
      <div class="flex flex-col gap-2">
        <p class="text-sm text-gray-500">{{ t("assigned_to") }}</p>
        <div v-if="props.schedule.schedule_assigned_to" class="flex gap-2">
          <UAvatar
            :alt="`${props.schedule.assigned_to_firstname} ${props.schedule.assigned_to_lastname}`"
            size="sm"
          />
          <div class="flex flex-col">
            <p class="text-sm font-semibold">
              {{ props.schedule.assigned_to_firstname }}
              {{ props.schedule.assigned_to_lastname }}
            </p>
            <p class="text-sm text-gray-500">
              {{ props.schedule.assigned_to_email }}
            </p>
          </div>
        </div>
        <div v-else>
          {{ t("not_assigned") }}
        </div>
      </div>
    </div>
  </UDashboardCard>
</template>

<script setup lang="ts">
import type { AppOrganizationSchedulesView } from "~/types/app.types";
import { getLocalizedDateTimeString } from "~/utils/formatters";
import { isFuture, format } from "date-fns";


type ScheduleItemProps = {
  schedule: AppOrganizationSchedulesView;
};

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const subscriptionStore = useSubscriptionStore();

// const $emits = defineEmits(["update"]);

const props = defineProps<ScheduleItemProps>();
// const modal = useModal();

const canAttendSchedule = computed(() => {
  if (!subscriptionStore.subscription) {
    return false;
  }
  const isPlanned = props.schedule.schedule_status === 'PLANNED'
  const inTheFuture = isFuture(new Date(props.schedule.schedule_start_at));
  const isAttending = props.schedule.schedule_attendees.includes(subscriptionStore.subscription.id);
  return isPlanned && inTheFuture && !isAttending;
})

async function attendSchedule() {
  console.log("attendSchedule", props.schedule);
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "attend_schedule": "Teilnehmen",
    "assigned_to": "Zugewiesen an",
    "not_assigned": "Nicht zugewiesen"
  },
  "en": {
    "attend_schedule": "Attend",
    "assigned_to": "Assigned to",
    "not_assigned": "Not assigned"
  }
}
</i18n>
