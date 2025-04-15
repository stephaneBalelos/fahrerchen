<template>
  <UDashboardSection
    :title="t(`title`)"
    orientation="vertical"
    class="px-4 mt-6"
  >
  <template #links>
    <UDropdown v-if="addScheduleDropdownItems.length > 0" :items="[addScheduleDropdownItems]" :popper="{ placement: 'bottom-start' }">
      <UButton color="white" :label="t('plan_new_schedule')" trailing-icon="i-heroicons-chevron-down-20-solid" />
    </UDropdown>
    <p v-else-if="activityType" class="text-gray-500 dark:text-gray-400">
      {{ t(`no_activity_of_type_${activityType.type}`) }}
    </p>
  </template>
    <div>
      <div v-if="schedules && schedules.length > 0">
        <div
          v-for="(s, index) in schedules"
          :key="index"
          class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
          @click.stop="() => openEditSchedule(s.id, s.activity_id)"
        >
          <div class="flex flex-1 gap-4">
            <UAvatar size="md" :icon="activityIcon" />
            <div class="flex items-start gap-2">
              <div class="text-sm flex-1">
                <p class="text-gray-900 dark:text-white font-medium">
                  {{ s.activity_name }} {{ getLocalizedDateTimeString(new Date(s.start_at)) }}
                </p>
                <p class="text-gray-500 dark:text-gray-400 font-medium">
                  {{ s.assigned_to ? s.assigned_to_fullname : t("unassigned") }}
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
          </div>
        </div>
      </div>
      <div v-else>
        <UAlert 
          v-if="activityType"
          :title="t('no_schedules', { course_type: g(`courses.activities.types.${activityType.type}`) })"
          :description="t('no_schedules_description')"
        />
      </div>
    </div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import { getLocalizedDateTimeString } from "~/utils/formatters";
import EditCourseActivitySchedule from "../forms/EditCourseActivitySchedule.vue";
import { ACTIVITY_ICONS } from "~/constants";
import type { CourseActivityScheduleView } from "~/types/app.types";

type Props = {
  courseId: string;
  activityTypeId: number;
  orgId: string;
};

const slideover = useSlideover();

const props = defineProps<Props>();

const activity_types = await useCourseActivityTypes()
const course_activities = await useCourseActivities(
  props.orgId,
  props.courseId
);

const addScheduleDropdownItems = computed(() => {
  return course_activities
  .filter((activity) => activity.activity_type === props.activityTypeId)
  .map((activity) => ({
    label: activity.name,
    click: () => {
      openAddCourseScheduleForm(
        activity.id,
        undefined,
        new Date()
      );
    },
  }));
});

const activityType = computed(() => {
  const type = activity_types.find((t) => t.id === props.activityTypeId);
  if (!type) {
    return undefined
  }
  return type;
});
const activityIcon = computed(() => {
  const type = activity_types.find((t) => t.id === props.activityTypeId);
  if (!type) {
    return undefined
  }
  return ACTIVITY_ICONS[type.type]
});

const { t } = useI18n({
  useScope: "local",
});

const { t:g } = useI18n({
  useScope: "global",
});

const client = useSupabaseClient();

const {
  data: schedules,
  error,
  refresh,
} = await useAsyncData(
  `course/${props.courseId}/activity/${props.activityTypeId}/schedules`,
  async () => {
    const { data, error } = await client
      .from("course_activity_schedules_view")
      .select("*")
      .eq("activity_type", props.activityTypeId)
      .eq("course_id", props.courseId)
      .eq("organization_id", props.orgId)
      .order("start_at", {
        ascending: false,
      })
      .limit(10).overrideTypes<CourseActivityScheduleView[]>();
    if (error) {
      throw error;
    }
    return data;
  }
);

if (error.value) {
  console.error(error);
}

const openEditSchedule = (schedule_id: string, activity_id: string) => {
  slideover.open(EditCourseActivitySchedule, {
    orgid: props.orgId,
    activityid: activity_id,
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
    "title": "Aktivitätstermine",
    "plan_new_schedule": "Neuen Termin planen",
    "attendees": "Teilnehmer:innen",
    "unassigned": "Nicht zugewiesen",
    "no_schedules": "Keine Termine vom Typ {course_type}",
    "no_schedules_description": "Es wurden noch keine Termine für diese Aktivität geplant.",
    "no_activity_of_type_THEORY": "Keine Theorie-Aktivität Erstellt",
    "no_activity_of_type_PRACTICE": "Keine praktische Aktivität Erstellt",
    "no_activity_of_type_EXAM": "Keine Prüfungsaktivität Erstellt",
    "no_activity_of_type_OTHER": "Keine andere Aktivität Erstellt",
  },
  "en": {
    "title": "Activity schedules",
    "plan_new_schedule": "Plan new schedule",
    "attendees": "Attendees",
    "unassigned": "Unassigned",
    "no_schedules": "No schedules of type {course_type}",
    "no_schedules_description": "No schedules have been planned for this activity yet.",
    "no_activity_of_type_THEORY": "No theory activity created",
    "no_activity_of_type_PRACTICE": "No practical activity created",
    "no_activity_of_type_EXAM": "No exam activity created",
    "no_activity_of_type_OTHER": "No other activity created",
  }
}
</i18n>
