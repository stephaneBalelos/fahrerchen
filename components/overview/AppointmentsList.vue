<template>
  <UDashboardCard
    v-if="userOrganizationsStore.selectedOrganization"
    :title="t('incoming_appointments')"
    :description="t('incoming_appointments_description')"
    icon="i-heroicons-calendar"
  >
    <template #links>
      <UButton
        color="gray"
        variant="solid"
        :to="`/my/${userOrganizationsStore.selectedOrganization.id}/schedules`"
      >
        {{ t("view_all") }}
      </UButton>
    </template>
    <div v-if="schedules && schedules.length > 0">
      <NuxtLink
        v-for="(schedule, index) in schedules"
        :key="index"
        class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
        @click="openScheduleModal(schedule.id)"
      >
        <div class="text-sm flex-1">
          <div class="flex items-center gap-3">
            <div class="flex flex-col flex-1">
              <p class="text-lg font-medium">
                {{ schedule.activity.name }}
              </p>
              <p class="text-gray-500 dark:text-gray-400">
                {{ schedule.activity.description }}
              </p>
              <p class="text-gray-500 dark:text-gray-400">
                {{ formatDate(schedule.start_at ?? "") }}
              </p>
            </div>
            <div class="flex flex-col">
              <p class="text-sm font-medium">
                {{ schedule.course_activity_schedules_attendees.length }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ t("attendees") }}
              </p>
            </div>
          </div>
        </div>
        <p class="text-gray-900 dark:text-white font-medium text-lg">
          <UBadge
            v-if="schedule.status == 'PLANNED'"
            color="primary"
            variant="soft"
            >{{
              g(
                `courses.activities.schedules.schedules_status_${schedule.status}`
              )
            }}</UBadge
          >
          <UBadge
            v-if="schedule.status == 'CANCELED'"
            color="red"
            variant="soft"
            >{{
              g(
                `courses.activities.schedules.schedules_status_${schedule.status}`
              )
            }}</UBadge
          >
          <UBadge
            v-if="schedule.status == 'COMPLETED'"
            color="green"
            variant="soft"
            >{{
              g(
                `courses.activities.schedules.schedules_status_${schedule.status}`
              )
            }}</UBadge
          >
        </p>
      </NuxtLink>
    </div>
    <div v-else class="min-h-96 flex flex-col items-center justify-center">
      <UIcon name="i-heroicons-circle-stack" class="w-5 h-5" />
      <p class="text-gray-500 dark:text-gray-400">
        {{ t("no_appointments") }}
      </p>
    </div>
  </UDashboardCard>
</template>

<script setup lang="ts">
import { formatDate } from "~/utils/formatters";
import EditCourseActivitySchedule from "../forms/EditCourseActivitySchedule.vue";

type Props = {
    orgId: string
}

const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const userOrganizationsStore = useUserOrganizationsStore();
const $courseActivitySchedules = useCourseActivitySchedules();
const slideover = useSlideover();

const { data: schedules } = useAsyncData(async () => {
  return await $courseActivitySchedules.fetchCourseActivitySchedules({
    organization_id: props.orgId,
    start_at: new Date(),
    limit: 10,
  });
});

async function openScheduleModal(scheduleId: string) {
  slideover.open(EditCourseActivitySchedule, {
    scheduleId: scheduleId,
  });
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "incoming_appointments": "Kommende Termine",
    "incoming_appointments_description": "Hier sind die nächsten Termine, die Sie haben.",
    "no_appointments": "Keine Termine",
    "view_all": "Alle anzeigen",
    "attendees": "Teilnehmer"
  },
  "en": {
    "incoming_appointments": "Incoming Appointments",
    "incoming_appointments_description": "Here are the next appointments you have.",
    "no_appointments": "No appointments",
    "view_all": "View all",
    "attendees": "Attendees"
  }
}
</i18n>
