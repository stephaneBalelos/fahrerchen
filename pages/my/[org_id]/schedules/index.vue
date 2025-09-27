<template>
  <UDashboardPage>
    <UDashboardPanel :width="300">
      <UDashboardNavbar :title="t('schedules')">
        <template #right>
          <!-- <UButtonGroup v-model="selectedView" :options="views" size="sm" /> -->
          dsad
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="p-0">
        dasd
      </UDashboardPanelContent>
    </UDashboardPanel>
    <UDashboardPanel v-model="isPanelOpen" grow collapsible side="right">
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
      <UDashboardPanelContent>
        <div class="bg-cyan-400">
          <div v-for="schedule, index in schedules" :key="index">
            {{ schedule.id }} - {{ schedule.status }}
          </div>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import * as z from "zod";
import EditCourseActivitySchedule from "~/components/forms/EditCourseActivitySchedule.vue";

const { t } = useI18n({
  useScope: "local",
});

const isPanelOpen = ref(true);

const $courseActivitySchedules = useCourseActivitySchedules();

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
  () =>
    $courseActivitySchedules.fetchCourseActivitySchedules({
      ...filterForm.value,
    }),
  {
    immediate: true,
    watch: [filterForm]
  }
)

const openEditScheduleSlideover = (scheduleId?: string) => {
  const slideover = useSlideover();
  slideover.open(EditCourseActivitySchedule, {
    scheduleId: scheduleId || undefined,
    "onActivity-deleted": () => {
      refresh();
    },
    "onActivity-saved": () => {
      refresh();
    },
  })
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "list_view": "Liste Ansicht",
    "calendar_view": "Kalender Ansicht",
    "schedules": "Alle Termine",
    "no_schedule_found": "Keine Termine gefunden",
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
