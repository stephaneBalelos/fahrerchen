<template>
  <UDashboardPage>
    <UDashboardPanel :width="300">
      <UDashboardNavbar :title="t('schedules')">
        <template #right>
          <!-- <UButtonGroup v-model="selectedView" :options="views" size="sm" /> -->
          dsad
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="p-0"> dasd </UDashboardPanelContent>
    </UDashboardPanel>
    <UDashboardPanel v-model="isPanelOpen" grow collapsible side="right">
      <template v-if="selectedScheduleId">
        <UDashboardNavbar :title="'Schedule Details'">
          <template #toggle>
            <UButton
              icon="i-heroicons-arrow-left-solid"
              color="black"
              variant="ghost"
              @click="selectedScheduleId = null"
            />
          </template>
        </UDashboardNavbar>
        <UDashboardPanelContent>
          <ScheduleView :schedule-id="selectedScheduleId" />
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
        <UDashboardPanelContent>
          <div class="bg-cyan-400">
            <div
              v-for="(schedule, index) in schedules"
              :key="index"
              @click="selectedScheduleId = schedule.id"
            >
              {{ schedule.id }} - {{ schedule.status }}
            </div>
          </div>
        </UDashboardPanelContent>
      </template>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import * as z from "zod";
import EditCourseActivitySchedule from "~/components/forms/EditCourseActivitySchedule.vue";
import ScheduleView from "~/components/schedules/ScheduleView.vue";

const { t } = useI18n({
  useScope: "local",
});
const route = useRoute();
const isPanelOpen = ref(true);
const $courseActivitySchedules = useCourseActivitySchedules();

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
  () =>
    $courseActivitySchedules.fetchCourseActivitySchedules({
      ...filterForm.value,
    }),
  {
    immediate: true,
    watch: [filterForm],
  }
);

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
  });
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
