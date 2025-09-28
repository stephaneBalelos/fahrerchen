<template>
  <div>
    <UPageHeader
      v-if="activity && schedule"
      :headline="g(`activities.types.${activity.activity_type}.name`)"
      :title="activity.name"
      :description="activity.description"
      :ui="{
        wrapper: 'pt-0',
      }"
    >
      <template #links>
        <UPopover
          v-if="schedule"
          class="col-span-2"
          :popper="{ placement: 'bottom-start' }"
        >
          <UButton
            block
            color="white"
            variant="solid"
            size="xl"
            :label="getLocalizedDateTimeString(new Date(schedule.start_at))"
          />
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
    </UPageHeader>
  </div>
</template>

<script setup lang="ts">
import Datepicker from "../forms/Inputs/Datepicker.vue";
import { getLocalizedDateTimeString } from "~/utils/formatters";

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
  async () =>
    await courseActivitySchedules.fetchCourseActivitySchedulesById(
      props.scheduleId
    ),
  {
    transform: (data) => {
      if (!data) {
        return null;
      }
      return {
        ...data,
        start_at: new Date(data.start_at),
        end_at: new Date(data.end_at),
      };
    },
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
  schedule.value.start_at = date;
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
