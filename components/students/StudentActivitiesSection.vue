<template>
  <UDashboardSection
    :title="t('student_activities')"
    :description="t('all_activities_of_the_student')"
    class="px-4 mt-6"
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
    <div v-else-if="status === 'success' && activities">
      <div v-if="activities.length === 0">
        <UAlert :title="t('no_activities_found')" />
      </div>
      <div v-else>
        <StudentActivityItem
          v-for="(activity, index) in activities"
          :key="index"
          :attendance="activity"
        />
      </div>
    </div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import StudentActivityItem from "~/components/students/StudentActivityItem.vue";
import AddScheduleForSubscriptionsForm from "~/components/forms/AddScheduleForSubscriptionsForm.vue";

const props = defineProps<{
  subscriptionId: string;
  orgId: string;
}>();

const client = useSupabaseClient<Database>();
const slideover = useSlideover();

const { t } = useI18n({
  useScope: "local",
});

const {
  data: activities,
  error,
  status,
  refresh
} = useAsyncData(`student_${props.subscriptionId}_activities`, async () => {
  const { data, error } = await client
    .from("course_activity_attendances_view")
    .select("*")
    .eq("course_subscription_id", props.subscriptionId).order("activity_start_at", { ascending: false });
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
