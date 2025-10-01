<template>
    <UCard class="mb-4">
        <div v-if="subscription && status == 'success'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:divide-x divide-gray-200 dark:divide-gray-700">
            <div class="p-2">
                <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ t('course') }}</div>
                <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200">{{ g(`course_types.${subscription.course.type}.name`) }}</div>
            </div>
            <div class="p-2">
                <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ t('progression') }}</div>
                <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200">0</div>
            </div>
            <div class="p-2">
                <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ t('costs') }}</div>
                <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200">{{ formatCurrency(subscription.costs) }}</div>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('without_vat') }}</span>
            </div>
            <div class="p-2">
                <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ t('saldo')}}</div>
                <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200">{{ formatCurrency(subscription.total_bills - subscription.costs) }}</div>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('without_vat') }}</span>
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
import { formatCurrency } from '~/utils/formatters';


type Props = {
    subscriptionId: string
}

const { t } = useI18n({
    useScope: 'local',
})

const { t:g } = useI18n({
    useScope: 'global',
})

const props = defineProps<Props>()
const client = useSupabaseClient()

const { data: subscription, status } = useAsyncData(async () => {
    const { data, error } = await client.from("course_subscriptions").select("*, course:course_id(type), course_subscription_bills(total, total_with_vat, paid_at)").eq("id", props.subscriptionId)
    .not("course_subscription_bills.paid_at", "is", null).single()
    
    if (error) {
        throw error
    }

    return data
}, {
    transform: (data) => {
        if (!data) return null
        console.log('Subscription data:', data)
        // Calculate total costs from bills
        const totalBills = data.course_subscription_bills.reduce((acc, bill) => acc + (bill.total), 0)

        return {
            ...data,
            total_bills: totalBills,
        }
    }
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
        "status_archived": "Archiviert",
        "without_vat": "ohne MwSt."
    },
    "en": {
        "course": "Course",
        "costs": "Costs",
        "saldo": "Saldo",
        "progression": "Progression",
        "is_active": "Is active",
        "status_active": "Active",
        "status_archived": "Archived",
        "without_vat": "without VAT"
    }
}
</i18n>