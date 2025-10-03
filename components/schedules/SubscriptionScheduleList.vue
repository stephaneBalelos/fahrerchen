<template>
<UDashboardCard
    :title="props.title"
    :description="props.description"
>
<div v-if="status === 'pending'">
    <div class="flex flex-col">
        <USkeleton v-for="n in 3" :key="n" class="h-12 w-full mb-2" />
    </div>
</div>
<div v-else-if="error || !data || data.length === 0">
    <div class="text-center text-sm text-gray-500 dark:text-gray-400">
        No schedules found
    </div>
</div>
<div v-else>
    <div class="flex flex-col space-y-2 divide-y divide-gray-200 dark:divide-gray-700">
        <div
            v-for="schedule in data"
            :key="schedule.id"
            class="flex justify-between items-center"
        >
            <div class="flex flex-col">
                <div class="font-medium text-lg">
                    {{ new Date(schedule.start_at).toLocaleString() }}
                    -
                    {{ add(new Date(schedule.start_at), { minutes: 45 }).toLocaleString() }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                    Assigned to: {{ schedule.assigned_to || "Unassigned" }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                    Status: {{ schedule.status }}
                </div>
            </div>
            <UButton size="sm" class="mt-2" :to="userOrganizationsStore.relativePath(`/schedules?id=${schedule.id}`)">
                {{ t('view_details') }}
            </UButton>
        </div>
    </div>
</div>
</UDashboardCard>
</template>

<script setup lang="ts">
import { add } from 'date-fns';


type Props = {
    title: string;
    description: string;
    subscriptionId?: string;
    activityId?: string;
    startAt?: string;
}

const { t } = useI18n({
  useScope: "local",
});
const props = defineProps<Props>();
const $courseActivitySchedules = useCourseActivitySchedules();
const userOrganizationsStore = useUserOrganizationsStore();

const { data, error, status } = useAsyncData(async () => {
    return await $courseActivitySchedules.fetchCourseActivitySchedules({
        activity_id: props.activityId,
        subscription_id: props.subscriptionId,
        start_at: props.startAt,
    })
});


</script>

<style scoped>

</style>

<i18n lang="json">
{
  "de": {
    "view_details": "Details ansehen"
  },
  "en": {
    "view_details": "View Details"
  }
}
</i18n>