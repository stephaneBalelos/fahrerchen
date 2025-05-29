<template>
  <UDashboardPanelContent>
    <UContainer
      v-if="subscription && studentStore.student"
      class="w-full grid grid-cols-1 gap-4"
    >
      <UCard class="p-0">
        <UDashboardSection
          :title="t('schedules')"
          :description="t('schedules_desc')"
        >
          <div v-if="schedules && schedules.length > 0">
            <div
              v-for="(schedule, index) in schedules"
              :key="index"
              @open-edit-schedule="() => {}"
            >
              <div
                class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
                @click="() => {}"
              >
                <div class="text-sm flex-1">
                  <div>
                    <p class="text-gray-900 dark:text-white font-medium">
                      {{ schedule.activity_name }}
                    </p>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                      {{ t("planned_for") }}
                      {{ formatDate(schedule.schedule_start_at) }}
                    </p>
                  </div>
                </div>
                <p
                  class="flex items-center gap-2 text-gray-900 dark:text-white font-medium text-lg"
                >
                  <UBadge
                    v-if="schedule.schedule_attendees.includes(subscriptionId) && schedule.schedule_status == 'COMPLETED'"
                    color="green"
                    variant="soft"
                    :label="t('attended')"
                  />
                  <UBadge
                    v-if="schedule.schedule_attendees.includes(subscriptionId) && schedule.schedule_status == 'PLANNED'"
                    color="primary"
                    variant="soft"
                    :label="t('registered')"
                  />
                  <UBadge
                    v-if="schedule.schedule_attendees.includes(subscriptionId) && schedule.schedule_status == 'CANCELED'"
                    color="red"
                    variant="soft"
                    :label="t('canceled')"
                  />
                  <UTooltip
                    v-if="
                      schedule.schedule_status == 'PLANNED' &&
                      schedule.schedule_attendees.includes(subscriptionId)
                    "
                    :text="t('cancel_registration')"
                  >
                    <UButton
                      color="red"
                      variant="soft"
                      icon="i-heroicons-x-circle"
                      size="2xs"
                    />
                  </UTooltip>
                  <UButton
                    v-if="
                      schedule.schedule_status == 'PLANNED' &&
                      !schedule.schedule_attendees.includes(subscriptionId)
                    "
                    color="primary"
                    size="2xs"
                  >
                    {{ t("attend") }}
                  </UButton>
                </p>
              </div>
            </div>
          </div>
          <div v-else>
            <UAlert :title="t('no_activities_found')" />
          </div>
        </UDashboardSection>
      </UCard>
    </UContainer>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import type {
  AppOrganizationSchedulesView
} from "~/types/app.types";
import { formatDate } from "~/utils/formatters";

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
      .single()
      .overrideTypes<AppOrganizationSchedulesView>();
    if (error) {
      console.error(error);
      return null;
    }

    return data;
  },
  { immediate: true }
);

const { data: schedules } = useAsyncData(
  `subscription_schedules_${subscriptionId}`,
  async () => {
    const q = client
      .from("organizations_schedules_view")
      .select("*")
      .eq("schedule_organization_id", orgId);

    if (subscription.value) {
      q.eq("course_id", subscription.value.course_id);
    }

    q.or(
      `attendees.cs.{"${subscriptionId}"},and(activity_allow_self_registration.is.true,start_at.gte.now())`
    );

    const { data, error } = await q
      .order("start_at", { ascending: false })
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
