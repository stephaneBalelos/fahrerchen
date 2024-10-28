<template>
  <UDashboardPanelContent>
    <div class="grid lg:grid-cols-2 gap-4">
      <UDashboardCard
        v-for="course_activity in course_activities"
        :title="course_activity.name"
        :description="course_activity.description"
        :links="[
          {
            label: 'Plan a new schedule',
            icon: 'i-heroicons-plus-20-solid',
            click: () => openAddCourseScheduleForm(course_activity.id),
          },
        ]"
      >
        <NuxtLink
          v-if="
            course_activity.course_activity_schedules &&
            course_activity.course_activity_schedules.length > 0
          "
          @click="openAddCourseScheduleForm(course_activity.id, s.id)"
          v-for="(s, index) in course_activity.course_activity_schedules"
          :key="index"
          class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
        >
          <UAvatar :alt="'AM'" size="md" />
          <div class="text-sm flex-1">
            <div>
              <p class="text-gray-900 dark:text-white font-medium">
                {{ s.assigned_to ? s.assigned_to : 'No assigned' }}
              </p>
              <p class="text-gray-500 dark:text-gray-400">
                {{ new Date(s.start_at).toLocaleDateString("de") }}
              </p>
            </div>
          </div>
          <p class="text-gray-900 dark:text-white font-medium text-lg"></p>
        </NuxtLink>
        <div v-else>
          <UAlert
            :title="`No schedules for ${course_activity.name}`"
            :description="`Add a schedule new schedule and register students  `"
          />
        </div>
      </UDashboardCard>
    </div>
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

const { data: course_activities, error, refresh } = useAsyncData(
  "course_activity_schedules",
  async () => {
    const { data, error } = await client
      .from("course_activities")
      .select("id, name, description, course_activity_schedules(*)")
      .eq("course_id", props.courseid)
      .order('start_at', { ascending: false, referencedTable: 'course_activity_schedules' })
      .limit(5, {referencedTable: 'course_activity_schedules'});
    if (error) {
      throw error;
    }
    return data;
  }
);

function openAddCourseScheduleForm(
  course_activity_id: string,
  activity_schedule_id?: string,
  date?: Date
) {
  slideover.open(EditCourseActivitySchedule, {
    orgid: props.orgid,
    courseid: props.courseid,
    activityid: course_activity_id,
    activity_schedule_id: activity_schedule_id,
    date: date,

    "onActivity-saved": async () => {
      await refresh();
      slideover.close();
    },
  });
}
</script>

<style scoped></style>
