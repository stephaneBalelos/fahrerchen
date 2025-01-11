<template>
    <div v-if="attendance" class="flex gap-2">
        <p v-if="attendance.attended_at">{{ t('attended_at', {data: formatDateTime(attendance.attended_at)}) }}</p>
        <p>{{ t('unit_price') }}: {{ formatCurrency(props.activityPrice) }}</p>
    </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';
import { formatDateTime, formatCurrency } from '~/utils/formatters';

type Props = {
    attendanceId: string;
    itemDetails?: string;
    activityPrice: number;
}

const props = defineProps<Props>();

const { t } = useI18n({
    useScope: "local",
});

const client = useSupabaseClient<Database>();

const { data: attendance } = useAsyncData(`attendance_${props.attendanceId}`, async () => {
    const { data, error } = await client
        .from("course_activity_attendances")
        .select("id, attended_at, status")
        .eq("id", props.attendanceId).single();

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
        "unit_price": "Preis pro Einheit"
    },
    "en": {
        "attended_at": "attended at {data}",
        "unit_price": "Unit price"
    }
}
</i18n>