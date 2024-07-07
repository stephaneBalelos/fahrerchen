<template>
  <div
    class="flex flex-col h-full overflow-y-hidden"
    @click="props.onEmptyClick"
  >
    <UPopover
      v-if="courseActivities.length > 0"
      v-for="activity in courseActivities"
      :key="activity.id"
    >
      <UButton truncate block size="2xs" :label="activity.name">
        <template #leading>
          <UAvatar
            src="https://avatars.githubusercontent.com/u/739984?v=4"
            size="2xs"
          />
        </template>
      </UButton>

      <template #panel>
        <UDashboardCard :title="activity.name">
          <template #description>
            {{ `${new Date(activity.date).toLocaleDateString("de")}` }}
          </template>
          <template #links>
            <UButton color="gray" variant="solid" @click.stop="openAddCourseActivityForm(activity)">
              Edit</UButton
            >
          </template>
          <p>{{ activity.description }}</p>
          <UAvatarGroup size="xs" :max="2">
            <UAvatar
              src="https://avatars.githubusercontent.com/u/739984?v=4"
              alt="benjamincanac"
            />
            <UAvatar
              src="https://avatars.githubusercontent.com/u/904724?v=4"
              alt="Atinux"
            />
            <UAvatar
              src="https://avatars.githubusercontent.com/u/7547335?v=4"
              alt="smarroufin"
            />
          </UAvatarGroup>
        </UDashboardCard>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
import type { AppCourseActivity } from "~/types/app.types";
import type { AppCalendarDay } from "../calendar/views/AppCalendarMonthView.vue";
import AddCourseActivityForm from "../forms/AddCourseActivityForm.vue";

type Props = {
  courseActivities: AppCourseActivity[];
  day: AppCalendarDay;
  onEmptyClick?: () => void;
};

const props = defineProps<Props>();
const $emit = defineEmits(['change']);
const slideover = useSlideover();

const openAddCourseActivityForm = (activity: AppCourseActivity) => {
  slideover.open(AddCourseActivityForm, {
    courseid: activity.course_id,
    orgid: activity.organisation_id,
    date: props.day.date,
    course_activity_id: activity.id,
    "onActivity-deleted": () => {
      slideover.close();
      $emit("change");
    },
    "onActivity-saved": () => {
      slideover.close();
      $emit("change");
    },
  });
};
</script>

<style scoped></style>
