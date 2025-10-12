<template>
  <UDashboardPanelContent class="p-0">
    <UDashboardToolbar v-if="status == 'success'">
      <UContainer class="w-full">
        <div class="flex justify-between items-center space-x-4 w-full">
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
          <div class="flex items-center">
            <UButton
              v-if="query.subscription_id"
              icon="i-heroicons-check-circle-20-solid"
              color="primary"
              variant="outline"
              size="xs"
              :label="t('only_show_mine')"
              @click="
                () => {
                  query.subscription_id = undefined;
                }
              "
            />
            <UButton
              v-else
              icon="i-heroicons-minus-circle"
              color="white"
              variant="ghost"
              size="xs"
              :label="t('only_show_mine')"
              @click="
                () => {
                  query.subscription_id = studentStore.selectedSubscription?.id;
                }
              "
            />
          </div>
        </div>
      </UContainer>
    </UDashboardToolbar>
    <UContainer v-if="status == 'success'" class="w-full" style="height: 75dvh">
      <CalendarAppCalendar
        :events="[...schedules]"
        :view-type="selectedView"
        :selected-date="selectedDate"
        @select-date="(date) => (selectedDate = date)"
        @event-click="console.log('event click', $event)"
      />
    </UContainer>
    <UContainer
      v-else-if="status == 'pending'"
      class="w-full flex flex-col items-center justify-center h-96"
    >
      <div class="grid">
        <USkeleton class="h-8 w-full mb-4" />
        <USkeleton class="h-64 w-full" />
      </div>
    </UContainer>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import type {
  AppCalendarEvent,
  AppCalendarViewType,
} from "~/components/calendar/AppCalendar.vue";

const { t } = useI18n({
  useScope: "local",
});

const userOrganizationsStore = useUserOrganizationsStore();
const selectedDate = ref(new Date());
const selectedView = ref<AppCalendarViewType>("week");
const studentStore = useStudentStore();
const $courseActivitySchedules = useCourseActivitySchedules();

const query = ref<Partial<CourseActivityScheduleQuery>>({
  subscription_id: undefined,
});

const {
  data: schedules,
  status,
} = await useAsyncData(
  `schedules-for-subscription-${studentStore.selectedSubscription?.id}`,
  async () => {
    if (!userOrganizationsStore.selectedOrganization) {
      return [];
    }
    return await $courseActivitySchedules.fetchCourseActivitySchedules({
      ...query.value,
    });
  },
  {
    watch: [query.value, () => userOrganizationsStore.selectedOrganization],
    default() {
      return [];
    },
    transform: (data) => {
      console.log("fetched schedules", data);
      if (!data) {
        return [];
      }
      return data.map((schedule) => {
        const event: AppCalendarEvent = {
          id: schedule.id,
          label: schedule.activity.name,
          date: new Date(schedule.start_at),
          type: schedule.activity.activity_type,
          duration: schedule.duration_minutes,
          schedule: schedule,
          assigned_to: schedule.user,
          activity_attendees_count: schedule.course_activity_schedules_attendees.length,
        };
        return event;
      });
    },
  }
);
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "schedules": "Termine",
    "only_show_mine": "Nur meine Termine anzeigen",
    "show_all": "Alle anzeigen",
    "week_view": "Wochenansicht",
    "day_view": "Tagesansicht",
    "schedules_desc": "Hier können Sie die Aktivitäten sehen, die Sie in diesem Kurs haben.",
    "no_activities_found": "Keine Aktivitäten gefunden",
    "planned_for": "Geplant für den ",
    "attended": "Teilgenommen",
    "registered": "Registriert",
    "canceled": "Abgesagt",
    "attend": "Teilnehmen",
    "cancel_registration": "Termin absagen"
  },
  "en": {
    "schedules": "Schedules",
    "only_show_mine": "Only show my schedules",
    "show_all": "Show all",
    "week_view": "Week View",
    "day_view": "Day View",
    "schedules_desc": "Here you can see the activities you have in this course.",
    "no_activities_found": "No activities found",
    "planned_for": "Planned for ",
    "attended": "Attended",
    "registered": "Registered",
    "canceled": "Canceled",
    "attend": "Attend",
    "cancel_registration": "Cancel registration"
  }
}
</i18n>
