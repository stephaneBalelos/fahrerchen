<template>
  <div class="flex flex-col flex-1 overflow-y-auto">
    <UDashboardToolbar>
      <UButtonGroup size="sm" orientation="horizontal">
          <USelectMenu v-model="filterForm.activityStatus" :options="SCHEDULES_STATUS">
            <template #label>
              <span v-if="filterForm.activityStatus">
                <UBadge v-if="filterForm.activityStatus === 'PLANNED'" color="primary" size="xs" variant="subtle">
                    {{
                      g(
                        `courses.activities.schedules.schedules_status_${filterForm.activityStatus}`
                      )
                    }}
                </UBadge>
                <UBadge v-else-if="filterForm.activityStatus === 'COMPLETED'" color="green" size="xs" variant="subtle">
                    {{
                      g(
                        `courses.activities.schedules.schedules_status_${filterForm.activityStatus}`
                      )
                    }}
                </UBadge>
                <UBadge v-else-if="filterForm.activityStatus === 'CANCELED'" color="red" size="xs" variant="subtle">
                    {{
                      g(
                        `courses.activities.schedules.schedules_status_${filterForm.activityStatus}`
                      )
                    }}
                </UBadge>
              </span>
              <span v-else class="text-gray-500">{{
                t("form.status.placeholder")
              }}</span>
            </template>
            <template #option="{ option }">
              {{ g(`courses.activities.schedules.schedules_status_${option}`) }}
            </template>
          </USelectMenu>
          <UButton
            v-if="filterForm.activityStatus"
            icon="i-heroicons-x-mark"
            color="white" variant="solid"
            @click="filterForm.activityStatus = undefined"
          />
      </UButtonGroup>

    </UDashboardToolbar>
    <UDashboardPanelContent class="relative">
      <StudentsStudentActivitiesSection
        :subscription-id="subscription_id"
        :org-id="org_id"
        :filters="filterForm"
      />
    </UDashboardPanelContent>
  </div>
</template>

<script setup lang="ts">
import { SCHEDULES_STATUS } from '~/constants';
import type { Database } from '~/types/app.types';

definePageMeta({
  layout: "orgs",
});

const { t } = useI18n({
  useScope: "local",
});
const { t: g } = useI18n({
  useScope: "global",
});
const route = useRoute();
const subscription_id = route.params.id as string;
const org_id = route.params.org_id as string;

const filterForm = ref({
  activityId: "",
  activityStatus: undefined as Database["public"]["Enums"]["schedule_status"] | undefined,
});
</script>

<style scoped></style>

<i18n lang="json">
{
    "de": {
        "form": {
            "status": {
                "placeholder": "Status auswählen"
            }
        },
        "no_activities_found": "Keine Aktivitäten gefunden"
    }
}
</i18n>
