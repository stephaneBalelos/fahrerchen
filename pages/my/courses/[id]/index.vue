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
        v-if="!pending"
        :view="selectedView"
        :selected-date="selectedDate"
      >
        <template #month-body="{ day }">
          <CourseActivityCalendarDay :course-activities="getCourseActivityForDay(day.date)" :day="day" :onEmptyClick="() => openAddCourseActivityForm(day.date)">
          </CourseActivityCalendarDay>
        </template>
      </AppCalendar>
    </UDashboardPanelContent>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import type { CreateLessonSchema } from "~/components/forms/CreateLessonForm.vue";
import type { Database } from "~/types/database.types";
import AppCalendar from "~/components/calendar/AppCalendar.vue";
import type { AppCalendarProps } from "~/components/calendar/AppCalendar.vue";
import { addDays, addMonths, addWeeks, endOfMonth, format, startOfMonth, subDays, subMonths, subWeeks } from "date-fns";
import AddCourseActivityForm from "~/components/forms/AddCourseActivityForm.vue";
import type { AppCourseActivity } from "~/types/app.types";
import CourseActivityCalendarDay from "~/components/courses/CourseActivityCalendarDay.vue";

type Props = {
  orgid: string;
  courseid: string;
};
definePageMeta({
  layout: "orgs",
});
const props = useAttrs() as Props;
const route = useRoute();
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

const {
  data: course,
  error,
  pending,
  refresh,
} = await useAsyncData(`course_${props.courseid}`, async () => {
  const { data, error } = await supabase
    .from("courses")
    .select("*, course_activities(*)")
    .eq("id", props.courseid)
    .gte("course_activities.date", startOfMonth(selectedDate.value).toISOString())
    .lte("course_activities.date", endOfMonth(selectedDate.value).toISOString())
    .single();
  if (error) {
    console.error(error);
    throw error;
  }
  console.log(data);
  return data;
});

watch(
  () => route.params,
  async () => {
    await refresh();
  },
  { deep: true }
);

watch(selectedDate, async () => {
  await refresh();
});

// onMounted(async () => {
//     console.log('mounted')
//     await refresh()
// })

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

function openAddCourseActivityForm(date: Date) {
  slideover.open(AddCourseActivityForm, {
      courseid: props.courseid,
      orgid: props.orgid,
      date,
      
      "onActivity-added": () => {
        console.log('activity added')
        refresh();
      },
      "onActivity-saved": () => {
        console.log('activity saved')
        refresh()
      },
      "onActivity-deleted": () => {
        console.log('activity deleted')
        refresh()
      },
    });

}

function onActivityAdded(data?: AppCourseActivity) {
  console.log('activity added')
  refresh();

}
function onActivitySaved(data: AppCourseActivity) {
  console.log('activity saved')
  refresh();

}
function onActivityDeleted(data: AppCourseActivity) {
  console.log('activity deleted')
  refresh();
}

function getCourseActivityForDay(day: Date) {
  if (!course.value) return [];

  return course.value.course_activities.filter((activity) => {
    return format(new Date(activity.date), 'dd.mm.yyyy') === format(day, 'dd.mm.yyyy');
  });
}

</script>

<style scoped></style>
