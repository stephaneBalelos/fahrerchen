<template>
  <UDashboardPanelContent>
    <UDashboardCard
    v-for="course_activity in course_activities"
    :title="course_activity.name"
    description="You made 128 sales this month."
    icon="i-heroicons-chart-bar-20-solid"
    :links="[
      { label: 'Add', icon: 'i-heroicons-plus-20-solid', click: () => openAddCourseScheduleForm(course_activity.id)},
    ]"
  >
    <NuxtLink
      v-for="(s, index) in course_activity.course_activity_schedules"
      :key="index"
      class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
      
    >
      <UAvatar
        :alt="'AM'"
        size="md"
      />

      <div class="text-sm flex-1">
        <div>
          <p class="text-gray-900 dark:text-white font-medium">
            {{ s.activity_id }}
          </p>
          <p class="text-gray-500 dark:text-gray-400">
            {{ new Date(s.start_at).toLocaleDateString('de') }}
          </p>
        </div>
      </div>

      <p class="text-gray-900 dark:text-white font-medium text-lg">
        
      </p>
    </NuxtLink>
  </UDashboardCard>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import EditCourseActivitySchedule from "~/components/forms/EditCourseActivitySchedule.vue";
import type { Database } from "~/types/database.types";

type Props = {
  orgid: string;
  courseid: string;
};
definePageMeta({
  layout: "orgs",
});

const props = useAttrs() as Props;
const client = useSupabaseClient<Database>();
const { locale } = useI18n();
const toast = useToast();

const slideover = useSlideover();

const { data: course_activities, error } = useAsyncData('course_activity_schedules', async () => {
  const { data, error } = await client.from('course_activities').select('id, name, course_activity_schedules(*)').eq('course_id', props.courseid);
  if (error) {
    throw error;
  }
  console.log(data)
  return data;
})





function openAddCourseScheduleForm(course_activity_id: string, activity_schedule_id?: string, date?: Date,) {
  slideover.open(EditCourseActivitySchedule, {
    orgid: props.orgid,
    courseid: props.courseid,
    activityid: course_activity_id,
    activity_schedule_id: activity_schedule_id,
    date: date,

  })
}

</script>

<style scoped></style>
