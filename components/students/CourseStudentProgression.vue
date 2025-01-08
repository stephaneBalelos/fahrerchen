<template>
  <UDashboardCard
    v-if="data"
    class="mb-4"
    :title="t('course_activity_attendances')"
    :description="t('course_activity_attendances_description')"
  >
    <StudentsCourseStudentProgressionItem
      v-for="activity in data.course?.course_activities"
      :key="activity.id"
      :subscription-id="props.subscriptionId"
      :activity-id="activity.id"
      :activity-name="activity.name"
      :activity-required="activity.required"
      :org-id="data.organization_id"
    />
  </UDashboardCard>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";

type Props = {
  subscriptionId: string;
};

const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const supabase = useSupabaseClient<Database>();

const { data } = useAsyncData(
  `course_progression_${props.subscriptionId}`,
  async () => {
    const { data, error } = await supabase
      .from("course_subscriptions")
      .select("*, course:courses(id, course_activities(*))")
      .eq("id", props.subscriptionId)
      .single();

    if (error) {
      console.error(error);
      throw error;
    }
    return data;
  }
);
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "course_activity_attendances": "Aktivitätsbesuche",
    "course_activity_attendances_description": "Besuchte Aktivitäten"
  },
  "en": {
    "course_activity_attendances": "Course Activity Attendances",
    "course_activity_attendances_description": "Course Activity Attendances"
  }
}
</i18n>
