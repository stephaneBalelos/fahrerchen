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
        <div class="flex flex-col items-start space-y-2">
          <div class="flex gap-2">
            <UBadge color="primary" variant="soft" size="sm">
              {{ g(`activities.types.${activity.activity_type}.name`) }}
            </UBadge>
            <UBadge v-if="schedule.status === 'PLANNED'" color="primary" variant="soft" size="sm">
              {{ g(`schedules.status.${schedule.status}`) }}
            </UBadge>
            <UBadge v-if="schedule.status === 'CANCELED'" color="red" variant="soft" size="sm">
              {{ g(`schedules.status.${schedule.status}`) }}
            </UBadge>
            <UBadge v-if="schedule.status === 'COMPLETED'" color="green" variant="soft" size="sm">
              {{ g(`schedules.status.${schedule.status}`) }}
            </UBadge>
          </div>
          <span class="text-xl font-medium">
            {{ activity.name }}
          </span>
        </div>
      </template>
      <template #links>
        <UButton
          v-if="schedule.status !== 'COMPLETED' && schedule.status !== 'CANCELED'"
          size="sm"
          class="ml-2"
          color="white"
          :label="t('mark_as_completed')"
          @click="markAsCompleted(schedule.id)"
        />
        <UButton
          v-if="schedule.status !== 'CANCELED' && schedule.status !== 'COMPLETED'"
          size="sm"
          class="ml-2"
          color="red"
          variant="soft"
          :label="t('mark_as_canceled')"
          @click="markAsCanceled(schedule.id)"
        />
      </template>

      <div
        v-if="schedule"
        class="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-800 pt-0"
      >
        <UFormGroup
          :label="t('form.start_at.label')"
          :description="t('form.start_at.description')"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-4"
          :ui="{
            container: 'flex flex-wrap items-center gap-3 col-span-2',
            help: 'mt-0',
          }"
        >
          <UPopover
            v-if="schedule.status === 'PLANNED'"
            :popper="{ placement: 'bottom-start' }"
            @update:open="
              (open) => {
                if (!open) saveState();
              }
            "
          >
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
          <div v-else>
            {{ getLocalizedDateTimeString(new Date(schedule.start_at)) }}
          </div>
        </UFormGroup>
        <UFormGroup
          name="assigned_to"
          :label="t('form.assigned_to.label')"
          :description="t('form.assigned_to.description')"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-4"
          :ui="{
            container: 'flex flex-wrap items-center gap-3 col-span-2',
            help: 'mt-0',
          }"
        >
          <FormsInputsUserSelect
            v-model="state.assigned_to"
            :orgid="activity.organization_id"
            :variant="'solid'"
            :color="'white'"
            :disabled="schedule.status !== 'PLANNED'"
            @update:model-value="saveState"
          />
        </UFormGroup>
        <UFormGroup
          name="allowed_courses"
          :label="t('form.allowed_courses.label')"
          :description="t('form.allowed_courses.description')"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-4"
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
          :description="t('form.attendees.description')"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-4"
          :ui="{
            container: 'flex flex-wrap items-center gap-3 col-span-2',
            help: 'mt-0',
          }"
        >
          <SchedulesScheduleAttendeesList
            :course-activity-schedule="schedule"
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
import ConfirmModal from "../ui/Modals/ConfirmModal.vue";

type Props = {
  scheduleId: string;
};

const modal = useModal();
const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const $courseActivitySchedules = useCourseActivitySchedules();
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
    const s = await $courseActivitySchedules.fetchCourseActivitySchedulesById(
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
    await $courseActivitySchedules.updateCourseActivitySchedule(
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

const markAsCompleted = async (scheduleId: string) => {
  modal.open(ConfirmModal, {
    title: t("mark_as_completed_title"),
    description: t("mark_as_completed_description"),
    confirmLabel: t("mark_as_completed"),
    cancelLabel: t("cancel"),
    action: async () => {
      await $courseActivitySchedules.updateCourseActivitySchedule(scheduleId, {
        status: "COMPLETED",
      });
      modal.close();
      await loadSchedule();
    },
  });
};

const markAsCanceled = async (scheduleId: string) => {
  modal.open(ConfirmModal, {
    title: t("mark_as_canceled_title"),
    description: t("mark_as_canceled_description"),
    confirmLabel: t("mark_as_canceled"),
    cancelLabel: t("cancel"),
    action: async () => {
      await $courseActivitySchedules.updateCourseActivitySchedule(scheduleId, {
        status: "CANCELED",
      });
      modal.close();
      await loadSchedule();
    },
  });
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "en": {
    "mark_as_completed": "Mark as Completed",
    "mark_as_completed_title": "Mark Schedule as Completed",
    "mark_as_completed_description": "This schedule will be marked as completed. A certificate of attendance will be created for the participants.",
    "mark_as_canceled": "Mark as Canceled",
    "mark_as_canceled_title": "Mark Schedule as Canceled",
    "mark_as_canceled_description": "This schedule will be marked as canceled. No certificate of attendance will be created for the participants.",
    "cancel": "Cancel",
    "form": {
      "start_at": {
        "label": "Start At",
        "description": "The date and time when the activity is scheduled to start."
      },
      "assigned_to": {
        "label": "Assigned To",
        "description": "The user assigned to this activity schedule."
      },
      "allowed_courses": {
        "label": "Allowed Courses",
        "description": "Courses that are allowed to access this activity schedule."
      },
      "attendees": {
        "label": "Attendees",
        "description": "Students attending this activity schedule."
      }
    }
  },
  "de": {
    "mark_as_completed": "Als abgeschlossen markieren",
    "mark_as_completed_title": "Termin als abgeschlossen markieren",
    "mark_as_completed_description": "Dieser Termin wird als abgeschlossen markiert. Für die teilnehmenden wird eine Teilnahmebestätigung erstellt.",
    "mark_as_canceled": "Als abgesagt markieren",
    "mark_as_canceled_title": "Termin als abgesagt markieren",
    "mark_as_canceled_description": "Dieser Termin wird als abgesagt markiert. Für die teilnehmenden wird keine Teilnahmebestätigung erstellt.",
    "cancel": "Abbrechen",
    "form": {
      "start_at": {
        "label": "Startzeit",
        "description": "Das Datum und die Uhrzeit, zu der die Aktivität beginnen soll."
      },
      "assigned_to": {
        "label": "Zugewiesen an",
        "description": "Der Benutzer, der diesem Aktivitätsplan zugewiesen ist."
      },
      "allowed_courses": {
        "label": "Erlaubte Kurse",
        "description": "Kurse, die auf diesen Aktivitätsplan zugreifen dürfen."
      },
      "attendees": {
        "label": "Teilnehmer",
        "description": "Schüler, die an diesem Aktivitätsplan teilnehmen."
      }
    }
  }
}
</i18n>
