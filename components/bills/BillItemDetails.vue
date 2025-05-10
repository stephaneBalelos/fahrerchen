<template>
    <div class="mb-4">
        <div class="flex gap-2">
            <p class="font-bold">
                {{ props.billItem.item_title }}
            </p>
            <p>({{ t('unit_price') }}: {{ formatCurrency(props.billItem.item_price) }})</p>
        </div>
        <div v-if="attendance" class="flex gap-2">
            <p class="font-bold text-primary">{{ t('attended_at', { data: formatDate(attendance.activity_start_at) }) }}</p>
        </div>
        <div v-else>
            <p class="font-bold text-orange-200">{{ t('not_attended_yet') }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { CourseSubscriptionBillItemView } from '~/types/app.types';
import { formatCurrency, formatDate } from '~/utils/formatters';

type Props = {
    billItem: CourseSubscriptionBillItemView;
}

const props = defineProps<Props>();

const { t } = useI18n({
    useScope: "local",
});

const client = useSupabaseClient();

const { data: attendance } = useAsyncData(`bill_item_details_${props.billItem.id}`, async () => {
    if (!props.billItem.course_activity_attendance_id) return null;
    const { data, error } = await client
        .from("course_activity_schedules_attendances")
        .select("id, activity_start_at")
        .eq("id", props.billItem.course_activity_attendance_id).single();

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
});
</script>

<style scoped>

</style>

<i18n lang="json">
{
    "de": {
        "attended_at": "teilgenommen am {data}",
        "unit_price": "Einzelpreis",
        "not_attended_yet": "noch nicht teilgenommen"
    },
    "en": {
        "attended_at": "attended at {data}",
        "unit_price": "Unit price",
        "not_attended_yet": "not attended yet"
    }
}
</i18n>