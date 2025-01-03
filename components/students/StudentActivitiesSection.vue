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
        <div v-for="activity in activities" :key="activity.id">
          <div>{{ activity.id }}</div>
          <div>{{ activity.course_subscription_id }}</div>
          <div>{{ activity.course_activity_id }}</div>
          <div>{{ activity.status }}</div>
          <div>{{ activity.activity_schedule_id}}</div>
        </div>
      </div>
    </div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';

const props = defineProps<{
  subscription_id: string;
}>();

const client = useSupabaseClient<Database>();


const { data: activities, error, status } = useAsyncData(`student_${props.subscription_id}_activities`, async () => {
  const { data, error } = await client
    .from('course_activity_attendances')
    .select('*')
    .eq('course_subscription_id', props.subscription_id)
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