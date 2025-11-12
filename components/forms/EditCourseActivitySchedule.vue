<template>
  <UDashboardSlideover
    id="edit-activity-schedule"
    ref="slideover"
    :title="props.scheduleId ? t('edit_schedule') : t('add_schedule')"
  >
    <UForm ref="form" :state="state" :schema="schema" @submit="onSubmit">
      <UDashboardSection
        :title="
          selectedActivity ? selectedActivity.name : t('activity_schedule')
        "
        :description="
          props.scheduleId
            ? t('edit_course_activity_schedule')
            : t('add_course_activity_schedule')
        "
      >
        <template #links>
          <UButton
            v-if="data && data.status === 'PLANNED' && data.assigned_to"
            color="green"
            @click="markScheduleAsCompleted"
          >
            {{ t("mark_as_completed") }}
          </UButton>
        </template>
        <UFormGroup
          v-if="organizationStore.selectedOrganization"
          name="activity_id"
          :label="t('form.activity.label')"
          :description="t('form.activity.description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <FormsInputsCourseActivitySelect
            v-if="!data"
            v-model="state.activity_id"
            :org-id="organizationStore.selectedOrganization.id"
            :course-id="props.courseId"
          />
          <div v-else class="flex items-center">
            <UAvatar icon="i-heroicons-document-text" size="sm" />
            <span class="truncate font-semibold ms-3">{{
              selectedActivity ? selectedActivity.name : state.activity_id
            }}</span>
          </div>
        </UFormGroup>
        <UFormGroup
          v-if="organizationStore.selectedOrganization"
          name="assigned_to"
          :label="t('form.assigned_to.label')"
          :description="t('form.assigned_to.description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <FormsInputsUserSelect
            v-model="state.assigned_to"
            :orgid="organizationStore.selectedOrganization.id"
            :variant="'solid'"
            :color="'white'"
          />
        </UFormGroup>
        <UFormGroup
          name="start_at"
          :label="t('form.start_at.label')"
          :description="t('form.start_at.description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <div class="grid grid-cols-2 gap-4">
            <UPopover
              :popper="{ placement: 'bottom-start' }"
            >
              <div class="w-full">
                <UButton
                  block
                  color="white"
                  variant="solid"
                  icon="i-heroicons-calendar-days-20-solid"
                  :size="'md'"
                  :label="format(new Date(state.start_at), 'd MMM, yyy')"
                />
              </div>
              <template #panel="">
                <DatePicker
                  v-model="state.start_at"
                  is-required
                  :mode="'dateTime'"
                />
              </template>
            </UPopover>
            <UPopover :popper="{ placement: 'bottom-start' }">
              <div class="w-full">
                <UButton
                  block
                  color="white"
                  variant="solid"
                  icon="i-heroicons-clock"
                  :size="'md'"
                  :label="format(new Date(state.start_at), 'HH:mm a')"
                />
              </div>
              <template #panel="">
                <DatePicker
                  v-model="state.start_at"
                  is-required
                  :mode="'time'"
                />
              </template>
            </UPopover>
          </div>
        </UFormGroup>
        <UFormGroup
          v-if="subscriptionId"
          :label="t('form.activity_attendees.label')"
          :description="t('form.activity_attendees.description')"
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
        <StudentsCourseSubscriptionListItem
          :subscription-id="subscriptionId"
        />
        </UFormGroup>
      </UDashboardSection>
    </UForm>

    <template #footer>
      <UButton @click="form?.submit()">
        {{ t("save") }}
      </UButton>
      <UButton
        v-if="props.scheduleId && data && data.status === 'CANCELED'"
        color="red"
        variant="ghost"
        @click="deleteCourseActivitySchedule(props.scheduleId)"
      >
        {{ t("delete") }}
      </UButton>
      <UButton
        v-if="data && data.status === 'PLANNED'"
        color="red"
        variant="ghost"
        @click="markScheduleAsCanceled"
      >
        {{ t("mark_as_canceled") }}
      </UButton>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { CourseActivityScheduleEdit } from "~/types/app.types";
import type { Database } from "~/types/database.types";
import type { Form, FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import { format } from "date-fns";
import DatePicker from "./Inputs/Datepicker.vue";
import ConfirmModal from "../ui/Modals/ConfirmModal.vue";

type Props = {
  scheduleId?: string;
  date?: Date;
  subscriptionId?: string;
  courseId?: string;
};

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "schedule-saved" | "schedule-deleted", schedule_id: string): void;
}>();
const toast = useToast();
const modal = useModal();
const organizationStore = useUserOrganizationsStore();
const courseActivitiesStore = useCourseActivitiesStore();
const $courseActivitySchedules = useCourseActivitySchedules();

const { t } = useI18n({
  useScope: "local",
});

const { data, refresh } = await useAsyncData(async () => {
  if (!props.scheduleId) {
    return null;
  }
  const schedule =
    await $courseActivitySchedules.fetchCourseActivitySchedulesById(
      props.scheduleId
    );
  return schedule;
});

