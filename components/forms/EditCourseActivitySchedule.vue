<template>
  <UDashboardSlideover
    id="edit-activity-schedule"
    ref="slideover"
    :title="props.scheduleId ? t('edit_schedule') : t('add_schedule')"
  >
    <UTabs :items="tabs" class="w-full">
      <template #item="{ item }">
        <UForm v-if="item.key == 'schedule'" ref="form" :state="state" :schema="schema" @submit="onSubmit">
          <UDashboardSection
            :title="t('activity_schedule')"
            :description="
              props.scheduleId
                ? t('edit_course_activity_schedule')
                : t('add_course_activity_schedule')
            "
          >
          <template #links>
            <UButton v-if="data && data.status === 'PLANNED'" color="green" @click="updateScheduleStatus('COMPLETED')">
              {{ t("mark_as_completed") }}
            </UButton>
            <UButton v-if="data && data.status === 'PLANNED'" color="red" variant="ghost" @click="updateScheduleStatus('CANCELED')">
              {{ t("mark_as_canceled") }}
            </UButton>
          </template>
            <UFormGroup
              name="activity_id"
              :label="t('from.activity.label')"
              :description="t('from.activity.description')"
              required
              class="grid grid-cols-1 gap-4 items-center"
              :ui="{ container: '' }"
            >
              <USelectMenu
                v-model="state.activity_id"
                :options="course_activities"
                value-attribute="id"
                label-attribute="name"
                :disabled="!!props.scheduleId"
              >
                <template #label>
                  <div v-if="state.activity_id && course_activities">
                    <span class="truncate">{{
                      course_activities.find((a) => a.id === state.activity_id)
                        ?.name
                    }}</span>
                  </div>
                  <div v-else>
                    <span class="truncate">
                      {{ t("form.select_activity.placeholder") }}
                    </span>
                  </div>
                </template>
                <template #option="{ option }">
                  <span class="truncate">{{ option.name }}</span>
                </template>
              </USelectMenu>
            </UFormGroup>
            <UFormGroup
              name="assigned_to"
              :label="t('from.assigned_to.label')"
              :description="t('from.assigned_to.description')"
              required
              class="grid grid-cols-1 gap-4 items-center"
              :ui="{ container: '' }"
            >
              <FormsInputsUserSelect
                v-model="state.assigned_to"
                :orgid="props.orgid"
              />
            </UFormGroup>
            <UFormGroup
              name="start_at"
              :label="t('from.start_at.label')"
              :description="t('from.start_at.description')"
              required
              class="grid grid-cols-1 gap-4 items-center"
              :ui="{ container: '' }"
            >
              <div class="grid grid-cols-2 gap-4">
                <UPopover
                  class="col-span-2"
                  :popper="{ placement: 'bottom-start' }"
                >
                  <div class="w-full">
                    <UButton
                      block
                      color="white"
                      variant="solid"
                      icon="i-heroicons-calendar-days-20-solid"
                      :label="format(new Date(state.start_at), 'd MMM, yyy')"
                    />
                  </div>
                  <template #panel="">
                    <DatePicker
                      v-model="state.start_at"
                      is-required
                      :mode="'dateTime'"
                      @update:model-value="onUpdateStartDate"
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
                      :label="format(new Date(state.start_at), 'HH:mm a')"
                    />
                  </div>
                  <template #panel="">
                    <DatePicker
                      v-model="state.start_at"
                      is-required
                      :mode="'time'"
                      @update:model-value="onUpdateStartDate"
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
                      :label="format(new Date(state.end_at), 'HH:mm a')"
                    />
                  </div>
                  <template #panel="">
                    <DatePicker
                      v-model="state.end_at"
                      is-required
                      :mode="'time'"
                    />
                  </template>
                </UPopover>
              </div>
            </UFormGroup>
          </UDashboardSection>
        </UForm>
        <AddStudentsAttendanceForm
          v-else-if="item.key == 'attendees' && data"
          :courseid="props.courseid"
          :course-activity-schedule="data"
        />
      </template>
    </UTabs>

    <template #footer>
      <UButton @click="form?.submit()">
        {{ t("save") }}
      </UButton>
      <UButton
        v-if="props.scheduleId"
        color="red"
        variant="ghost"
        @click="deleteCourseActivitySchedule(props.scheduleId)"
      >
        {{ t("delete") }}
      </UButton>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type {
  AppCourseActivitySchedule,
  AppScheduleType,
} from "~/types/app.types";
import type { Database } from "~/types/database.types";
import type { Form, FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import { addHours, format } from "date-fns";
import DatePicker from "./Inputs/Datepicker.vue";
import { useCourseActivities } from "~/composables/useCourseActivities";
import ConfirmModal from "../ui/Modals/ConfirmModal.vue";
import AddStudentsAttendanceForm from "./AddStudentsAttendanceForm.vue";

type CourseActivityScheduleEdit = Omit<
  AppCourseActivitySchedule,
  "id" | "organization_id" | "status" | "attendees"
>;

type RepeatMode = AppScheduleType;

const _repeatOptions = [
  { label: "Once", value: "ONCE" },
  { label: "Daily", value: "DAILY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Yearly", value: "YEARLY" },
] as { label: string; value: RepeatMode }[];

const _dayOfWeekOptions = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
];

type Props = {
  orgid: string;
  scheduleId?: string;
  courseid: string;
  activityid: string;
  date?: Date;
};

const tutorialStore = useTutorialStore();

