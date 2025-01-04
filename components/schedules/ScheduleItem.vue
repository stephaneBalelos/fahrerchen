<template>
  <UDashboardCard :description="props.schedule.activity_description">
    <template #title>
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <UBadge
            v-if="props.schedule.status === 'PLANNED'"
            color="primary"
            variant="soft"
            >{{
              g(
                `courses.activities.schedules.schedules_status_${props.schedule.status}`
              )
            }}</UBadge
          >
          <span
            :class="`text-sm ${
              isFuture(new Date(props.schedule.start_at))
                ? 'text-primary-400'
                : 'text-gray-400'
            }`"
            >{{
              getLocalizedDateTimeString(new Date(props.schedule.start_at))
            }}</span
          >
        </div>
        <h3 class="text-2xl font-semibold">
          {{ props.schedule.course_name }} | {{ props.schedule.activity_name }}
        </h3>
      </div>
    </template>
    <template #links>
      <UButton size="sm" color="gray" variant="solid" @click="openEditSchedule">
        {{ t("edit_schedule") }}
      </UButton>
      <UButton size="sm" color="gray" variant="solid" @click="openEditAttendees">
        {{ t("edit_attendees") }}
      </UButton>
    </template>
    <div class="flex justify-between">
      <div class="flex flex-col gap-2">
        <p class="text-sm text-gray-500">{{ t("assigned_to") }}</p>
        <FormsInputsUserSelect
          v-model="assigned_to"
          :orgid="props.schedule.organization_id"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm text-gray-500">{{ t("attendees") }}</p>
        <UAvatarGroup v-if="attendees && attendees?.length > 0" size="sm" :max="5">
          <UAvatar
            v-for="attendee in attendees"
            :key="attendee.id"
            :src="attendee.subscription?.students?.id"
            :alt="`${attendee.subscription?.students?.firstname} ${attendee.subscription?.students?.lastname}`"
          />
        </UAvatarGroup>
        <div v-else class="">
            {{ t("no_attendees") }}
        </div>

      </div>
    </div>
  </UDashboardCard>
</template>

<script setup lang="ts">
import type { Database, CourseActivityScheduleView } from "~/types/app.types";
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

const { t: g } = useI18n({
  useScope: "global",
});

const props = defineProps<ScheduleItemProps>();
const client = useSupabaseClient<Database>();
const slideover = useSlideover();

const {
  data: attendees,
  refresh,
} = useAsyncData(`schedule/${props.schedule.id}/attendees`, async () => {
  const { data, error } = await client
    .from("course_activity_attendances")
    .select("*, subscription:course_subscriptions(*, students(*))")
    .eq("activity_schedule_id", props.schedule.id);
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
});

const assigned_to = ref(props.schedule.assigned_to);


const openEditSchedule = () => {
  slideover.open(EditCourseActivitySchedule, {
    orgid: props.schedule.organization_id,
    activityid: props.schedule.activity_id,
    activity_schedule_id: props.schedule.id,
    courseid: props.schedule.course_id,
  });
};

const openEditAttendees = () => {
  slideover.open(AddStudentsAttendanceForm, {
    courseid: props.schedule.course_id,
    courseActivitySchedule: props.schedule,
    onUpdated: () => {
      refresh();
    },
  });
};

watch(assigned_to, async (value) => {
  try {
    const { error } = await client
      .from("course_activity_schedules")
      .update({ assigned_to: value })
      .eq("id", props.schedule.id);
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(error);
  }
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "edit_schedule": "Termin bearbeiten",
    "edit_attendees": "Teilnehmer bearbeiten",
    "assigned_to": "Zugewiesen an",
    "attendees": "Teilnehmer",
    "no_attendees": "Keine Teilnehmer"
  },
  "en": {
    "edit_schedule": "Edit schedule",
    "edit_attendees": "Edit attendees",
    "assigned_to": "Assigned to",
    "attendees": "Attendees",
    "no_attendees": "No attendees"

  }
}
</i18n>
