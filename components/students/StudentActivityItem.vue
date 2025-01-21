<template>
  <div
    v-if="attendance"
    class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
  >
    <div class="text-sm flex-1">
      <div>
        <p class="text-gray-900 dark:text-white font-medium">
          {{ props.attendance.activity_name }}
        </p>
        <p
          v-if="props.attendance.activity_start_at"
          class="text-gray-500 dark:text-gray-400 text-sm"
        >
          {{ t("planned_for") }}
          {{ formatDate(props.attendance.activity_start_at) }}
        </p>
      </div>
    </div>
    <p class="text-gray-900 dark:text-white font-medium text-lg">
        <UBadge
            v-if="props.attendance.status == 'ATTENDED'"
            color="green"
            variant="soft"
            :label="t('attended')"
          />
          <UBadge
            v-if="props.attendance.status == 'REGISTERED'"
            color="primary"
            variant="soft"
            :label="t('registered')"
          />
          <UBadge
            v-if="props.attendance.status == 'CANCELED'"
            color="red"
            variant="soft"
            :label="t('canceled')"
          />
      <!-- <UBadge v-if="bill.status == 'PLANNED'" color="primary" variant="soft">Planned</UBadge>
            <UBadge v-if="bill.status == 'CANCELED'" color="red" variant="soft">Canceled</UBadge>
            <UBadge v-if="bill.status == 'COMPLETED'" color="red" variant="soft">Completed</UBadge> -->
    </p>
  </div>
</template>

<script setup lang="ts">
import type { CourseActivityAttendanceView } from "~/types/app.types";
import { formatDate } from "~/utils/formatters";

type Props = {
  attendance: CourseActivityAttendanceView;
};

const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});
</script>

<style scoped></style>

<i18n lang="json">
{
    "de": {
        "attended": "Teilgenommen",
        "registered": "Registriert",
        "canceled": "Abgesagt",
        "planned_for": "Geplant für"
    },
    "en": {
        "attended": "Attended",
        "registered": "Registered",
        "canceled": "Canceled",
        "planned_for": "Planned for"
    }
}
</i18n>