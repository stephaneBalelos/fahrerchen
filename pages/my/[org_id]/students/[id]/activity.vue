<template>
  <div v-if="subscriptionStore.subscription" class="flex flex-col flex-1 overflow-y-auto">
    <UDashboardToolbar>
      <template #left>
        <UButtonGroup size="sm" orientation="horizontal">
          <USelectMenu
            v-model="filterForm.activityStatus"
            :options="SCHEDULES_STATUS"
          >
            <template #label>
              <span v-if="filterForm.activityStatus">
                <UBadge
                  v-if="filterForm.activityStatus === 'PLANNED'"
                  color="primary"
                  size="xs"
                  variant="subtle"
                >
                  {{
                    g(
                      `courses.activities.schedules.schedules_status_${filterForm.activityStatus}`
                    )
                  }}
                </UBadge>
                <UBadge
                  v-else-if="filterForm.activityStatus === 'COMPLETED'"
                  color="green"
                  size="xs"
                  variant="subtle"
                >
                  {{
                    g(
                      `courses.activities.schedules.schedules_status_${filterForm.activityStatus}`
                    )
                  }}
                </UBadge>
                <UBadge
                  v-else-if="filterForm.activityStatus === 'CANCELED'"
                  color="red"
                  size="xs"
                  variant="subtle"
                >
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
            color="white"
            variant="solid"
            @click="filterForm.activityStatus = undefined"
          />
        </UButtonGroup>

        <UButtonGroup size="sm" orientation="horizontal">
          <FormsInputsCourseActivitySelect
            v-if="subscriptionStore.subscription.course_id"
            v-model="filterForm.activityId"
            :org-id="org_id"
            :course-id="subscriptionStore.subscription.course_id"
          />
          <UButton
            v-if="filterForm.activityId"
            icon="i-heroicons-x-mark"
            color="white"
            variant="solid"
            @click="filterForm.activityId = ''"
          />
        </UButtonGroup>
      </template>
      <template #right>
        <UButton
          v-if="subscriptionStore.subscription"
          :loading="isDownloadingCertificate"
          variant="soft"
          color="primary"
          @click="generateCertificate"
        >
          {{ t("download_certificate") }}
        </UButton>
      </template>
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
import { format } from "date-fns";
import { SCHEDULES_STATUS } from "~/constants";
import type { Database } from "~/types/app.types";

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
  activityStatus: undefined as
    | Database["public"]["Enums"]["schedule_status"]
    | undefined,
});

const subscriptionStore = useSubscriptionStore();
const isDownloadingCertificate = ref(false);

async function generateCertificate() {
  if (!subscriptionStore.subscription) {
    return;
  }
  if (isDownloadingCertificate.value) {
    return;
  }
  isDownloadingCertificate.value = true;
  try {
    const res = await $fetch<Blob>(
      `/api/orgs/subscriptions/${subscription_id}/generate-certificate`,
      {
        method: "GET",
      }
    );
    const date = format(new Date(), "yyyy-MM-dd");

    const blob = new Blob([res], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ausbildungsnachweis-b-${subscriptionStore.subscription.student_firstname}-${subscriptionStore.subscription.student_lastname}-${date}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  } finally {
    isDownloadingCertificate.value = false;
  }
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "download_certificate": "Ausbildungsnachweis herunterladen",
    "form": {
      "status": {
        "placeholder": "Status auswählen"
      }
    },
    "no_activities_found": "Keine Aktivitäten gefunden"
  },
  "en": {
    "download_certificate": "Download Certificate",
    "form": {
      "status": {
        "placeholder": "Select Status"
      }
    },
    "no_activities_found": "No activities found"
  }
}
</i18n>
