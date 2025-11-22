<template>
  <UDashboardCard :title="props.title" :description="props.description">
    <template #links>
        <slot name="actions" />
    </template>
    <div v-if="status === 'pending'">
      <div class="flex flex-col">
        <USkeleton v-for="n in 3" :key="n" class="h-12 w-full mb-2" />
      </div>
    </div>
    <div v-else-if="error || !data || data.length === 0">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        <UAlert
          icon="i-heroicons-exclamation-circle"
          :title="props.emptyTitle || t('no_schedules_title')"
          :description="props.emptyDescription || t('no_schedules_description')"
        />
      </div>
    </div>
    <div v-else>
      <div
        class="flex flex-col space-y-2 divide-y divide-gray-200 dark:divide-gray-700"
      >
        <div
          v-for="schedule in data"
          :key="schedule.id"
          class="flex justify-between items-center"
        >
          <div class="flex flex-col">
            <div class="font-medium text-lg">
              {{ new Date(schedule.start_at).toLocaleString() }}
              -
              {{
                add(new Date(schedule.start_at), {
                  minutes: 45,
                }).toLocaleString()
              }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Assigned to: {{ schedule.assigned_to || "Unassigned" }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Status: {{ schedule.status }}
            </div>
          </div>
          <UButton
            size="sm"
            class="mt-2"
            :to="
              userOrganizationsStore.relativePath(
                `/schedules?id=${schedule.id}`
              )
            "
          >
            {{ t("view_details") }}
          </UButton>
        </div>
      </div>
    </div>
  </UDashboardCard>
</template>

<script setup lang="ts">
import { add } from "date-fns";

type Props = {
  title: string;
  description: string;
  emptyTitle?: string;
  emptyDescription?: string;
  subscriptionId?: string;
  activityId?: string;
  startAt?: string;
};

const { t } = useI18n({
  useScope: "local",
});
const props = defineProps<Props>();
const $courseActivitySchedules = useCourseActivitySchedules();
const userOrganizationsStore = useUserOrganizationsStore();

const { data, error, status } = useAsyncData(async () => {
  return await $courseActivitySchedules.fetchCourseActivitySchedules({
    organization_id: userOrganizationsStore.selectedOrganizationId || undefined,
    activity_ids: props.activityId ? [props.activityId] : [],
    subscription_ids: props.subscriptionId ? [props.subscriptionId] : [],
    start_at: props.startAt ? new Date(props.startAt) : undefined,
  });
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "view_details": "Details ansehen",
    "no_schedules_title": "Keine Termine gefunden",
    "no_schedules_description": "Es wurden keine Termine gefunden."
  },
  "en": {
    "view_details": "View Details",
    "no_schedules_title": "No schedules found",
    "no_schedules_description": "No schedules were found."
  }
}
</i18n>
