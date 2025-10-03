<template>
  <div>
    <UDashboardSection
      v-if="activity && schedule"
      :title="activity.name"
      :description="activity.description"
      :ui="{
        wrapper: '*:pt-0 first:*:pt-0',
      }"
    >
      <template #title>
        <span class="text-xl font-medium">
          {{ activity.name }}
        </span>
      </template>
      <template #links>
        <UBadge color="primary" variant="soft">
          {{ g(`activities.types.${activity.activity_type}.name`) }}
        </UBadge>
      </template>

      <div
        v-if="schedule"
        class="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-800 pt-0"
      >
        <UFormGroup
          :label="t('settings.start_at.label')"
          :description="t('settings.start_at.description')"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-4"
          :ui="{
            container: 'flex flex-wrap items-center gap-3',
            help: 'mt-0',
          }"
        >
          <UPopover class="col-span-2" :popper="{ placement: 'bottom-start' }" @update:open="(open) => { if (!open) saveState() }">
            <UButton
              color="white"
              variant="solid"
              :size="'md'"
              :label="getLocalizedDateTimeString(state.start_at)"
            />
            <template #panel="">
              <Datepicker
                v-model="state.start_at"
                is-required
                :mode="'dateTime'"
              />
            </template>
          </UPopover>
        </UFormGroup>
        <UFormGroup
          name="assigned_to"
          :label="t('form.assigned_to.label')"
          :description="t('form.assigned_to.description')"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-4"
          :ui="{
            container: 'flex flex-wrap items-center gap-3',
            help: 'mt-0',
          }"
        >
          <FormsInputsUserSelect
            v-model="state.assigned_to"
            :orgid="activity.organization_id"
            :variant="'solid'"
            :color="'white'"
            @update:model-value="saveState"
          />
        </UFormGroup>
        <UFormGroup
          name="allowed_courses"
          :label="t('form.allowed_courses.label')"
          :description="t('form.allowed_courses.description')"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-4"
          :ui="{
            container: 'flex flex-wrap items-center gap-3',
            help: 'mt-0',
          }"
        >
          <SchedulesScheduleAllowedCourses
            :schedule-id="schedule.id"
            :activity-id="activity.id"
          />
        </UFormGroup>
      </div>
    </UDashboardSection>
  </div>
</template>

<script setup lang="ts">
import Datepicker from "../forms/Inputs/Datepicker.vue";
import { getLocalizedDateTimeString } from "~/utils/formatters";
import { z } from "zod";
import type { AppCourseActivitySchedule } from "~/types/app.types";

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

const courseActivitySchedules = useCourseActivitySchedules();
const schedule = ref<AppCourseActivitySchedule | null>(null);
const _schema = z.object({
  assigned_to: z.string().uuid().optional(),
  start_at: z.date(),
});

type Schema = z.infer<typeof _schema>;

const state = reactive<Schema>({
  start_at: schedule.value ? new Date(schedule.value.start_at) : new Date(),
  assigned_to: schedule.value?.assigned_to
    ? schedule.value.assigned_to
    : undefined,
});

const loadSchedule = async () => {
  if (!props.scheduleId) {
    schedule.value = null;
    return;
  }
  try {
    const s = await courseActivitySchedules.fetchCourseActivitySchedulesById(
      props.scheduleId
    );
    schedule.value = s;
    if (s) {
      state.start_at = new Date(s.start_at);
      state.assigned_to = s.assigned_to ? s.assigned_to : undefined;
    }
  } catch (e) {
    console.error("Error loading schedule", e);
    schedule.value = null;
  }
};

onMounted(async () => {
  await loadSchedule();
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

const saveState = async () => {
  console.log("Saving state", state);
  if (!schedule.value) {
    return;
  }
  try {
    _schema.parse(state);
    await courseActivitySchedules.updateCourseActivitySchedule(
      schedule.value.id,
      {
        assigned_to: state.assigned_to ? state.assigned_to : null,
        start_at: state.start_at.toISOString(),
      }
    );
  } catch (e) {
    // Validation errors
    console.error(e);
  } finally {
    await loadSchedule();
  }
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "en": {
    "settings": {
      "start_at": {
        "label": "Start At",
        "description": "The date and time when the activity is scheduled to start."
      }
    },
    "form": {
      "assigned_to": {
        "label": "Assigned To",
        "description": "The user assigned to this activity schedule."
      },
      "allowed_courses": {
        "label": "Allowed Courses",
        "description": "Courses that are allowed to access this activity schedule."
      }
    }
  },
  "de": {
    "settings": {
      "start_at": {
        "label": "Startzeit",
        "description": "Das Datum und die Uhrzeit, zu der die Aktivität beginnen soll."
      }
    },
    "form": {
      "assigned_to": {
        "label": "Zugewiesen an",
        "description": "Der Benutzer, der diesem Aktivitätsplan zugewiesen ist."
      },
      "allowed_courses": {
        "label": "Erlaubte Kurse",
        "description": "Kurse, die auf diesen Aktivitätsplan zugreifen dürfen."
      }
    }
  }
}
</i18n>
