<template>
  <UDashboardPanelContent class="p-0">
    <UDashboardToolbar>
      <template #left>
        <UButtonGroup size="xs" orientation="horizontal">
          <UButton
            icon="i-heroicons-chevron-left-20-solid"
            color="gray"
            variant="ghost"
            @click="prevMonth"
          />
          <UButton
            icon="i-heroicons-chevron-right-20-solid"
            color="gray"
            variant="ghost"
            @click="nextMonth"
          />
        </UButtonGroup>
        <div>
          {{
            selectedDate.toLocaleDateString(locale, {
              month: "long",
              year: "numeric",
            })
          }}
        </div>
      </template>
      <template #right>
        <USelectMenu
          v-model="selectedView"
          :options="viewOptions"
          value-attribute="value"
          option-attribute="label"
        />
      </template>
    </UDashboardToolbar>
    <UDashboardPanelContent class="p-0">
      <AppCalendar
        :view="selectedView"
        :selected-date="selectedDate"
      >
        <template #month-body="{ day }">
          dd
        </template>
      </AppCalendar>
    </UDashboardPanelContent>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import type { Database } from "~/types/database.types";
import AppCalendar from "~/components/calendar/AppCalendar.vue";
import type { AppCalendarProps } from "~/components/calendar/AppCalendar.vue";
import { addDays, addMonths, addWeeks, endOfMonth, format, startOfMonth, subDays, subMonths, subWeeks } from "date-fns";

type Props = {
  orgid: string;
  courseid: string;
};
definePageMeta({
  layout: "orgs",
});
const props = useAttrs() as Props;
const supabase = useSupabaseClient<Database>();
const { locale } = useI18n();
const toast = useToast();

const selectedDate = ref(new Date());
const selectedView = ref<AppCalendarProps['view']>("month");
const viewOptions = ref([
  { label: "Month", value: "month" },
  { label: "Week", value: "week" },
  { label: "Day", value: "day" },
]);

const slideover = useSlideover();

const open = ref(false);

function prevMonth() {
  switch (selectedView.value) {
    case "month":
      selectedDate.value = subMonths(selectedDate.value, 1);
      break;
    case "week":
      selectedDate.value = subWeeks(selectedDate.value, 1);
      break;
    case "day":
      selectedDate.value = subDays(selectedDate.value, 1);
      break;
  }
}
function nextMonth() {
  switch (selectedView.value) {
    case "month":
      selectedDate.value = addMonths(selectedDate.value, 1);
      break;
    case "week":
      selectedDate.value = addWeeks(selectedDate.value, 1);
      break;
    case "day":
      selectedDate.value = addDays(selectedDate.value, 1);
      break;
  }
}

function openAddCourseScheduleForm(date: Date) {
  console.log('open add course schedule form')
}
</script>

<style scoped>

</style>