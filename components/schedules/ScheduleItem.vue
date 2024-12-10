<template>
  <UDashboardCard :description="props.schedule.activity_description">
    <template #title>
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
            <UBadge v-if="props.schedule.status === 'PLANNED'" color="primary" variant="soft">{{ g(`courses.activities.schedules.schedules_status_${props.schedule.status}`) }}</UBadge>
            <span :class="`text-sm ${ isFuture(new Date(props.schedule.start_at)) ? 'text-primary-400' : 'text-gray-400'}`">{{ getLocalizedDateTimeString(new Date(props.schedule.start_at)) }}</span>
        </div>
        <h3 class="text-2xl font-semibold">
          {{ props.schedule.course_name }} | {{ props.schedule.activity_name }}
        </h3>
      </div>
    </template>
    <template #links>
      <UButton size="sm" color="gray" variant="solid" @click="openEditSchedule"> {{ t('edit_schedule') }} </UButton>
      <UButton size="sm" color="gray" variant="solid"> {{ t('edit_attendees') }} </UButton>
    </template>
    <div class="flex justify-between">
      <div class="flex flex-col gap-2">
        <p class="text-sm text-gray-500">{{ t('assigned_to') }}</p>
        <FormsInputsUserSelect
          v-model="props.schedule.assigned_to"
          :orgid="props.schedule.organization_id"
        ></FormsInputsUserSelect>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm text-gray-500">{{ t('attendees') }}</p>
          <UAvatarGroup size="sm" :max="5">
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
            <UAvatar
              src="https://avatars.githubusercontent.com/u/7547335?v=4"
              alt="smarroufin"
            />
            <UAvatar
              src="https://avatars.githubusercontent.com/u/7547335?v=4"
              alt="smarroufin"
            />
            <UAvatar
              src="https://avatars.githubusercontent.com/u/7547335?v=4"
              alt="smarroufin"
            />
            <UAvatar
              src="https://avatars.githubusercontent.com/u/7547335?v=4"
              alt="smarroufin"
            />
          </UAvatarGroup>
      </div>
    </div>
  </UDashboardCard>
</template>

<script setup lang="ts">
import type { CourseActivityScheduleView } from "~/types/app.types";
import EditCourseActivitySchedule from "../forms/EditCourseActivitySchedule.vue";
import AddStudentsAttendanceForm from "../forms/AddStudentsAttendanceForm.vue";
import { getLocalizedDateTimeString } from "~/utils/formatters";
import { isFuture } from "date-fns";

type ScheduleItemProps = {
  schedule: CourseActivityScheduleView;
};

const { t } = useI18n({
  useScope: "local",
});

const { t:g } = useI18n({
  useScope: "global",
});

const props = defineProps<ScheduleItemProps>();
const slideover = useSlideover();


const openEditSchedule = () => {
  slideover.open(EditCourseActivitySchedule, {
    orgid: props.schedule.organization_id,
    activityid: props.schedule.activity_id,
    activity_schedule_id: props.schedule.id,
    courseid: props.schedule.course_id,
  })
};

const openEditAttendees = () => {
    console.log('Edit Attendees');
};
</script>

<style scoped></style>

<i18n lang="json">
{
    "de": {
        "edit_schedule": "Termin bearbeiten",
        "edit_attendees": "Teilnehmer bearbeiten",
        "assigned_to": "Zugewiesen an",
        "attendees": "Teilnehmer"
    },
    "en": {
        "edit_schedule": "Edit schedule",
        "edit_attendees": "Edit attendees",
        "assigned_to": "Assigned to",
        "attendees": "Attendees"
    }
}
</i18n>