const schema = z
  .object({
    activity_id: z.string().uuid({message: t("form.activity.errors.required")}),
    assigned_to: z.string().uuid({message: t("form.assigned_to.errors.required")}).optional(),
    start_at: z.date(),
    duration_minutes: z.number().min(15).max(240).default(45),
  })

type Schema = z.infer<typeof schema>;

const form = ref<Form<Schema>>();

const state = reactive<Schema>({
  start_at: data.value?.start_at
    ? new Date(data.value.start_at)
    : props.date ?? new Date(),
  duration_minutes: data.value?.duration_minutes ?? 45,
  activity_id: data.value?.activity_id ?? "",
  assigned_to: data.value?.assigned_to ?? undefined,
});

const selectedActivity = computed(() => {
  return courseActivitiesStore.courseActivities.find(
    (a) => a.id === state.activity_id
  );
});

function onSubmit(_event: FormSubmitEvent<Schema>) {
  const d: CourseActivityScheduleEdit = {
    activity_id: state.activity_id,
    assigned_to: state.assigned_to ?? null,
    start_at: state.start_at.toISOString(),
    duration_minutes: 45, // default duration of 45 minutes
    status: data.value?.status ?? "PLANNED",
  };

  if (props.scheduleId) {
    // update the course activity schedule
    updateCourseActivitySchedule(props.scheduleId, d);
  } else {
    // create a new course activity schedule
    createCourseActivitySchedule(d);
  }
}

async function createCourseActivitySchedule(data: CourseActivityScheduleEdit) {
  try {
    const schedule =
      await $courseActivitySchedules.createCourseActivitySchedule(data);

    if (!schedule) {
      throw new Error("Failed to create course activity schedule");
    }
    toast.add({
      title: t("success.created.title"),
      description: t("success.created.description"),
      color: "green",
    });
    emits("schedule-saved", schedule.id);
  } catch (error) {
    console.error(error);
    toast.add({
      title: t("errors.failed_to_create.title"),
      description: t("errors.failed_to_create.description"),
      color: "red",
    });
  }
}

async function updateCourseActivitySchedule(
  id: string,
  data: CourseActivityScheduleEdit
) {
  try {
    const schedule =
      await $courseActivitySchedules.updateCourseActivitySchedule(id, {
        assigned_to: data.assigned_to,
        start_at: data.start_at,
        duration_minutes: data.duration_minutes
      });

    if (!schedule) {
      throw new Error("Failed to update course activity schedule");
    }
    toast.add({
        title: t("success.updated.title"),
        description: t("success.updated.description"),
        color: "green",
      });
      emits("schedule-saved", schedule.id);
    
  } catch (error) {
    console.error(error);
    toast.add({
      title: t("errors.failed_to_update.title"),
      description: t("errors.failed_to_update.description"),
      color: "red",
    });
  }
}

async function deleteCourseActivitySchedule(id: string) {
  try {
    modal.open(ConfirmModal, {
      title: t("delete_course_activity_schedule"),
      description: t("delete_course_activity_schedule_description"),
      confirmLabel: t("delete"),
      cancelLabel: t("cancel"),
      action: async () => {
        const result =
          await $courseActivitySchedules.deleteCourseActivitySchedule(id);
        if (!result) {
          throw new Error("Failed to delete course activity schedule");
        }
        emits("schedule-deleted", id);
      },
    });
  } catch (error) {
    console.error(error);
  }
}

async function markScheduleAsCompleted() {
  if (!props.scheduleId) {
    return;
  }
  modal.open(ConfirmModal, {
    title: t("confirm_mark_as_completed"),
    description: t("confirm_mark_as_completed_description"),
    confirmLabel: t("yes"),
    cancelLabel: t("no"),
    action: async () => {
      await updateScheduleStatus("COMPLETED");
    },
  });
}

async function markScheduleAsCanceled() {
  if (!props.scheduleId) {
    return;
  }
  modal.open(ConfirmModal, {
    title: t("confirm_mark_as_canceled"),
    description: t("confirm_mark_as_canceled_description"),
    confirmLabel: t("yes"),
    cancelLabel: t("no"),
    action: async () => {
      await updateScheduleStatus("CANCELED");
    },
  });
}

