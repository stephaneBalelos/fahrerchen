<template>
  <UDashboardSlideover :title="t('edit_attendees')">
    <div v-if="subscriptions && subscriptions.length > 0" class="space-y-2">
      <ScheduleAttendeesListItem
        v-for="(subscription, index) in subscriptions"
        :key="index"
        :subscription="subscription"
        :schedule-id="props.scheduleId"
      />
    </div>
    <div v-else class="text-center py-10">
      <p class="text-gray-500">{{ t("no_attendees_found") }}</p>
    </div>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppCourseActivitySchedule } from "~/types/app.types";
import ScheduleAttendeesListItem from "../schedules/ScheduleAttendeesListItem.vue";

type Props = {
  scheduleId: string;
  schedule: AppCourseActivitySchedule
};
const props = defineProps<Props>();

const { t } = useI18n({ useScope: "local" });

const subscriptionStore = useSubscriptionStore();
const courseActivitiesStore = useCourseActivitiesStore();

const { data: subscriptions } = await useAsyncData(async () => {
    const courses = await courseActivitiesStore.getAllowedCourseForActivity(
      props.schedule.activity_id,
    );
    return subscriptionStore.activeSubscriptions.filter((s) => courses.some((c) => c.course_id === s.course_id)
    );
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "no_attendees_found": "Keine Teilnehmer gefunden",
    "edit_attendees": "Teilnehmer bearbeiten"
  },
  "en": {
    "no_attendees_found": "No attendees found",
    "edit_attendees": "Edit attendees"
  }
}
</i18n>
