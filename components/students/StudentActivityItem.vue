<template>
  <div
    v-if="courseActivity"
    class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
    @click="() => $emits('open-edit-schedule')"
  >
    <div class="text-sm flex-1">
      <div>
        <p class="text-gray-900 dark:text-white font-medium">
          {{ courseActivity.name }}
        </p>
        <p
          v-if="props.activitySchedule.start_at"
          class="text-gray-500 dark:text-gray-400 text-sm"
        >
          {{ t("planned_for") }}
          {{ formatDate(props.activitySchedule.start_at) }}
        </p>
      </div>
    </div>
    <p class="text-gray-900 dark:text-white font-medium text-lg flex gap-2">
      <UBadge
        v-if="
          props.activitySchedule.status == 'COMPLETED'
        "
        color="green"
        variant="soft"
        :label="t('completed')"
      />
      <UBadge
        v-if="props.activitySchedule.status == 'PLANNED'"
        color="primary"
        variant="soft"
        :label="t('planned')"
      />
      <UBadge
        v-if="props.activitySchedule.status == 'CANCELED'"
        color="red"
        variant="soft"
        :label="t('canceled')"
      />
      <UBadge
        v-if="scheduleAttendance"
        color="green"
        variant="soft"
        :label="t('attendance_confirmed')"
      />
    </p>
  </div>
</template>

<script setup lang="ts">
import type { AppCourseActivitySchedule } from "~/types/app.types";
import { formatDate } from "~/utils/formatters";

type Props = {
  subscriptionId: string;
  activitySchedule: AppCourseActivitySchedule;
};

const $emits = defineEmits(["open-edit-schedule"]);

const props = defineProps<Props>();
const { t } = useI18n({
  useScope: "local",
});
const client = useSupabaseClient();

const courseActivity = await useCourseActivities(
  props.activitySchedule.organization_id,
  props.activitySchedule.course_id,
  props.activitySchedule.activity_id
);

const { data: scheduleAttendance } = useAsyncData(
  `course_activity_schedule_attendance_${props.activitySchedule.id}_${props.subscriptionId}`,
  async () => {
    const { data, error } = await client
      .from("course_activity_schedules_attendances")
      .select("*")
      .eq("course_activity_schedule_id", props.activitySchedule.id)
      .eq("course_subscription_id", props.subscriptionId)
      

    if (error) {
      console.error(error);
    }

    return data ? data[0] : null;
  }
);
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "planned": "Geplant",
    "completed": "Abgeschlossen",
    "attended": "Teilgenommen",
    "attendance_confirmed": "Teilnahme bestätigt",
    "registered": "Registriert",
    "canceled": "Abgesagt",
    "planned_for": "Geplant für"
  },
  "en": {
    "planned": "Planned",
    "completed": "Completed",
    "attended": "Attended",
    "attendance_confirmed": "Attendance confirmed",
    "registered": "Registered",
    "canceled": "Canceled",
    "planned_for": "Planned for"
  }
}
</i18n>
