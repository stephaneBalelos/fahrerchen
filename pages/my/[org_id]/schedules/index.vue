<template>
  <UDashboardPanel grow>
    <UDashboardToolbar>
      <p class="text-lg font-semibold">{{ t("schedules") }}</p>
      <USelectMenu
        v-model="selectedView"
        :options="views"
        :option-attribute="'label'"
        :value-attribute="'value'"
      />
    </UDashboardToolbar>
    <div class="flex h-full">
      <UDashboardPanel v-if="userOrganizationsStore.selectedOrganization" :width="400">
        <UDashboardPanelContent class="gap-4">
          <UDashboardCard>
            <FormsInputsDatepicker
              v-if="schedulesForMonth"
              v-model="selectedDate"
              expanded
              :dates-highlighted="
                schedulesForMonth.map((schedule) => new Date(schedule.start_at))
              "
            />
          </UDashboardCard>
          <UDashboardCard>
            <UFormGroup
              :label="t('form.assigned_to.label')"
              :help="t('form.assigned_to.description')"
              name="assigned_to"
            >
              <template #hint>
                <UButton
                  v-if="filterForm.assigned_to"
                  icon="i-heroicons-x-mark-solid"
                  size="2xs"
                  color="gray"
                  square
                  variant="ghost"
                  @click="filterForm.assigned_to = undefined"
                />
              </template>
              <FormsInputsUserSelect
                v-model="filterForm.assigned_to"
                :orgid="userOrganizationsStore.selectedOrganization.organization_id"
              />
            </UFormGroup>
          </UDashboardCard>
          <UDashboardCard>
            <UFormGroup
              :label="t('form.status.label')"
              :help="t('form.status.description')"
              name="course_id"
            >
            <template #hint>
                <UButton
                  v-if="filterForm.status"
                  icon="i-heroicons-x-mark-solid"
                  size="2xs"
                  color="gray"
                  square
                  variant="ghost"
                  @click="filterForm.status = undefined"
                />
              </template>
              <USelectMenu
                v-model="filterForm.status"
                :options="SCHEDULES_STATUS"
              >
                <template #label>
                  <span v-if="filterForm.status">
                    {{
                      g(
                        `courses.activities.schedules.schedules_status_${filterForm.status}`
                      )
                    }}
                  </span>
                  <span 
                  v-else 
                  class="text-gray-500"
                  >{{ t("form.status.placeholder") }}</span>
                </template>
                <template #option="{ option }">
                  {{
                    g(
                      `courses.activities.schedules.schedules_status_${option}`
                    )
                  }}
                </template>
              </USelectMenu>
            </UFormGroup>
          </UDashboardCard>
          <UDashboardCard>
            <UFormGroup
              :label="t('form.course.label')"
              :description="t('form.course.description')"
              name="course_id"
            >
            <template #hint>
                <UButton
                  v-if="filterForm.course_id"
                  icon="i-heroicons-x-mark-solid"
                  size="2xs"
                  color="gray"
                  square
                  variant="ghost"
                  @click="filterForm.course_id = undefined"
                />
              </template>
              <FormsInputsCourseSelect
                v-model="filterForm.course_id"
                :orgid="userOrganizationsStore.selectedOrganization.organization_id"
              />
            </UFormGroup>
          </UDashboardCard>
          <UDashboardCard>
            <UFormGroup
              :label="t('form.student.label')"
              :description="t('form.student.description')"
              name="student_id"
            >
              Implements Form Student Select
            </UFormGroup>
          </UDashboardCard>
        </UDashboardPanelContent>
      </UDashboardPanel>
      <UDashboardPanel grow>
        <div class="h-full">
          <div
            v-if="selectedView == 'list'"
            class="absolute inset-0 overflow-y-auto"
          >
            <div
              v-if="schedules && schedules.length > 0"
              class="flex flex-col gap-4 p-4"
            >
              <SchedulesScheduleItem
                v-for="schedule in schedules"
                :key="schedule.id"
                :schedule="schedule"
              />
            </div>
            <div v-else class="flex items-center justify-center h-full">
              <p class="text-gray-500">{{ t("no_schedule_found") }}</p>
            </div>
          </div>
          <div v-else>
            <AppCalendar
              v-if="schedules"
              :selected-date="selectedDate"
              :view="'week'"
              :events="
                schedules.map((schedule) => ({
                  label: `${schedule.course_name} | ${schedule.activity_name}`,
                  id: schedule.id,
                  date: new Date(schedule.start_at),
                  start: new Date(schedule.start_at),
                  end: new Date(schedule.end_at),
                }))
              "
            />
          </div>
        </div>
      </UDashboardPanel>
    </div>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
} from "date-fns";
import * as z from "zod";
import AppCalendar from "~/components/calendar/AppCalendar.vue";
import { SCHEDULES_STATUS } from "~/constants";
import type { Database } from "~/types/app.types";

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const selectedView = ref("calendar");
const views = computed(() => [
  { label: t("list_view"), value: "list" },
  { label: t("calendar_view"), value: "calendar" },
]);

const client = useSupabaseClient<Database>();
const userOrganizationsStore = useUserOrganizationsStore();
const courseActivitySchedules = useCourseActivitySchedules();
const selectedDate = ref(new Date());

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

const { data: schedules } = useAsyncData(
  async () => {
    const dateStart = startOfDay(selectedDate.value);
    const dateEnd = endOfDay(selectedDate.value);
    if (!userOrganizationsStore.selectedOrganization) {
      return [];
    }

    return await courseActivitySchedules.fetchCourseActivitySchedules({
      start_at: dateStart.toISOString(),
      end_at: dateEnd.toISOString(),
      assigned_to: filterForm.value.assigned_to,
      course_id: filterForm.value.course_id,
      student_id: filterForm.value.student_id,
      status: filterForm.value.status,
    });
  },
  {
    watch: [filterForm.value, selectedDate],
  }
);

const { data: schedulesForMonth } = useAsyncData(
  async () => {
    if (!userOrganizationsStore.selectedOrganization) {
      return [];
    }

    const dateStart = startOfMonth(selectedDate.value);
    const dateEnd = endOfMonth(selectedDate.value);

    const { data, error } = await client
      .from("course_activity_schedules_view")
      .select("start_at")
      .gte("start_at", dateStart.toISOString())
      .lte("end_at", dateEnd.toISOString());
    if (error) {
      throw error;
    }
    return data;
  },
  {
    watch: [selectedDate],
    transform: (data) => {
      // reduce duplicate dates
      const datesString: string[] = [];
      return data.filter((schedule) => {
        const date = format(new Date(schedule.start_at), "yyyy-MM-dd");
        if (datesString.includes(date)) {
          return false;
        }
        datesString.push(date);
        return true;
      });
    },
  }
);
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "list_view": "Liste Ansicht",
    "calendar_view": "Kalender Ansicht",
    "schedules": "Termine",
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
    "schedules": "Schedules",
    "no_schedule_found": "No schedules found",
    "form": {
      "assigned_to": {
        "label": "Assigned to",
        "description": "Filter by the user the schedule is assigned to."
      },
      "status": {
        "label": "Status",
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
