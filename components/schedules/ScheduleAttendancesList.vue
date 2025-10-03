<template>
<UCard class="w-full">
    <template #header>
        <div class="flex items-center justify-between">
            <h3 class="font-medium leading-6 text-gray-900 dark:text-gray-100">
                {{ t("attendances") }}
            </h3>
        </div>
    </template>
    <div v-if="attendances && status === 'success'" class="flex flex-col items-start">
        <div v-for="attendance in attendances" :key="attendance.id" class="py-2 flex w-full border-b last:border-0">
            <div class="flex items-center flex-1 gap-3">
                <UAvatar :alt="`${attendance.subscription.student.firstname} ${attendance.subscription.student.lastname}`" />
                <div>{{ attendance.subscription.student.firstname }} {{ attendance.subscription.student.lastname }}</div>
            </div>
            <UButton
            color="white"
            icon="i-heroicons-chevron-right"
            trailing
            :label="t('open_attendance_confirmation')"
            @click="openAttendanceConfirmation(attendance.id)"
            />
        </div>
    </div>
    <div v-else class="p-4 text-center text-sm text-muted-foreground w-full">
        <div v-if="status === 'pending'">
            <USkeleton class="h-6 w-full mb-2" />
            <USkeleton class="h-6 w-full mb-2" />
            <USkeleton class="h-6 w-full mb-2" />
        </div>
        <div v-else-if="status === 'error'">
            {{ t("no_attendances") }}
        </div>
        <div v-else>
            {{ t("no_attendances") }}
        </div>
    </div>
</UCard>
</template>

<script setup lang="ts">
import AttendanceConfirmationSlideover from '../students/AttendanceConfirmationSlideover.vue';


type Props = {
    scheduleId: string;
    organizationId: string;
}

const { t } = useI18n({ useScope: "local" });
const props = defineProps<Props>();
const $courseActivitiesSchedules = useCourseActivitySchedules();
const slideover = useSlideover();

const { data: attendances, status, refresh } = useAsyncData(async () => {
    return await $courseActivitiesSchedules.fetchScheduleAttendancesForSchedule(props.scheduleId);
});

const openAttendanceConfirmation = (attendanceId: string) => {
    // Logic to open attendance confirmation modal
    slideover.open(AttendanceConfirmationSlideover, {
        attendanceId: attendanceId,
        "onDelete": () => {
            slideover.close();
            refresh();
        },
    })
};
</script>

<style scoped>

</style>

<i18n lang="json">
{
  "en": {
    "attendances": "Attendances",
    "open_attendance_confirmation": "Open attendance confirmation",
    "no_attendances": "Schedule completed without attendees."
  },
  "de": {
    "attendances": "Teilnahmen",
    "open_attendance_confirmation": "Teilnahmebestätigung öffnen",
    "no_attendances": "Termin ohne Teilnehmer abgeschlossen."
  }
}
</i18n>