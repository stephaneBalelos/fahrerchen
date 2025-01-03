<template>
  <UDashboardCard
  v-if="data"
    class="mb-4"
    :title="t('course_activity_attendances')"
    :description="t('course_activity_attendances_description')"
  >
    <div
      v-for="activity in data.course?.course_activities"
      :key="activity.id"
      class="flex flex-col mb-4"
    >
      <p class="font-bold">{{ activity.name }}</p>
      <UProgress
        v-if="activity.required > 0"
        :value="activity.attendances[0].count"
        :max="activity.required"
        color="primary"
        indicator
      >
        <template #indicator>
          <span :color="`primary`">
            {{ activity.attendances[0].count }} /
            {{ activity.required }}
          </span>
        </template>
      </UProgress>
      <div v-else>{{ activity.attendances[0].count }}</div>
    </div>
  </UDashboardCard>
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';


type Props = {
  subscriptionId: string;
};

const props = defineProps<Props>();

const { t } = useI18n({
  useScope: 'local',
});

const supabase = useSupabaseClient<Database>();

const { data } = useAsyncData(
  `course_progression_${props.subscriptionId}`,
  async () => {
    const { data, error } = await supabase
      .from("course_subscriptions")
      .select(
        "*, course:courses(id, course_required_documents(*), course_activities(*, attendances:course_activity_attendances(count)))"
      )
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
