<template>
    <UDashboardPanelContent>
        <UContainer v-if="subscription && studentStore.student" class="w-full">
            <UDashboardSection :title="t('schedules')" :description="t('schedules_desc')">
                <div v-if="schedules && schedules.length > 0">
                    <StudentActivityItem
                        v-for="(schedule, index) in schedules"
                        :key="index"
                        :activity-schedule="schedule"
                        @open-edit-schedule="
                        () => {}"
                    />
                </div>
                <div v-else>
                    <UAlert :title="t('no_activities_found')" />
                </div>
            </UDashboardSection>
        </UContainer>
    </UDashboardPanelContent>
</template>

<script setup lang="ts">
import type { CourseSubscriptionView } from '~/types/app.types';
import StudentActivityItem from "~/components/students/StudentActivityItem.vue";


const { t } = useI18n({
  useScope: "local",
});

const route = useRoute();
const subscriptionId = route.params.s_id as string;
const orgId = route.params.org_id as string;
const studentStore = useStudentStore();
const client = useSupabaseClient();


const { data: subscription } = useAsyncData(
  async () => {
    const { data, error } = await client
      .from("course_subscriptions_view")
      .select("*")
      .eq("id", subscriptionId)
      .single().overrideTypes<CourseSubscriptionView>();
    if (error) {
      console.error(error);
      return null;
    }

    return data;
  },
  { immediate: true }
);

const {
  data: schedules
} = useAsyncData(`subscription_schedules_${subscriptionId}`, async () => {
  const { data, error } = await client
    .from("course_activity_schedules")
    .select("*")
    .contains("attendees", [subscriptionId])
    .eq("organization_id", orgId)
    .order("start_at", { ascending: false });
  if (error) {
    throw error;
  }
  console.log("schedules", data);
  return data;
});
</script>

<style scoped>

</style>

<i18n lang="json">
{
  "de": {
    "schedules": "Aktivitäten",
    "schedules_desc": "Hier können Sie die Aktivitäten sehen, die Sie in diesem Kurs haben.",
    "no_activities_found": "Keine Aktivitäten gefunden"
  },
  "en": {
    "schedules": "Activities",
    "schedules_desc": "Here you can see the activities you have in this course.",
    "no_activities_found": "No activities found"
  }
}
</i18n>