<template>
  <UDashboardSlideover :prevent-close="false">
    <template #title>
      {{
        schedule ? getLocalizedDateTimeString(new Date(schedule.start_at)) : ""
      }}
    </template>
    <UDashboardSection
      v-if="activity && schedule"
      :title="activity.name"
      :description="activity.description"
      :ui="{
        wrapper: '*:pt-0 first:*:pt-0',
      }"
    >
      <template #title>
        <div class="flex flex-col items-start space-y-2">
          <div class="flex gap-2">
            <UBadge
              :color="ACTIVITY_COLORS[activity.activity_type]"
              variant="soft"
              size="sm"
            >
              {{ g(`activities.types.${activity.activity_type}.name`) }}
            </UBadge>
            <UBadge
              v-if="schedule.status === 'PLANNED'"
              color="primary"
              variant="soft"
              size="sm"
            >
              {{ g(`schedules.status.${schedule.status}`) }}
            </UBadge>
            <UBadge
              v-if="schedule.status === 'CANCELED'"
              color="red"
              variant="soft"
              size="sm"
            >
              {{ g(`schedules.status.${schedule.status}`) }}
            </UBadge>
            <UBadge
              v-if="schedule.status === 'COMPLETED'"
              color="green"
              variant="soft"
              size="sm"
            >
              {{ g(`schedules.status.${schedule.status}`) }}
            </UBadge>
          </div>
          <span class="text-xl font-medium">
            {{ activity.name }}
          </span>
        </div>
      </template>
      <div
        v-if="schedule"
        class="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-800 pt-0"
      >
        <UFormGroup
          :label="t('form.start_at.label')"
          class="grid grid-cols-1 gap-2 py-4"
          :ui="{
            container: 'flex flex-wrap items-center gap-3 col-span-2',
            help: 'mt-0',
          }"
        >
          <div class="text-lg font-semibold col-span-2">
            {{ getLocalizedDateTimeString(new Date(schedule.start_at)) }}
          </div>
        </UFormGroup>
        <UFormGroup
          name="assigned_to"
          :label="t('form.assigned_to.label')"
          class="grid gap-2 py-4"
          :ui="{
            container: 'flex flex-wrap items-center gap-3 col-span-2',
            help: 'mt-0',
          }"
        >
          <div
            v-if="schedule.assigned_to && schedule.user"
            class="flex items-center space-x-3 text-lg font-medium"
          >
            <UAvatar :alt="`${schedule.user.fullname}`" size="md" shape="circle" />
            <span>{{ schedule.user.fullname }}</span>
          </div>
          <div v-else class="text-lg font-medium">-</div>
        </UFormGroup>
        <UFormGroup
          name="allowed_courses"
          :label="t('form.allowed_courses.label')"
          class="grid gap-2 py-4"
          :ui="{
            container: 'flex flex-wrap items-center gap-3 col-span-2',
            help: 'mt-0',
          }"
        >
          <SchedulesScheduleAllowedCourses
            :schedule-id="schedule.id"
            :activity-id="activity.id"
          />
        </UFormGroup>
        <UFormGroup
          name="attendees"
          :label="t('form.attendees.label')"
          class="grid gap-2 py-4"
          :ui="{
            container: 'flex flex-col items-start gap-4',
            help: 'mt-0',
          }"
        >
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-user-group-solid" class="text-gray-500" />
            <p v-if="attendee && schedule.course_activity_schedules_attendees.length > 1" class="text-sm text-gray-700 dark:text-gray-300">
              {{ t('you_and_x_attendees', { count: schedule.course_activity_schedules_attendees.length - 1 }) }}
            </p>
            <p v-else-if="attendee" class="text-sm text-gray-700 dark:text-gray-300">
              {{ t('you', { name: studentStore.student?.firstname + ' ' + studentStore.student?.lastname }) }}
            </p>
            <p v-else class="text-sm text-gray-700 dark:text-gray-300">
              {{ schedule.course_activity_schedules_attendees.length }}
              {{ t("attendees") }}
            </p>
          </div>
          <div v-if="schedule.status === 'PLANNED'" class="w-full">
            <UAlert
              v-if="attendee"
              :title="t('you_are_attending')"
              color="primary"
              variant="soft"
              :actions="schedule.activity.allow_self_registration ? [
                {
                  label: t('cancel_attendance'),
                  click: () => { cancelAttendance(); },
                },
              ] : []"
            />
            <UAlert
              v-else
              :title="t('you_are_not_attending')"
              :actions="schedule.activity.allow_self_registration ? [
                {
                  label: t('attend_to_schedule'),
                  click: () => { attendToSchedule(); },
                },
              ] : []"
            />
          </div>
        </UFormGroup>
      </div>
    </UDashboardSection>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import { getLocalizedDateTimeString } from "~/utils/formatters";
