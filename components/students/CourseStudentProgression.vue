<template>
  <UDashboardCard
    v-if="data && status === 'success'"
    class="mb-4"
    :title="t('course_activity_attendances')"
    :description="t('course_activity_attendances_description')"
  >
    <StudentsCourseStudentProgressionItem
      v-for="activity in data"
      :key="activity.id"
      :subscription-id="props.subscription.id"
      :activity-id="activity.id"
      :activity-name="activity.name"
      :activity-required="activity.required"
      :org-id="activity.organization_id"
    />
  </UDashboardCard>
  <UDashboardCard v-else-if="status === 'pending'" class="mb-4">
    <USkeleton class="h-4 w-1/3 mb-4" />
    <div class="space-y-2">
      <div class="flex items-center space-x-2">
        <USkeleton class="h-10 w-10 rounded-full" />
        <div class="flex-1">
          <USkeleton class="h-4 w-full mb-2" />
          <USkeleton class="h-4 w-1/2" />
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <USkeleton class="h-10 w-10 rounded-full" />
        <div class="flex-1">
          <USkeleton class="h-4 w-full mb-2" />
          <USkeleton class="h-4 w-1/2" />
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <USkeleton class="h-10 w-10 rounded-full" />
        <div class="flex-1">
          <USkeleton class="h-4 w-full mb-2" />
          <USkeleton class="h-4 w-1/2" />
        </div>
      </div>
    </div>
  </UDashboardCard>
  <div v-else class="text-center text-gray-500 dark:text-gray-400">
    <UAlert v-if="!error" :title="t('no_activities_found')" type="amber" :icon="'heroicons-outline:exclamation-circle'" />
    <UAlert v-if="error" :title="t('error_loading_activities')" type="red" :icon="'heroicons-outline:exclamation-circle'" />
  </div>
</template>

<script setup lang="ts">
import type { AppCourseSubscription } from "~/types/app.types";

type Props = {
  subscription: AppCourseSubscription;
};

const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const courseActivitiesStore = useCourseActivitiesStore();


const { data, error, status } = useAsyncData(async () => {
  return await courseActivitiesStore.getActivitiesForCourse(
    props.subscription.course_id
  );
});
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
