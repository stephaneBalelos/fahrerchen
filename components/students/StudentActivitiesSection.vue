<template>
  <div class="absolute inset-0 overflow-y-auto">
    <div v-if="status === 'pending'">Loading...</div>
    <div v-else-if="status === 'error'">Error: {{ error }}</div>
    <div v-else-if="status === 'success' && schedules">
      <div v-if="schedules.length === 0">
        <UAlert :title="t('no_activities_found')" />
      </div>
      <div v-else class="relative">
        <StudentActivityItem
          v-for="(schedule, index) in schedules"
          :key="index"
          :subscription-id="props.subscriptionId"
          :activity-schedule="schedule"
          :is-new-month="
            isNewMonth(
              schedule.start_at,
              index > 0 ? schedules[index - 1].start_at : null
            )
          "
          @open-edit-schedule="
            () =>
              openEditSchedule(
                schedule.id,
                schedule.activity_id,
                schedule.course_id
              )
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StudentActivityItem from "~/components/students/StudentActivityItem.vue";
import AddScheduleForSubscriptionsForm from "~/components/forms/AddScheduleForSubscriptionsForm.vue";
import EditCourseActivitySchedule from "../forms/EditCourseActivitySchedule.vue";
import type { Database } from "~/types/app.types";

const props = withDefaults(
  defineProps<{
    subscriptionId: string;
    orgId: string;
    filters?: {
      activityId?: string;
      activityStatus?: Database["public"]["Enums"]["schedule_status"];
    };
  }>(),
  {
    filters: () => ({}),
  }
);

const client = useSupabaseClient();
const slideover = useSlideover();

const { t } = useI18n({
  useScope: "local",
});

const {
  data: schedules,
  error,
  status,
  refresh,
} = useAsyncData(async () => {
  const q = client
    .from("course_activity_schedules")
    .select("*")
    .contains("attendees", [props.subscriptionId])
    .eq("organization_id", props.orgId);

  if (props.filters?.activityId) {
    q.eq("activity_id", props.filters.activityId);
  }
  if (props.filters?.activityStatus) {
    q.eq("status", props.filters.activityStatus);
  }

  const { data, error } = await q.order("start_at", { ascending: false });

  if (error) {
    throw error;
  }
  return data;
}, {
  watch: [props.filters],
});

const _openAddScheduleForSubscription = () => {
  slideover.open(AddScheduleForSubscriptionsForm, {
    subscriptionId: props.subscriptionId,
    orgId: props.orgId,
    onClose: () => {
      slideover.close();
    },
    onCreated: () => {
      slideover.close();
      refresh();
    },
  });
};

const openEditSchedule = (
  schedule_id: string,
  activity_id: string,
  course_id: string
) => {
  slideover.open(EditCourseActivitySchedule, {
    orgid: props.orgId,
    activityid: activity_id,
    scheduleId: schedule_id,
    courseid: course_id,
    "onActivity-saved": () => {
      refresh();
    },
    "onActivity-deleted": () => {
      refresh();
    },
  });
};

const isNewMonth = (date: string, prevDate: string | null) => {
  if (!prevDate) return true; // If there's no previous date, treat it as a new month
  const currentDate = new Date(date);
  const previousDate = new Date(prevDate);
  return (
    currentDate.getMonth() !== previousDate.getMonth() ||
    currentDate.getFullYear() !== previousDate.getFullYear()
  );
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "student_activities": "Schüleraktivitäten",
    "all_activities_of_the_student": "Alle Aktivitäten des Schülers",
    "add_activity_attendance": "Teilnahme an Aktivität hinzufügen",
    "no_activities_found": "Keine Aktivitäten gefunden"
  },
  "en": {
    "student_activities": "Student Activities",
    "all_activities_of_the_student": "All activities of the student",
    "add_activity_attendance": "Add Activity Attendance",
    "no_activities_found": "No activities found"
  }
}
</i18n>
