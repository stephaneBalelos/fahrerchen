<template>
  <UCard>
    <UDashboardSection
      :title="t('student_activities')"
      :description="t('all_activities_of_the_student')"
    >
      <template #links>
        <UButton
          variant="ghost"
          color="primary"
          @click="openAddScheduleForSubscription"
        >
          {{ t("add_activity_attendance") }}
        </UButton>
      </template>
      <div v-if="status === 'pending'">Loading...</div>
      <div v-else-if="status === 'error'">Error: {{ error }}</div>
      <div v-else-if="status === 'success' && schedules">
        <div v-if="schedules.length === 0">
          <UAlert :title="t('no_activities_found')" />
        </div>
        <div v-else>
          <StudentActivityItem
            v-for="(schedule, index) in schedules"
            :key="index"
            :activity-schedule="schedule"
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
    </UDashboardSection>
  </UCard>
</template>

<script setup lang="ts">
import StudentActivityItem from "~/components/students/StudentActivityItem.vue";
import AddScheduleForSubscriptionsForm from "~/components/forms/AddScheduleForSubscriptionsForm.vue";
import EditCourseActivitySchedule from "../forms/EditCourseActivitySchedule.vue";

const props = defineProps<{
  subscriptionId: string;
  orgId: string;
}>();

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
} = useAsyncData(`subscription_schedules_${props.subscriptionId}`, async () => {
  const { data, error } = await client
    .from("course_activity_schedules")
    .select("*")
    .contains("attendees", [props.subscriptionId])
    .eq("organization_id", props.orgId)
    .order("start_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data;
});

const openAddScheduleForSubscription = () => {
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
