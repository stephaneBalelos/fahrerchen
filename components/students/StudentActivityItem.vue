<template>
  <UDashboardToolbar
    v-if="props.isNewMonth"
    class="sticky top-0 z-10 bg-white dark:bg-gray-900"
  >
    <span class="text-gray-900 dark:text-white font-bold text-lg">
      {{ format(new Date(props.activitySchedule.start_at), "MMMM yyyy") }}
    </span>
  </UDashboardToolbar>
  <div
    v-if="courseActivity"
    class="py-2 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center gap-3 relative"
  >
    <div
      class="relative flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md px-2 w-20 h-20"
    >
      <span
        class="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase"
      >
        {{ format(new Date(props.activitySchedule.start_at), "EEEE") }}
      </span>
      <span class="day text-gray-900 dark:text-white font-bold">
        {{ format(new Date(props.activitySchedule.start_at), "dd") }}
      </span>
      <span class="month">{{
        format(new Date(props.activitySchedule.start_at), "MMM")
      }}</span>
    </div>
    <div class="text-sm flex-1">
      <div class="flex flex-col items-start gap-2">
        <UBadge
          v-if="props.activitySchedule.status == 'COMPLETED'"
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
        <p class="text-gray-900 dark:text-white font-medium">
          {{ courseActivity.name }}
        </p>
        <p
          v-if="props.activitySchedule.start_at"
          class="text-gray-500 dark:text-gray-400 text-sm"
        >
          {{ courseActivity.description }}
        </p>
      </div>
    </div>
    <p class="text-gray-900 dark:text-white font-medium text-lg flex gap-2">
      <UButton
        v-if="scheduleAttendance"
        color="white"
        :label="t('attendance_confirmation')"
        @click.stop="openAttendanceConfirmation"
      />
      <UButton
        v-if="permissions.hasPermission('course_activity_schedules.update')"
        color="white"
        :label="t('view_schedule')"
        :to="userOrganizationsStore.relativePath(`/schedules?id=${props.activitySchedule.id}`)"
      />
    </p>
  </div>
</template>

<script setup lang="ts">
import type { AppCourseActivitySchedule } from "~/types/app.types";
import AttendanceConfirmationSlideover from "./AttendanceConfirmationSlideover.vue";
import { format } from "date-fns";

type Props = {
  subscriptionId: string;
  activitySchedule: AppCourseActivitySchedule;
  isNewMonth?: boolean;
};

const props = defineProps<Props>();
const { t } = useI18n({
  useScope: "local",
});
const client = useSupabaseClient();
const slideover = useSlideover();
const permissions = useUserPermissionsStore();
const userOrganizationsStore = useUserOrganizationsStore();

const courseActivitiesStore = useCourseActivitiesStore();
const courseActivity = computed(() => {
  return courseActivitiesStore.courseActivities.find(
    (a) => a.id === props.activitySchedule.activity_id
  );
});

const { data: scheduleAttendance } = useAsyncData(
  `schedule-attendance-${props.subscriptionId}-${props.activitySchedule.id}`,
  async () => {
    const { data, error } = await client
      .from("course_activity_schedules_attendances")
      .select("*, subscription:course_subscriptions(*, student:students(*))")
      .eq("course_activity_schedule_id", props.activitySchedule.id)
      .eq("course_subscription_id", props.subscriptionId)
      .eq("organization_id", props.activitySchedule.organization_id);

    if (error) {
      console.error(error);
    }

    return data ? data[0] : null;
  }
);

function openAttendanceConfirmation() {
  if (!scheduleAttendance.value) {
    return;
  }
  slideover.open(AttendanceConfirmationSlideover, {
    attendanceId: scheduleAttendance.value.id,
    onDelete: () => {
      slideover.close();
      console.log("Attendance deleted");
    },
  });
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "planned": "Geplant",
    "completed": "Abgeschlossen",
    "attended": "Teilgenommen",
    "attendance_confirmed": "Teilnahme bestätigt",
    "attendance_confirmation": "Teilnahmebestätigung",
    "view_schedule": "Termin ansehen",
    "registered": "Registriert",
    "canceled": "Abgesagt",
    "planned_for": "Geplant für"
  },
  "en": {
    "planned": "Planned",
    "completed": "Completed",
    "attended": "Attended",
    "attendance_confirmed": "Attendance confirmed",
    "attendance_confirmation": "Attendance confirmation",
    "view_schedule": "View Schedule",
    "registered": "Registered",
    "canceled": "Canceled",
    "planned_for": "Planned for"
  }
}
</i18n>
