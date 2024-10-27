<template>
  <UDashboardSection
    title="Student Activities"
    description="All activities of the student"
    orientation="vertical"
    class="px-4 mt-6"
  >
  
  </UDashboardSection>
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';

const props = defineProps<{
  student_id: string;
}>();

const client = useSupabaseClient<Database>();

const { data: student, error, status } = useAsyncData(`student_${props.student_id}_activities`, async () => {
  const { data, error } = await client
    .from('course_activity_attendances')
    .select('*')
    .eq('id', props.student_id)
    .single();
  if (error) {
    throw error;
  }
  return data;
});

</script>

<style scoped>

</style>