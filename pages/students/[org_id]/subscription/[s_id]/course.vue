<template>
  <UDashboardPanelContent class="p-0">
    <UDashboardToolbar>
      dalksd
    </UDashboardToolbar>
    <UDashboardPanelContent>
      <UContainer
        v-if="subscriptionStore.subscription"
        class="w-full grid grid-cols-1 gap-4"
      >
          <StudentScheduleItem
            v-for="schedule in schedules"
            :key="schedule.schedule_id"
            :schedule="schedule"
          />
      </UContainer>
    </UDashboardPanelContent>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import type { AppOrganizationSchedulesView } from "~/types/app.types";
import StudentScheduleItem from "~/components/schedules/StudentScheduleItem.vue";

const route = useRoute();
const subscriptionId = route.params.s_id as string;
const orgId = route.params.org_id as string;

const client = useSupabaseClient();
const subscriptionStore = useSubscriptionStore();

const { data: schedules } = useAsyncData(
  `subscription_schedules_${subscriptionId}`,
  async () => {
    if (!subscriptionStore.subscription) {
      console.warn("No subscription found in store");
      return [];
    }
    const q = client
      .from("organizations_schedules_view")
      .select("*")
      .eq("schedule_organization_id", orgId)
      .eq("course_id", subscriptionStore.subscription.course_id)
      .or(`schedule_attendees.cs.{"${subscriptionStore.subscription.id}"},and(activity_type.neq.3,schedule_start_at.gte.now())`)

      // and(activity_allow_self_registration.is.true,start_at.gte.now())

    const { data, error } = await q
      .order("schedule_start_at", { ascending: false })
      .overrideTypes<AppOrganizationSchedulesView[]>();
    if (error) {
      throw error;
    }
    console.log("schedules", data);
    return data;
  }
);
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "schedules": "Aktivitäten",
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
    "schedules": "Activities",
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
