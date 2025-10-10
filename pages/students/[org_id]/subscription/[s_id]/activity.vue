<template>
  <UDashboardPanelContent v-if="studentStore.selectedSubscription" class="p-0">
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
            v-if="studentStore.selectedSubscription"
            v-model="filterForm.activityId"
            :org-id="studentStore.selectedSubscription.organization_id"
            :course-id="studentStore.selectedSubscription.course_id"
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
          v-if="studentStore.selectedSubscription"
          :loading="isDownloadingCertificate"
          variant="soft"
          color="primary"
          @click="generateCertificate"
        >
          {{ t("download_certificate") }}
        </UButton>
      </template>
    </UDashboardToolbar>
    <UDashboardPanelContent>
      <UContainer v-if="studentStore.selectedSubscription" class="w-full relative h-full">
        <div class="absolute inset-0 overflow-y-auto">
          <div v-if="status === 'pending'">Loading...</div>
          <div v-else-if="status === 'error'">Error: {{ error }}</div>
          <div v-else-if="status === 'success' && schedules">
            <div v-if="schedules.length === 0">
              <UAlert :title="t('no_activities_found')" />
            </div>
            <div v-else class="relative">
              <StudentsStudentActivityItem
                v-for="(schedule, index) in schedules"
                :key="index"
                :subscription-id="studentStore.selectedSubscription.id"
                :activity-schedule="schedule"
                :is-new-month="
                  isNewMonth(
                    schedule.start_at,
                    index > 0 ? schedules[index - 1].start_at : null
                  )
                "
              />
            </div>
          </div>
        </div>
      </UContainer>
    </UDashboardPanelContent>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { SCHEDULES_STATUS } from "~/constants";
import type { Database } from "~/types/app.types";

const { t } = useI18n({
  useScope: "local",
});
const { t: g } = useI18n({
  useScope: "global",
});

const filterForm = ref({
  activityId: "",
  activityStatus: undefined as
    | Database["public"]["Enums"]["schedule_status"]
    | undefined,
});

const studentStore = useStudentStore();
const isDownloadingCertificate = ref(false);
const $courseActivitySchedules = useCourseActivitySchedules();


const {
  data: schedules,
  error,
  status,
} = useAsyncData(
  async () => {
    if (!studentStore.selectedSubscription) {
      return [];
    }
    return $courseActivitySchedules.fetchCourseActivitySchedules({
      subscription_id: studentStore.selectedSubscription.id,
      activity_id: filterForm.value.activityId || undefined,
      status: filterForm.value.activityStatus || undefined,
    })
  },
  {
    watch: [filterForm.value, () => studentStore.selectedSubscription],
  }
);

async function generateCertificate() {
  if (!studentStore.selectedSubscription) {
    return;
  }
  if (!studentStore.student) {
    return;
  }
  if (isDownloadingCertificate.value) {
    return;
  }
  isDownloadingCertificate.value = true;
  try {
    const res = await $fetch<Blob>(
      `/api/orgs/subscriptions/${studentStore.selectedSubscription.id}/generate-certificate`,
      {
        method: "GET",
      }
    );
    const date = format(new Date(), "yyyy-MM-dd");

    const blob = new Blob([res], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ausbildungsnachweis-b-${studentStore.student.firstname}-${studentStore.student.lastname}-${date}.pdf`;
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

const isNewMonth = (date: string, prevDate: string | null) => {
  if (!prevDate) return true; // If there's no previous date, treat it as a new month
  const currentDate = new Date(date);
  const previousDate = new Date(prevDate);
  return (
    currentDate.getMonth() !== previousDate.getMonth() ||
    currentDate.getFullYear() !== previousDate.getFullYear()
  );
};
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
