<template>
    <div v-if="attendance" class="flex gap-2">
        <p v-if="attendance.schedule">{{ t('attended_at', { data: formatDate(attendance.schedule.start_at) }) }}</p>
        <p>{{ t('unit_price') }}: {{ formatCurrency(props.activityPrice) }}</p>
    </div>
    <div v-else>
        <p>{{ t('not_attended_yet') }} | {{ t('unit_price') }}: {{ formatCurrency(props.activityPrice) }}</p>
    </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';
import { formatCurrency, formatDate } from '~/utils/formatters';

type Props = {
    attendanceId?: string;
    activityPrice: number;
}

const props = defineProps<Props>();

const { t } = useI18n({
    useScope: "local",
});

const client = useSupabaseClient<Database>();

const { data: attendance } = useAsyncData(`attendance_${props.attendanceId}`, async () => {
    if (!props.attendanceId) return null;
    const { data, error } = await client
        .from("course_activity_attendances")
        .select("id, status, schedule:course_activity_schedules(*)")
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