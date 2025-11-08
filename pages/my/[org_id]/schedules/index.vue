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
        <UDashboardNavbar :title="t('schedules_planning')" class="mb-2">
          <template #right>
            <UButton
              icon="i-heroicons-plus-circle-solid"
              color="primary"
              label="Neuen Termin erstellen"
              @click="openEditScheduleSlideover()"
            />
          </template>
        </UDashboardNavbar>

        <UDashboardToolbar v-if="userOrganizationsStore.selectedOrganization">
          <template #left>
            <div class="flex items-center space-x-2">
              <UButton
                :label="t('week_view')"
                :color="selectedView === 'week' ? 'primary' : 'white'"
                variant="solid"
                @click="() => (selectedView = 'week')"
              />
              <UButton
                :label="t('day_view')"
                :color="selectedView === 'day' ? 'primary' : 'white'"
                variant="solid"
                @click="() => (selectedView = 'day')"
              />
            </div>
          </template>
          <template #right>
            <UButton
              icon="i-heroicons-funnel-solid"
              color="primary"
              variant="outline"
              @click="
                () => {
                  openScheduleFilterSlideover();
                }
              "
            />
          </template>
        </UDashboardToolbar>
        <UDashboardPanelContent class="p-0">
          <CalendarAppCalendar
            v-if="schedules && schedulesRequests"
            :selected-date="selectedDate"
            :events="[...schedules, ...schedulesRequests]"
            :view-type="selectedView"
            @date-block-click="(date) => openEditScheduleSlideover({ date })"
            @select-date="(date) => (selectedDate = date)"
            @event-click="(event) => {}"
          >
            <template #context-menu="{ selectedEvent }">
              <AppCalendarEventContextMenuRequest
                v-if="selectedEvent && selectedEvent.status === 'REQUESTED'"
                :event="selectedEvent"
                @accept-request="
                  (id) => {
                    console.log('accept request', id);
                  }
                "
                @reject-request="
                  (id) => {
                    console.log('reject request', id);
                  }
                "
                @edit-request="
                  (id) => {
                    openEditScheduleRequestForm(id);
                  }
                "
                @delete-request="
                  (id) => {
                    console.log('delete request', id);
                  }
                "
              />
              <AppCalendarEventContextMenu
                v-else-if="selectedEvent"
                :event="selectedEvent"
                @view-details="
                  (id) => {
                    navigateTo({ query: { id } });
                  }
                "
              />
            </template>
          </CalendarAppCalendar>
        </UDashboardPanelContent>
      </template>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import type {
  AppCalendarViewType,
  AppCalendarEvent,
} from "~/components/calendar/AppCalendar.vue";
import EditCourseActivitySchedule from "~/components/forms/EditCourseActivitySchedule.vue";
import ScheduleView from "~/components/schedules/ScheduleView.vue";
import ConfirmModal from "~/components/ui/Modals/ConfirmModal.vue";
import ScheduleFilterSlideover from "~/components/schedules/ScheduleFilterSlideover.vue";
import AppCalendarEventContextMenu from "~/components/calendar/templates/AppCalendarEventContextMenu.vue";
import AppCalendarEventContextMenuRequest from "~/components/calendar/templates/AppCalendarEventContextMenuRequest.vue";
import EditScheduleRequestForm from "~/components/forms/EditScheduleRequestForm.vue";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

const { t } = useI18n({
  useScope: "local",
});

const route = useRoute();
const $courseActivitySchedules = useCourseActivitySchedules();
const userOrganizationsStore = useUserOrganizationsStore();

const modal = useModal();
const slideover = useSlideover();

const selectedDate = ref(new Date());
const selectedView = ref<AppCalendarViewType>("week");

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

const filterQuery = ref<Partial<CourseActivityScheduleQuery>>({
  organization_id: userOrganizationsStore.selectedOrganization
    ? userOrganizationsStore.selectedOrganization.id
    : undefined,
  statuses: [],
  assigned_to_ids: [],
  subscription_ids: [],
  activity_ids: [],
});

