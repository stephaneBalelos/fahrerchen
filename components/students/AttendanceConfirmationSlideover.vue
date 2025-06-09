<template>
  <UDashboardSlideover :title="t('attendance_confirmation')">
    <UDashboardSection
      v-if="data"
      :title="data.activity_name"
      :description="data.activity_description"
      :icon="activityIcon"
    >
      <div v-if="data.subscription.student" class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <p class="text-gray-900 dark:text-white font-medium">
            {{ t("activity_course") }}
          </p>
          <div class="flex items-center gap-2">
            <p class="text-gray-500 dark:text-gray-400 text-md">
              {{ data.subscription.course.name }}
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-gray-900 dark:text-white font-medium">
            {{ t("activity_attendee") }}
          </p>
          <div class="flex items-center gap-2">
            <UAvatar
              size="xs"
              :alt="`${data.subscription.student.firstname} ${data.subscription.student.lastname}`"
            />
            <p class="text-gray-500 dark:text-gray-400 text-md">
              {{ data.subscription.student.firstname }}
              {{ data.subscription.student.lastname }}
            </p>
          </div>
        </div>
        <div class="flex flex-col">
          <p class="text-gray-900 dark:text-white font-medium">
            {{ t("activity_responsible") }}
          </p>
          <div
            v-if="data.schedule_assigned_to_id"
            class="flex items-center gap-2"
          >
            <UAvatar
              size="xs"
              :alt="`${data.schedule_assigned_to_firstname} ${data.schedule_assigned_to_lastname}`"
            />
            <p class="text-gray-500 dark:text-gray-400 text-md">
              {{ data.schedule_assigned_to_firstname }}
              {{ data.schedule_assigned_to_lastname }}
            </p>
          </div>
          <div v-else class="text-gray-500 dark:text-gray-400 text-md">
            {{ t("unassigned") }}
          </div>
        </div>

        <div class="flex flex-col">
          <p class="text-gray-900 dark:text-white font-medium">
            {{ t("activity_date") }}
          </p>
          <p class="text-gray-500 dark:text-gray-400 text-md">
            {{ formatDateTime(data.schedule_start_at) }}
          </p>
        </div>
        <div class="flex flex-col">
          <p class="text-gray-900 dark:text-white font-medium">
            {{ t("activity_duration") }}
          </p>
          <p class="text-gray-500 dark:text-gray-400 text-md">
            {{
              formatDistance(
                new Date(data.schedule_end_at),
                new Date(data.schedule_start_at)
              )
            }}
          </p>
        </div>
      </div>
    </UDashboardSection>
    <template #footer>
      <div class="flex">
        <UButton variant="solid" color="red" @click="deleteAttendance">
          {{ t("delete") }}
        </UButton>
      </div>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import { formatDistance } from "date-fns";
import { ACTIVITY_ICONS } from "~/constants";
import { formatDateTime } from "~/utils/formatters";

type Props = {
  attendanceId: string;
};

const props = defineProps<Props>();
const $emits = defineEmits(["delete", "close"]);

const { t } = useI18n({
  useScope: "local",
});

const client = useSupabaseClient();

const { data } = useAsyncData(
  `course_activity_schedule_attendance_${props.attendanceId}`,
  async () => {
    const { data, error } = await client
      .from("course_activity_schedules_attendances")
      .select("*, subscription:course_subscriptions(*, course:courses(*), student:students(*))")
      .eq("id", props.attendanceId)
      .single();

    if (error) {
      return null;
    }
    return data;
  }
);

const activityIcon = computed(() => {
  if (!data.value) {
    return undefined;
  }
  return Object.values(ACTIVITY_ICONS)[data.value.activity_type];
});

const deleteAttendance = async () => {
  if (!data.value) {
    return;
  }

  const { error } = await client
    .from("course_activity_schedules_attendances")
    .delete()
    .eq("id", data.value.id);

  if (error) {
    console.error("Error deleting attendance:", error);
    return;
  }

  $emits("delete", data.value.id);
  $emits("close");
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "attendance_confirmation": "Teilnahmebestätigung",
    "activity_course": "Kurs",
    "activity_attendee": "Teilnehmer",
    "activity_responsible": "Verantwortlich",
    "activity_date": "Datum",
    "activity_duration": "Dauer",
    "delete": "Löschen",
    "unassigned": "Nicht zugewiesen"
  },
  "en": {
    "attendance_confirmation": "Attendance confirmation",
    "activity_course": "Course",
    "activity_attendee": "Attendee",
    "activity_responsible": "Responsible",
    "activity_date": "Date",
    "activity_duration": "Duration",
    "delete": "Delete",
    "unassigned": "Unassigned"
  }
}
</i18n>