import { ACTIVITY_COLORS } from "~/constants";

type Props = {
  scheduleId: string;
};

const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const studentStore = useStudentStore();
const $courseActivitySchedules = useCourseActivitySchedules();

const { data: schedule, refresh } = useAsyncData(
  `course-activity-schedule-${props.scheduleId}`,
  async () => {
    return await $courseActivitySchedules.fetchCourseActivitySchedulesById(
      props.scheduleId
    );
  }
);

const attendee = computed(() => {
  if (studentStore.selectedSubscription?.id) {
    return schedule.value?.course_activity_schedules_attendees.find(
      (a) => a.subscription_id === studentStore.selectedSubscription?.id
    );
  }
  return null;
});

const courseActivitiesStore = useCourseActivitiesStore();
const activity = computed(() => {
  if (schedule.value?.activity_id) {
    return courseActivitiesStore.courseActivities.find(
      (a) => a.id === schedule.value?.activity_id
    );
  }
  return null;
});

const attendToSchedule = async () => {
  if (
    !studentStore.selectedSubscription?.id ||
    !props.scheduleId ||
    attendee.value
  ) {
    return;
  }
  try {
    await $courseActivitySchedules.addAttendeesToSchedule(props.scheduleId, [
      studentStore.selectedSubscription.id,
    ]);
  } catch (error) {
    console.error("Error attending to schedule:", error);
  } finally {
    await refresh();
  }
};

const cancelAttendance = async () => {
  if (
    !studentStore.selectedSubscription?.id ||
    !props.scheduleId ||
    !attendee.value
  ) {
    return;
  }
  try {
    await $courseActivitySchedules.removeAttendeeFromSchedule(
      attendee.value.id
    );
  } catch (error) {
    console.error("Error cancelling attendance:", error);
  } finally {
    await refresh();
  }
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "en": {
    "attendees": "Attendees",
    "form": {
      "start_at": {
        "label": "Start At"
      },
      "assigned_to": {
        "label": "Responsible"
      },
      "allowed_courses": {
        "label": "Concerned Classes",
        "description": "Classes that are allowed to attend this activity schedule."
      },
      "attendees": {
        "label": "Attendees"
      }
    },
    "you": "You, {name}",
    "you_and_x_attendees": "You and {count} participants",
    "you_are_attending": "You are attending this schedule.",
    "you_are_not_attending": "You are not attending this schedule.",
    "attend_to_schedule": "Attend to Schedule",
    "cancel_attendance": "Cancel Attendance"
  },
  "de": {
    "attendees": "Teilnehmer",
    "form": {
      "start_at": {
        "label": "Startzeit"
      },
      "assigned_to": {
        "label": "verantwortlicher"
      },
      "allowed_courses": {
        "label": "Betreffende Klassen",
        "description": "Klassen, die an diesem Termin teilnehmen dürfen."
      },
      "attendees": {
        "label": "Teilnehmer:innen"
      }
    },
    "you": "Du, {name}",
    "you_and_x_attendees": "Du und {count} Teilnehmer:innen",
    "you_are_attending": "Du nimmst an diesem Termin teil.",
    "you_are_not_attending": "Du nimmst nicht an diesem Termin teil.",
    "attend_to_schedule": "An Termin teilnehmen",
    "cancel_attendance": "Teilnahme absagen"
  }
}
</i18n>
