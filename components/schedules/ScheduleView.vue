<template>
  <div>
    <UPageHeader
      v-if="activity"
      :headline="g(`activities.types.${activity.activity_type}.name`)"
      :title="activity.name"
      :description="activity.description"
      :ui="{
        wrapper: 'pt-0',
      }"
    >
      <template #links>
        <UPopover v-if="schedule" class="col-span-2" :popper="{ placement: 'bottom-start' }">
          <div class="w-full">
            <UButton
              block
              color="white"
              variant="ghost"
              size="xl"
              icon="i-heroicons-calendar-days-20-solid"
              :label="format(new Date(schedule.start_at), 'd MMM, yyy')"
            />
          </div>
          <template #panel="">
            <Datepicker
              v-model="schedule.start_at"
              is-required
              :mode="'dateTime'"
              @update:model-value="onUpdateStartDate"
            />
          </template>
        </UPopover>
      </template>
      <ScheduleAllowedCourses
        :activity-id="activity.id"
        class="col-span-2 mt-2"
      />
    </UPageHeader>

  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import Datepicker from "../forms/Inputs/Datepicker.vue";
import ScheduleAllowedCourses from "./ScheduleAllowedCourses.vue";

type Props = {
  scheduleId: string;
};

const props = defineProps<Props>();

const { t: g } = useI18n({
  useScope: "global",
});

const courseActivitySchedules = useCourseActivitySchedules();
const { data: schedule, refresh } = useAsyncData(
  `course-activity-schedule-${props.scheduleId}`,
  async () => await courseActivitySchedules.fetchCourseActivitySchedulesById(props.scheduleId),
  {
    transform: (data) => {
      if (!data) {
        return null;
      }
            return {
                ...data,
                start_at: new Date(data.start_at),
                end_at: new Date(data.end_at),
            }
        }
    }
);

const courseActivitiesStore = useCourseActivitiesStore();
const activity = computed(() => {
  if (schedule.value?.activity_id) {
    return courseActivitiesStore.courseActivities.find(
      (a) => a.id === schedule.value?.activity_id
    );
  }
  return null;
});

const onUpdateStartDate = async (date: Date) => {
  if (!schedule.value) return;
  schedule.value.start_at = date
  await courseActivitySchedules.updateCourseActivitySchedule(
    schedule.value.id,
    {
      start_at: schedule.value.start_at.toISOString(),
    }
  );
  refresh();
};
</script>

<style scoped></style>
