<template>
  <UDashboardSection
    title="Student Activities"
    description="All activities of the student"
    class="px-4 mt-6"
  >
  <template #links>
    <UButton
      variant="ghost"
      color="primary"
      @click="openAddActivityAttendance"
    >
      Add Activity Attendance
    </UButton>
  </template>
    <div v-if="status === 'pending'">Loading...</div>
    <div v-else-if="status === 'error'">Error: {{ error }}</div>
    <div v-else-if="status === 'success' && activities">
      <div v-if="activities.length === 0">No activities found</div>
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
import type { Database } from '~/types/app.types';
import StudentActivityItem from '~/components/students/StudentActivityItem.vue';

const props = defineProps<{
  subscriptionId: string;
}>();

const client = useSupabaseClient<Database>();


const { data: activities, error, status } = useAsyncData(`student_${props.subscriptionId}_activities`, async () => {
  const { data, error } = await client
    .from('course_activity_attendances_view')
    .select('*')
    .eq('course_subscription_id', props.subscriptionId)
  if (error) {
    throw error;
  }
  return data;
});

const openAddActivityAttendance = () => {
  console.log('openAddActivityAttendance');
};


</script>

<style scoped>

</style>

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