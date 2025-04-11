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
      <UButton
        size="sm"
        color="red"
        variant="soft"
        icon="i-heroicons-trash"
        @click="() => deleteSchedule(props.schedule.id)"
      />
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
import { getLocalizedDateTimeString } from "~/utils/formatters";
import { isFuture } from "date-fns";
import ConfirmModal from "../ui/Modals/ConfirmModal.vue";

type ScheduleItemProps = {
  schedule: CourseActivityScheduleView;
};

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const $emits = defineEmits(["update"]);

const props = defineProps<ScheduleItemProps>();
const client = useSupabaseClient<Database>();
const slideover = useSlideover();
const modal = useModal();
const courseActivitySchedules = useCourseActivitySchedules();


const {
  data: attendees
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
    scheduleId: props.schedule.id,
    courseid: props.schedule.course_id,
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

async function deleteSchedule(id: string) {
  try {
    modal.open(ConfirmModal, {
      title: "Delete Course Activity Schedule",
      description:
        "Are you sure you want to delete this course activity schedule?",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      action: async () => {
        const result =
          await courseActivitySchedules.deleteCourseActivitySchedule(id);
        if (!result) {
          throw new Error("Failed to delete course activity schedule");
        }
        $emits("update");
      },
    });
  } catch (error) {
    console.error(error);
  }
}
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