async function updateScheduleStatus(
  status: Database["public"]["Enums"]["schedule_status"]
) {
  if (!props.scheduleId) {
    return;
  }
  try {
    const schedule = await $courseActivitySchedules.updateCourseActivitySchedule(
      props.scheduleId,
      { status }
    );

    if (!schedule) {
      throw new Error("Failed to update course activity schedule");
    }
    refresh();
    emits("schedule-saved", schedule.id);
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
    "add_schedule": "Termin hinzufügen",
    "activity_schedule": "Aktivitätstermin",
    "edit_course_activity_schedule": "Bearbeiten Sie den Kursaktivitätstermin",
    "add_course_activity_schedule": "Fügen Sie den Kursaktivitätstermin hinzu",
    "activity_attendees": "Aktivitätsteilnehmer",
    "edit_course_activity_attendees": "Bearbeiten Sie die Kursaktivitätsteilnehmer",
    "mark_as_completed": "Als abgeschlossen markieren",
    "confirm_mark_as_completed": "Termin als abgeschlossen markieren",
    "confirm_mark_as_completed_description": "Alle Teilnehmer dieses Termins werden als anwesend markiert und die Aktivität wird abgerechnet. Möchten Sie fortfahren?",
    "mark_as_canceled": "Als storniert markieren",
    "confirm_mark_as_canceled": "Termin als storniert markieren",
    "confirm_mark_as_canceled_description": "Möchten Sie diesen Termin wirklich als storniert markieren?",
    "form": {
      "activity": {
        "label": "Aktivität",
        "description": "Wählen Sie die Aktivität aus, die für diesen Termin geplant ist.",
        "placeholder": "Wählen Sie eine Aktivität aus",
        "errors": {
          "required": "Die Aktivität ist erforderlich."
        }
      },
      "assigned_to": {
        "label": "Zugewiesen an",
        "description": "Wählen Sie den Benutzer aus, der für diese Aktivität verantwortlich ist.",
        "placeholder": "Wählen Sie einen Benutzer aus",
        "errors": {
          "required": "Der Benutzer ist erforderlich."
        }
      },
      "start_at": {
        "label": "Startzeit",
        "description": "Wählen Sie die Startzeit für diese Aktivität aus.",
        "placeholder": "Wählen Sie die Startzeit aus",
        "errors": {
          "invalid_range": "Die Startzeit kann nicht nach der Endzeit liegen."
        }
      },
      "duration_minutes": {
        "label": "Dauer (Minuten)",
        "description": "Geben Sie die Dauer dieser Aktivität in Minuten an.",
        "placeholder": "Dauer in Minuten",
        "errors": {
          "min": "Die Dauer muss mindestens 15 Minuten betragen.",
          "max": "Die Dauer darf maximal 240 Minuten betragen."
        }
      },
      "activity_attendees": {
        "label": "Aktivitätsteilnehmer",
        "description": "Folgende Teilnehmer werden an dieser Aktivität teilnehmen."
      }
    },
    "save": "Speichern",
    "delete": "Löschen",
    "cancel": "Abbrechen",
    "success": {
      "created": {
        "title": "Termin erstellt",
        "description": "Der Kursaktivitätstermin wurde erfolgreich erstellt."
      },
      "updated": {
        "title": "Termin aktualisiert",
        "description": "Der Kursaktivitätstermin wurde erfolgreich aktualisiert."
      }
    },
    "errors": {
      "failed_to_create": {
        "title": "Fehler beim Erstellen",
        "description": "Der Kursaktivitätstermin konnte nicht erstellt werden."
      },
      "failed_to_update": {
        "title": "Fehler beim Aktualisieren",
        "description": "Der Kursaktivitätstermin konnte nicht aktualisiert werden."
      }
    },
    "delete_course_activity_schedule": "Kursaktivitätstermin löschen",
    "delete_course_activity_schedule_description": "Möchten Sie diesen Kursaktivitätstermin wirklich löschen?"
  },
  "en": {
    "edit_schedule": "Edit schedule",
    "add_schedule": "Add schedule",
    "activity_schedule": "Activity schedule",
    "edit_course_activity_schedule": "Edit course activity schedule",
    "add_course_activity_schedule": "Add course activity schedule",
    "activity_attendees": "Activity attendees",
    "edit_course_activity_attendees": "Edit course activity attendees",
    "mark_as_completed": "Mark as completed",
    "mark_as_canceled": "Mark as canceled",
    "form": {
      "activity": {
        "label": "Activity",
        "description": "Select the activity to be scheduled for this date.",
        "placeholder": "Select an activity",
        "errors": {
          "required": "The activity is required."
        }
      },
      "assigned_to": {
        "label": "Assigned to",
        "description": "Select the user responsible for this activity.",
        "placeholder": "Select a user",
        "errors": {
          "required": "The user is required."
        }
      },
      "start_at": {
        "label": "Start time",
        "description": "Select the start time for this activity.",
        "placeholder": "Select start time",
        "errors": {
          "invalid_range": "The start time cannot be after the end time."
        }
      },
      "duration_minutes": {
        "label": "Duration (minutes)",
        "description": "Enter the duration of this activity in minutes.",
        "placeholder": "Duration in minutes",
        "errors": {
          "min": "The duration must be at least 15 minutes.",
          "max": "The duration must be at most 240 minutes."
        }
      },
      "activity_attendees": {
        "label": "Activity attendees",
        "description": "The following attendees will participate in this activity."
      }
    },
    "save": "Save",
    "delete": "Delete",
    "cancel": "Cancel",
    "success": {
      "created": {
        "title": "Schedule created",
        "description": "The course activity schedule has been created successfully."
      },
      "updated": {
        "title": "Schedule updated",
        "description": "The course activity schedule has been updated successfully."
      }
    },
    "errors": {
      "failed_to_create": {
        "title": "",
        "description": ""
      }
    }
  }
}
</i18n>
