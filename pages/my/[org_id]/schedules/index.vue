<template>
  <UDashboardPage>
    <UDashboardPanel :width="300">
      <UDashboardNavbar :title="t('schedules')">
        <template #right>
          <USelectMenu
            v-model="selectedView"
            :options="views"
            :option-attribute="'label'"
            :value-attribute="'value'"
          />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar v-if="userOrganizationsStore.selectedOrganization">
        <template #left>
          <DateRangePicker v-model="selectedRange" />
        </template>
      </UDashboardToolbar>
      <UDashboardPanelContent class="p-0">
        <div v-if="userOrganizationsStore.selectedOrganization" class="flex flex-col gap-6 p-4 py-6 divider-y divide-gray-200 dark:divide-gray-700">
          <UFormGroup
            :label="t('form.course.label')"
            :help="t('form.course.description')"
            name="course_id"
            :ui="{
              wrapper: filterForm.course_id
                ? 'border-l-4 border-primary-500 ps-4'
                : '',
            }"
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
            <!-- <FormsInputsCourseSelect
              v-model="filterForm.course_id"
              :orgid="userOrganizationsStore.selectedOrganization.id"
            /> -->
          </UFormGroup>
          <UFormGroup
            :label="t('form.assigned_to.label')"
            :help="t('form.assigned_to.description')"
            name="assigned_to"
            :ui="{
              wrapper: filterForm.assigned_to
                ? 'border-l-4 border-primary-500 ps-4'
                : '',
            }"
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
            <!-- <FormsInputsUserSelect
              v-model="filterForm.assigned_to"
              :orgid="userOrganizationsStore.selectedOrganization.id"
            /> -->
          </UFormGroup>
          <UFormGroup
            :label="t('form.status.label')"
            :help="t('form.status.description')"
            name="course_id"
            :ui="{
              wrapper: filterForm.status
                ? 'border-l-4 border-primary-500 ps-4'
                : '',
            }"
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
                <span v-else class="text-gray-500">{{
                  t("form.status.placeholder")
                }}</span>
              </template>
              <template #option="{ option }">
                {{
                  g(`courses.activities.schedules.schedules_status_${option}`)
                }}
              </template>
            </USelectMenu>
          </UFormGroup>
          <UFormGroup
            :label="t('form.student.label')"
            :help="t('form.student.description')"
            name="student_id"
            :ui="{
              wrapper: filterForm.student_id
                ? 'border-l-4 border-primary-500 ps-4'
                : '',
            }"
          >
            <template #hint>
              <UButton
                v-if="filterForm.student_id"
                icon="i-heroicons-x-mark-solid"
                size="2xs"
                color="gray"
                square
                variant="ghost"
                @click="filterForm.student_id = undefined"
              />
            </template>
            <FormsInputsStudentSubscriptionSelect
              v-model="filterForm.student_id"
              :orgid="userOrganizationsStore.selectedOrganization.id"
            />
          </UFormGroup>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
    <UDashboardPanel v-model="isPanelOpen" grow collapsible side="right">
      <UDashboardNavbar :title="'Calendar View'">
        <template #right>
          <UButton
            icon="i-heroicons-plus-circle-solid"
            color="primary"
            label="Neuen Termin erstellen"
          />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent>
        <div class="bg-cyan-400">
          <div class="min-h-full h-screen">dsds</div>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import { sub } from "date-fns";
import * as z from "zod";
import DateRangePicker from "~/components/forms/Inputs/DateRangePicker.vue";
import { SCHEDULES_STATUS } from "~/constants";

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const isPanelOpen = ref(true);
const selectedView = ref("list");
const views = computed(() => [
  { label: t("list_view"), value: "list" },
  { label: t("calendar_view"), value: "calendar" },
]);

const userOrganizationsStore = useUserOrganizationsStore();
const selectedRange = ref({
  start: sub(new Date(), { days: 14 }),
  end: new Date(),
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
