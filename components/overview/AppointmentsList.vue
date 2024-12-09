<template>
  <UDashboardCard
    :title="t('incoming_appointments')"
    :description="t('incoming_appointments_description')"
    icon="i-heroicons-calendar"
  >
    <div v-if="schedules && schedules.length > 0">
        <NuxtLink
          v-for="(schedule, index) in schedules"
          :key="index"
          class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
            @click="openScheduleModal(schedule)"
        >
          <div class="text-sm flex-1">
            <div>
              <p class="text-gray-900 dark:text-white font-medium">
                {{ schedule.activity_name }} | {{ schedule.course_name }}
              </p>
              <p class="text-gray-500 dark:text-gray-400">
                {{ formatDate(schedule.start_at ?? '') }}
              </p>
            </div>
          </div>
          <p class="text-gray-900 dark:text-white font-medium text-lg">
            <UBadge v-if="schedule.status == 'PLANNED'" color="primary" variant="soft">Planned</UBadge>
            <UBadge v-if="schedule.status == 'CANCELED'" color="red" variant="soft">Canceled</UBadge>
            <UBadge v-if="schedule.status == 'COMPLETED'" color="red" variant="soft">Completed</UBadge>
          </p>
        </NuxtLink>
    </div>
    <div class="min-h-96 flex flex-col items-center justify-center" v-else>
        <UIcon name="i-heroicons-circle-stack" class="w-5 h-5" />
        <p class="text-gray-500 dark:text-gray-400">
            {{ t('no_appointments') }}
        </p>
    </div>
  </UDashboardCard>
</template>

<script setup lang="ts">
import type { CourseActivityScheduleView, Database } from '~/types/app.types';
import { formatDate } from '~/utils/formatters';
import EditCourseActivitySchedule from '../forms/EditCourseActivitySchedule.vue';

const { t } = useI18n({
    useScope: 'local'
})

const client = useSupabaseClient<Database>()
const userOrganizationsStore = useUserOrganizationsStore()
const slideover = useSlideover()

if (!userOrganizationsStore.selectedOrganization) {
    throw new Error('No active organization')
}

const { data:schedules, error, status } = useAsyncData(async () => {
    if (!userOrganizationsStore.selectedOrganization) {
        throw new Error('No active organization')
    }
    const { data, error } = await client.from('course_activity_schedules_view').select('*')
    .eq('organization_id', userOrganizationsStore.selectedOrganization.organization_id)
    .gte('start_at', new Date().toISOString()).limit(10)

    if (error) {
        throw error
    }

    return data
})

async function openScheduleModal(schedule: CourseActivityScheduleView) {
    slideover.open(EditCourseActivitySchedule, {
        orgid: schedule.organization_id,
        courseid: schedule.course_id,
        activityid: schedule.activity_id,
        activity_schedule_id: schedule.id,
    })
}

</script>

<style scoped>

</style>

<i18n lang="json">
{
    "de": {
        "incoming_appointments": "Kommende Termine",
        "incoming_appointments_description": "Hier sind die nächsten Termine, die Sie haben.",
        "no_appointments": "Keine Termine"
    },
    "en": {
        "incoming_appointments": "Incoming Appointments",
        "incoming_appointments_description": "Here are the next appointments you have.",
        "no_appointments": "No appointments"
    }
}
</i18n>