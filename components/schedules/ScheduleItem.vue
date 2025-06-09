<template>
  <UDashboardCard :description="props.schedule.activity_description">
    <template #title>
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <UBadge
            v-if="props.schedule.schedule_status === 'PLANNED'"
            color="primary"
            variant="soft"
            >{{
              g(
                `courses.activities.schedules.schedules_status_${props.schedule.schedule_status}`
              )
            }}</UBadge
          >
          <UBadge
            v-else-if="props.schedule.schedule_status === 'CANCELED'"
            color="red"
            variant="soft"
            >{{
              g(
                `courses.activities.schedules.schedules_status_${props.schedule.schedule_status}`
              )
            }}</UBadge
          >
          <UBadge
            v-else-if="props.schedule.schedule_status === 'COMPLETED'"
            color="green"
            variant="soft"
            >{{
              g(
                `courses.activities.schedules.schedules_status_${props.schedule.schedule_status}`
              )
            }}</UBadge
          >
          <span
            :class="`text-sm ${
              isFuture(new Date(props.schedule.schedule_start_at))
                ? 'text-primary-400'
                : 'text-gray-400'
            }`"
            >{{
              getLocalizedDateTimeString(new Date(props.schedule.schedule_start_at))
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
        @click="() => deleteSchedule(props.schedule.schedule_id)"
      />
    </template>
    <div class="flex justify-between">
      <div class="flex flex-col gap-2">
        <p class="text-sm text-gray-500">{{ t("assigned_to") }}</p>
        <FormsInputsUserSelect
          v-if="props.schedule.schedule_status === 'PLANNED'"
          v-model="assigned_to"
          :orgid="props.schedule.schedule_organization_id"
        />
        <div v-else class="flex">
          <div v-if="props.schedule.schedule_assigned_to" class="flex gap-2">
            <UAvatar
              :src="assigned_to"
              :alt="`${props.schedule.assigned_to_firstname} ${props.schedule.assigned_to_lastname}`"
              size="sm"
            />
            <div class="flex flex-col">
              <p class="text-sm font-semibold">
                {{ props.schedule.assigned_to_firstname }}
                {{ props.schedule.assigned_to_lastname }}
              </p>
              <p class="text-sm text-gray-500">
                {{ props.schedule.assigned_to_email }}
              </p>
            </div>
          </div>
          <div v-else>
            {{ t("not_assigned") }}
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-sm text-gray-500">{{ t("attendees") }}</p>
        <UAvatarGroup
          v-if="attendees && attendees?.length > 0"
          size="sm"
          :max="5"
        >
          <UAvatar
            v-for="attendee in attendees"
            :key="attendee.id"
            :src="undefined"
            :alt="`${attendee.student_firstname} ${attendee.student_lastname}`"
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
import type {
  AppOrganizationSchedulesView,
  AppCourseSubscriptionsView
} from "~/types/app.types";
import EditCourseActivitySchedule from "../forms/EditCourseActivitySchedule.vue";
import { getLocalizedDateTimeString } from "~/utils/formatters";
import { isFuture } from "date-fns";
import ConfirmModal from "../ui/Modals/ConfirmModal.vue";

type ScheduleItemProps = {
  schedule: AppOrganizationSchedulesView
};

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const $emits = defineEmits(["update"]);

const props = defineProps<ScheduleItemProps>();
const client = useSupabaseClient();
const slideover = useSlideover();
const modal = useModal();
const courseActivitySchedules = useCourseActivitySchedules();

const { data: attendees } = useAsyncData(
  `schedule/${props.schedule.schedule_id}/attendees`,
  async () => {
    const { data, error } = await client
      .from("course_subscriptions_view")
      .select("*")
      .in("id", props.schedule.schedule_attendees)
      .overrideTypes<AppCourseSubscriptionsView[]>();
    if (error) {
      console.error(error);
      throw error;
    }
    return data;
  }
);

const assigned_to = ref(props.schedule.schedule_assigned_to);

const openEditSchedule = () => {
  slideover.open(EditCourseActivitySchedule, {
    orgid: props.schedule.schedule_organization_id,
    activityid: props.schedule.activity_id,
    scheduleId: props.schedule.schedule_id,
    courseid: props.schedule.course_id,
  });
};

watch(assigned_to, async (value) => {
  try {
    const { error } = await client
      .from("course_activity_schedules")
      .update({ assigned_to: value })
      .eq("id", props.schedule.schedule_id);
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
    "not_assigned": "Nicht zugewiesen",
    "no_attendees": "Keine Teilnehmer"
  },
  "en": {
    "edit_schedule": "Edit schedule",
    "edit_attendees": "Edit attendees",
    "assigned_to": "Assigned to",
    "attendees": "Attendees",
    "not_assigned": "Not assigned",
    "no_attendees": "No attendees"
  }
}
</i18n>
