<template>
  <UDashboardSection
    icon="i-heroicons-user"
    :title="props.activityName"
    :description="props.activityDescription"
    orientation="vertical"
    class="px-4 mt-6"
    :links="[
      {
        label: t('plan_new_schedule'),
        icon: 'i-heroicons-plus-20-solid',
        click: () => openAddCourseScheduleForm(props.activityId),
      },
    ]"
  >
    <div>
      <div v-if="schedules && schedules.length > 0">
        <div
          v-for="(s, index) in schedules"
          :key="index"
          class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
          @click="openAddStudentsAttendanceForm(s)"
        >
          <div class="flex flex-1 gap-4">
            <UAvatar :alt="'AM'" size="md" />
            <div class="flex items-start gap-2">
              <div class="text-sm flex-1">
                <p class="text-gray-900 dark:text-white font-medium">
                  {{ s.assigned_to ? s.assigned_to_fullname : t("unassigned") }}
                </p>
                <p class="text-gray-500 dark:text-gray-400 font-medium">
                  {{ getLocalizedDateTimeString(new Date(s.start_at)) }}
                </p>
              </div>
              <UBadge v-if="s.status === 'COMPLETED'" color="green" variant="soft">
              {{
                g(`courses.activities.schedules.schedules_status_${s.status}`)
              }}
            </UBadge>
            <UBadge v-else-if="s.status === 'CANCELED'" color="red" variant="soft">
              {{
                g(`courses.activities.schedules.schedules_status_${s.status}`)
              }}
            </UBadge>
            <UBadge v-else color="primary" variant="soft">
              {{
                g(`courses.activities.schedules.schedules_status_${s.status}`)
              }}
            </UBadge>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex flex-col gap-1">
              <p class="text-gray-500 dark:text-gray-400">
                {{ s.attendees.length }} {{ t("attendees") }}
              </p>
            </div>
            <UButton
              icon="i-heroicons-pencil-square"
              color="gray"
              variant="solid"
              square
              @click.stop="() => openEditSchedule(s.id)"
            />
          </div>
          <!-- <p class="text-gray-900 dark:text-white font-medium text-lg">
            {{ s.attendees.length }}
          </p> -->
        </div>
      </div>
      <div v-else>
        <UAlert
          :title="t('no_schedules', { course_activity: props.activityName })"
          :description="t('no_schedules_description')"
        />
      </div>
    </div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import type { AppCourseActivitySchedule, Database } from "~/types/app.types";
import { getLocalizedDateTimeString } from "~/utils/formatters";
import AddStudentsAttendanceForm from "../forms/AddStudentsAttendanceForm.vue";
import EditCourseActivitySchedule from "../forms/EditCourseActivitySchedule.vue";

type Props = {
  courseId: string;
  activityId: string;
  activityName: string;
  activityDescription: string;
  orgId: string;
};

const slideover = useSlideover();

const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const { t:g } = useI18n({
  useScope: "global",
});

const client = useSupabaseClient<Database>();

const {
  data: schedules,
  error,
  refresh,
} = await useAsyncData(
  `course/${props.courseId}/activity/${props.activityId}/schedules`,
  async () => {
    const { data, error } = await client
      .from("course_activity_schedules_view")
      .select("*")
      .eq("activity_id", props.activityId)
      .eq("organization_id", props.orgId)
      .order("start_at", {
        ascending: false,
      })
      .limit(10);

    if (error) {
      throw error;
    }
    return data;
  }
);

if (error.value) {
  console.error(error);
}

function openAddStudentsAttendanceForm(
  course_activity_schedule: AppCourseActivitySchedule
) {
  slideover.open(AddStudentsAttendanceForm, {
    courseid: props.courseId,
    courseActivitySchedule: course_activity_schedule,
    onUpdated: async () => {
      await refresh();
    },
  });
}

const openEditSchedule = (schedule_id: string) => {
  slideover.open(EditCourseActivitySchedule, {
    orgid: props.orgId,
    activityid: props.activityId,
    scheduleId: schedule_id,
    courseid: props.courseId,
    "onActivity-saved": async () => {
      await refresh();
      slideover.close();
    },
    "onActivity-deleted": async () => {
      await refresh();
      slideover.close();
    },
  });
};

function openAddCourseScheduleForm(
  course_activity_id: string,
  activity_schedule_id?: string,
  date?: Date
) {
  slideover.open(EditCourseActivitySchedule, {
    orgid: props.orgId,
    courseid: props.courseId,
    activityid: course_activity_id,
    scheduleId: activity_schedule_id,
    date: date,

    "onActivity-saved": async () => {
      await refresh();
      slideover.close();
    },
  });
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "plan_new_schedule": "Neuen Termin planen",
    "attendees": "Teilnehmer:innen",
    "unassigned": "Nicht zugewiesen",
    "no_schedules": "Keine Termine für {course_activity}",
    "no_schedules_description": "Es wurden noch keine Termine für diese Aktivität geplant."
  },
  "en": {
    "plan_new_schedule": "Plan new schedule",
    "attendees": "Attendees",
    "unassigned": "Unassigned",
    "no_schedules": "No schedules for {course_activity}",
    "no_schedules_description": "No schedules have been planned for this activity yet."
  }
}
</i18n>
