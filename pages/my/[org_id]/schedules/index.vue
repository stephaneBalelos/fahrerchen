<template>
  <UDashboardPage>
    <UDashboardPanel id="schedule-details" grow>
      <template v-if="selectedScheduleId">
        <UDashboardNavbar>
          <template #toggle>
            <UButton
              icon="i-heroicons-arrow-left-solid"
              color="black"
              variant="ghost"
              @click="selectedScheduleId = null"
            />
          </template>
          <template #title>
            {{ t("schedule_details") }}
          </template>
          <template #right>
            <div class="flex items-center space-x-2">
              <UButton
                icon="i-heroicons-pencil-square"
                color="white"
                @click="
                  openEditScheduleSlideover({ scheduleId: selectedScheduleId })
                "
              />
              <UButton
                color="red"
                variant="soft"
                icon="i-heroicons-trash"
                @click="deleteSchedule(selectedScheduleId)"
              />
            </div>
          </template>
        </UDashboardNavbar>
        <UDashboardPanelContent>
          <div class="flex-1">
            <ScheduleView :schedule-id="selectedScheduleId" />
          </div>
        </UDashboardPanelContent>
      </template>
      <template v-else>
        <UDashboardNavbar :title="'Calendar View'">
          <template #right>
            <UButton
              icon="i-heroicons-plus-circle-solid"
              color="primary"
              label="Neuen Termin erstellen"
              @click="openEditScheduleSlideover()"
            />
          </template>
        </UDashboardNavbar>
        <UDashboardPanelContent class="p-0">
          <CalendarAppCalendar
            :selected-date="selectedDate"
            :events="schedules || []"
            @create-schedule="(date) => openEditScheduleSlideover({ date })"
            @select-date="(date) => (selectedDate = date)"
            @edit-schedule="(id) => navigateTo({ query: { id } })"
          />
        </UDashboardPanelContent>
      </template>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { AppCalendarEvent } from "~/components/calendar/AppCalendar.vue";
import EditCourseActivitySchedule from "~/components/forms/EditCourseActivitySchedule.vue";
import ScheduleView from "~/components/schedules/ScheduleView.vue";
import ConfirmModal from "~/components/ui/Modals/ConfirmModal.vue";

const { t } = useI18n({
  useScope: "local",
});
const route = useRoute();
// const isPanelOpen = ref(true);
const $courseActivitySchedules = useCourseActivitySchedules();
const modal = useModal();
const slideover = useSlideover();

const selectedDate = ref(new Date());

const selectedScheduleId = computed<string | null>({
  get() {
    return (route.query.id as string) || null;
  },
  set(value) {
    const query = { ...route.query };
    if (value) {
      query.id = value;
    } else {
      delete query.id;
    }
    navigateTo({ path: route.path, query });
  },
});

const _schema = z.object({
  assigned_to: z.string().uuid().optional(),
  course_id: z.string().uuid().optional(),
  student_id: z.string().uuid().optional(),
  status: z.enum(["PLANNED", "CANCELED", "COMPLETED"]).optional(),
});

type FilterForm = z.infer<typeof _schema>;

const filterForm = ref<FilterForm>({
  assigned_to: undefined,
  course_id: undefined,
  student_id: undefined,
  status: undefined,
});

const { data: schedules, refresh } = useAsyncData(
  "course-activity-schedules",
  async () =>
    await $courseActivitySchedules.fetchCourseActivitySchedules({
      ...filterForm.value,
    }),
  {
    watch: [filterForm],
    transform: (data) => {
      if (!data) return [];
      return data?.map((s) => {
        const event: AppCalendarEvent = {
          id: s.id,
          label: s.activity.name,
          date: new Date(s.start_at),
          duration: s.duration_minutes,
          schedule: s,
          type: s.activity.activity_type,
        };
        return event;
      });
    },
  }
);

const openEditScheduleSlideover = ({
  scheduleId,
  date,
}: { scheduleId?: string; date?: Date } = {}) => {
  slideover.open(EditCourseActivitySchedule, {
    scheduleId: scheduleId || undefined,
    date,
    "onSchedule-deleted": () => {
      refresh();
    },
    "onSchedule-saved": () => {
      refresh();
    },
  });
};

const deleteSchedule = async (scheduleId: string) => {
  modal.open(ConfirmModal, {
    title: t("delete_schedule_confirm_title"),
    description: t("delete_schedule_confirm_description"),
    confirmLabel: t("delete"),
    cancelLabel: t("cancel"),
    action: async () => {
      await $courseActivitySchedules.deleteCourseActivitySchedule(scheduleId);
      if (selectedScheduleId.value === scheduleId) {
        selectedScheduleId.value = null;
      }
      refresh();
    },
  });
};

watch(selectedScheduleId, async () => {
  await refresh();
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "list_view": "Liste Ansicht",
    "calendar_view": "Kalender Ansicht",
    "schedules": "Alle Termine",
    "no_schedule_found": "Keine Termine gefunden",
    "schedule_details": "Termin Details",
    "edit_schedule": "Termin bearbeiten",
    "delete_schedule_confirm_title": "Termin löschen",
    "delete_schedule_confirm_description": "Sind Sie sicher, dass Sie diesen Termin löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
    "delete": "Löschen",
    "cancel": "Abbrechen",
    "form": {
      "assigned_to": {
        "label": "Zugewiesen an",
        "description": "Filtern Sie nach dem Benutzer, dem der Termin zugewiesen ist."
      },
      "status": {
        "label": "Status",
        "placeholder": "Status auswählen",
        "description": "Filtern Sie nach dem Status."
      },
      "course": {
        "label": "Kurs",
        "description": "Filtern Sie nach dem Kurs."
      },
      "student": {
        "label": "Schüler",
        "description": "Filtern Sie nach dem Schüler."
      }
    }
  },
  "en": {
    "list_view": "List view",
    "calendar_view": "Calendar view",
    "schedules": "All Schedules",
    "no_schedule_found": "No schedules found",
    "schedule_details": "Schedule Details",
    "edit_schedule": "Edit Schedule",
    "delete_schedule_confirm_title": "Delete Schedule",
    "delete_schedule_confirm_description": "Are you sure you want to delete this schedule? This action cannot be undone.",
    "delete": "Delete",
    "cancel": "Cancel",
    "form": {
      "assigned_to": {
        "label": "Assigned to",
        "description": "Filter by the user the schedule is assigned to."
      },
      "status": {
        "label": "Status",
        "placeholder": "Choose a Status",
        "description": "Filter by the status."
      },
      "course": {
        "label": "Course",
        "description": "Filter by the course."
      },
      "student": {
        "label": "Student",
        "description": "Filter by the student."
      }
    }
  }
}
</i18n>