const props = defineProps<Props>();
const emits = defineEmits(["activity-saved", "activity-deleted"]);
const toast = useToast();
const modal = useModal();
const client = useSupabaseClient();
const course_activities = await useCourseActivities(
  props.orgid,
  props.courseid
);

const { t } = useI18n({
  useScope: "local",
});

const { data, refresh } = await useAsyncData(async () => {
  if (!props.scheduleId) {
    return null;
  }
  const { data, error } = await client
    .from("course_activity_schedules")
    .select("*")
    .eq("id", props.scheduleId)
    .single();
  if (error) {
    throw error;
  }
  return data;
});

const tabs = computed(() => [
  {
    key: "schedule",
    label: t("activity_schedule"),
    description: t("edit_course_activity_schedule"),
  },
  {
    key: "attendees",
    label: t("activity_attendees"),
    description: t("edit_course_activity_attendees"),
    disabled: !data.value,
  },
]);

const courseActivitySchedules = useCourseActivitySchedules();

const schema = z
  .object({
    activity_id: z.string().uuid(),
    assigned_to: z.string().uuid().optional(),
    start_at: z.date(),
    end_at: z.date(),
  })
  .superRefine((data, ctx) => {
    if (data.start_at > data.end_at) {
      ctx.addIssue({
        path: ["start_at"],
        code: z.ZodIssueCode.custom,
        message: t("from.start_at.errors.invalid_range"),
      });
      return z.NEVER;
    }
    return true;
  });

type Schema = z.infer<typeof schema>;

const form = ref<Form<Schema>>();

const state = reactive<Schema>({
  start_at: data.value?.start_at
    ? new Date(data.value.start_at)
    : props.date ?? new Date(),
  end_at: data.value?.end_at ? new Date(data.value.end_at) : addHours(new Date(), 1),
  activity_id: props.activityid,
  assigned_to: data.value?.assigned_to ?? undefined,
});

function onSubmit(_event: FormSubmitEvent<Schema>) {
  const data: CourseActivityScheduleEdit = {
    activity_id: state.activity_id,
    course_id: props.courseid,

    assigned_to: state.assigned_to ?? null,
    start_at: state.start_at.toISOString(),
    end_at: state.end_at.toISOString(),
  };

  if (props.scheduleId) {
    // update the course activity schedule
    updateCourseActivitySchedule(props.scheduleId, data);
  } else {
    // create a new course activity schedule
    createCourseActivitySchedule(data);
  }
}

async function createCourseActivitySchedule(data: CourseActivityScheduleEdit) {
  try {
    const { error } = await client
      .from("course_activity_schedules")
      .insert({
        ...data,
        organization_id: props.orgid,
      })
      .select();

    if (error) {
      throw new Error("Failed to create course activity schedule");
    } else {
      toast.add({
        title: t("success.created.title"),
        description: t("success.created.description"),
        color: "green",
      });
      emits("activity-saved");
      tutorialStore.completeStep("activity_schedule_create");
    }
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
    const { error } = await client
      .from("course_activity_schedules")
      .update({
        assigned_to: data.assigned_to,
        start_at: data.start_at,
        end_at: data.end_at,
      })
      .eq("id", id)
      .select();

    if (error) {
      throw new Error("Failed to update course activity schedule");
    } else {
      toast.add({
        title: t("success.updated.title"),
        description: t("success.updated.description"),
        color: "green",
      });
      emits("activity-saved");
    }
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
          await courseActivitySchedules.deleteCourseActivitySchedule(id);
        if (!result) {
          throw new Error("Failed to delete course activity schedule");
        }
        emits("activity-deleted");
      },
    });
  } catch (error) {
    console.error(error);
  }
}

async function updateScheduleStatus(status: Database["public"]["Enums"]["schedule_status"]) {
  if (!props.scheduleId) {
    return;
  }
  try {
    const { error } = await client
      .from("course_activity_schedules")
      .update({ status })
      .eq("id", props.scheduleId)

    if (error) {
      throw new Error("Failed to update course activity schedule");
    }
    refresh();
    emits("activity-saved");
  } catch (error) {
    console.error(error);
  }
}

function onUpdateStartDate(date: Date) {
  state.start_at = date;
  state.end_at = addHours(date, 1);
}

function _onChangeRepeat(value: RepeatMode) {
  console.log("Change repeat", value);
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
    "mark_as_canceled": "Als storniert markieren",
    "from": {
      "activity": {
        "label": "Aktivität",
        "description": "Wählen Sie die Aktivität aus, die für diesen Termin geplant ist."
      },
      "assigned_to": {
        "label": "Zugewiesen an",
        "description": "Wählen Sie den Benutzer aus, der für diese Aktivität verantwortlich ist."
      },
      "start_at": {
        "label": "Startzeit",
        "description": "Wählen Sie die Startzeit für diese Aktivität aus.",
        "placeholder": "Wählen Sie die Startzeit aus",
        "errors": {
          "invalid_range": "Die Startzeit kann nicht nach der Endzeit liegen."
        }
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
    "from": {
      "activity": {
        "label": "Activity",
        "description": "Select the activity to be scheduled for this date."
      },
      "assigned_to": {
        "label": "Assigned to",
        "description": "Select the user responsible for this activity."
      },
      "start_at": {
        "label": "Start time",
        "description": "Select the start time for this activity.",
        "placeholder": "Select start time",
        "errors": {
          "invalid_range": "The start time cannot be after the end time."
        }
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