const { data: schedules, refresh } = useAsyncData(
  async () => {
    if (!filterQuery.value.organization_id) {
      return [];
    }
    return await $courseActivitySchedules.fetchCourseActivitySchedules({
      ...filterQuery.value,
    });
  },
  {
    default: () => [],
    watch: [filterQuery.value],
    immediate: false,
    transform: (data) => {
      if (!data) return [];
      return data.map((s) => {
        const event: AppCalendarEvent = {
          id: s.id,
          label: s.activity.name,
          date: new Date(s.start_at),
          duration: s.duration_minutes,
          status: s.status,
          assigned_to: s.user,
          activity_attendees_count:
            s.course_activity_schedules_attendees.length,
          type: s.activity.activity_type,
        };
        return event;
      });
    },
  }
);

const { data: schedulesRequests } = await useAsyncData(
  async () => {
    if (!filterQuery.value.organization_id) {
      return [];
    }


    return await $courseActivitySchedules.fetchCourseActivitySchedulesRequests({
      status: "rejected",
      organization_id: filterQuery.value.organization_id,
    });
  },
  {
    default: () => [],
    watch: [filterQuery.value],
    transform: (data) => {
      if (!data) {
        return [];
      }
      console.log("Fetched schedule requests:", data.length);
      return data.map((request) => {
        const event: AppCalendarEvent = {
          id: request.id,
          label: `${request.activity.name}`,
          date: new Date(request.start_at),
          type: request.activity.activity_type,
          duration: 45,
          status: "REQUESTED",
          assigned_to: null,
          activity_attendees_count: 0,
        };
        return event;
      });
    },
  }
);

const openEditScheduleRequestForm = (request_id?: string) => {
  if (!userOrganizationsStore.selectedOrganization) {
    return;
  }
  slideover.open(EditScheduleRequestForm, {
    organizationId: userOrganizationsStore.selectedOrganization.id,
    requestId: request_id,
  });
};

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

const openScheduleFilterSlideover = () => {
  slideover.open(ScheduleFilterSlideover, {
    form: filterQuery.value,
  });
};

watch(
  [selectedDate, selectedView],
  () => {
    const { start, end } = getCalendarDateRange();
    filterQuery.value.start_at = start;
    filterQuery.value.end_at = end;
  },
  { immediate: true }
);

function getCalendarDateRange() {
  let start = new Date(selectedDate.value);
  let end = new Date(selectedDate.value);
  if (selectedView.value === "day") {
    start = startOfDay(start);
    end = endOfDay(end);
  } else if (selectedView.value === "week") {
    start = startOfWeek(start, { weekStartsOn: 1 }); // week starts on Monday
    end = endOfWeek(end, { weekStartsOn: 1 }); // week ends on Sunday
  } else {
    start = startOfMonth(start);
    end = endOfMonth(end);
  }
  return { start, end };
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "schedules_planning": "Terminplanung",
    "day_view": "Tagesansicht",
    "week_view": "Wochenansicht",
    "filter_schedules": "Termine filtern",
    "schedules": "Alle Termine",
    "no_schedule_found": "Keine Termine gefunden",
    "schedule_details": "Termin Details",
    "edit_schedule": "Termin bearbeiten",
    "delete_schedule_confirm_title": "Termin löschen",
    "delete_schedule_confirm_description": "Sind Sie sicher, dass Sie diesen Termin löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
    "delete": "Löschen",
    "cancel": "Abbrechen"
  },
  "en": {
    "schedules_planning": "Schedules Planning",
    "day_view": "Day View",
    "week_view": "Week View",
    "filter_schedules": "Filter Schedules",
    "schedules": "All Schedules",
    "no_schedule_found": "No schedules found",
    "schedule_details": "Schedule Details",
    "edit_schedule": "Edit Schedule",
    "delete_schedule_confirm_title": "Delete Schedule",
    "delete_schedule_confirm_description": "Are you sure you want to delete this schedule? This action cannot be undone.",
    "delete": "Delete",
    "cancel": "Cancel"
  }
}
</i18n>
