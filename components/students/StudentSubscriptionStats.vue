<template>
    <UCard class="mb-4">
        <div v-if="subscription && status == 'success'" class="flex divide-x divide-gray-200 dark:divide-gray-700">
            <div class="flex-1 pr-4">
                <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ t('course') }}</div>
                <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200">{{ subscription.course_name }}</div>
            </div>
            <div class="flex-1 px-4">
                <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ t('progression') }}</div>
                <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200">0</div>
            </div>
            <div class="flex-1 px-4">
                <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ t('costs') }}</div>
                <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200">{{ formatCurrency(subscription.costs) }}</div>
            </div>
            <div class="flex-1 px-4">
                <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ t('saldo')}}</div>
                <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200">{{ formatCurrency(subscription.total_bills - subscription.costs) }}</div>
            </div>
        </div>
        <div v-else-if="status == 'pending'" class="flex divide-x">
            <div class="flex-1">
                <USkeleton class="h-4 w-full" />
                <USkeleton class="h-4 w-1/2" />
            </div>
            <div class="flex-1">
                <USkeleton class="h-4 w-full" />
                <USkeleton class="h-4 w-1/2" />
            </div>
            <div class="flex-1">
                <USkeleton class="h-4 w-full" />
                <USkeleton class="h-4 w-1/2" />
            </div>
            <div class="flex-1">
                <USkeleton class="h-4 w-full" />
                <USkeleton class="h-4 w-1/2" />
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';
import { formatCurrency } from '~/utils/formatters';


type Props = {
    subscriptionId: string
}

const { t } = useI18n({
    useScope: 'local',
})

const props = defineProps<Props>()
const client = useSupabaseClient<Database>()

const { data: subscription, status } = useAsyncData(async () => {
    const { data, error } = await client.from("course_subscriptions_stats_view").select().eq("id", props.subscriptionId).single()

    console.log(data)
    if (error) {
        throw error
    }

    return data
})

</script>

<style scoped>

</style>

<i18n lang="json">
{
    "de": {
        "course": "Kurs",
        "costs": "Kosten",
        "saldo": "Saldo",
        "progression": "Fortschritt",
        "is_active": "Ist aktiv",
        "status_active": "Aktiv",
        "status_archived": "Archiviert"
    },
    "en": {
        "course": "Course",
        "costs": "Costs",
        "saldo": "Saldo",
        "progression": "Progression",
        "is_active": "Is active",
        "status_active": "Active",
        "status_archived": "Archived"
    }
}
</i18n>