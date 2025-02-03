<template>
  <UDashboardSlideover :title="t('title')">
    <UDashboardSection
      :title="
        t('section_title', {
          activityName: courseActivity.name,
          date: formatDate(courseActivitySchedule.start_at),
          time: formatDate(courseActivitySchedule.start_at),
        })
      "
      :description="t('description')"
      orientation="vertical"
    >
      <div>
        <UCard
          :ui="{ header: { padding: 'p-4' }, body: { padding: '' } }"
          class="min-w-0"
        >
          <template #header>
            <UInput
              v-model="q"
              icon="i-heroicons-magnifying-glass"
              placeholder="Search"
              autofocus
            />
          </template>

          <div
            v-for="subscription in filteredStudents"
            :key="subscription.id"
          >
            <FormsInputsStudentAttendanceCheckbox
              v-if="subscription.student"
              :subscription_id="subscription.id"
              :student="subscription.student"
              :activity_id="courseActivitySchedule.activity_id"
              :schedule_id="props.courseActivitySchedule.id"
              :onChange="() => $emit('updated')"
            >
              <div class="flex gap-3 items-center">
                <UAvatar
                  :alt="`${subscription.student?.firstname} ${subscription.student?.lastname}`"
                  size="xs"
                />
                <span class="text-gray-900 dark:text-white font-medium">
                  {{
                    `${subscription.student?.firstname} ${subscription.student?.lastname}`
                  }}
                </span>
              </div>
            </FormsInputsStudentAttendanceCheckbox>
          </div>
        </UCard>
      </div>
    </UDashboardSection>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type {
  AppCourseActivityAttendance,
  AppCourseActivitySchedule,
  AppCourseSubscription,
  AppStudent,
  Database,
} from "~/types/app.types";
import { formatDate } from "~/utils/formatters";

type Props = {
  courseid: string;
  courseActivitySchedule: AppCourseActivitySchedule;
};

const { t } = useI18n({ useScope: "local" });
const { t: g } = useI18n({ useScope: "global" });

const props = defineProps<Props>();
const emits = defineEmits(["updated"]);

const supabase = useSupabaseClient<Database>();

const q = ref("");

const toast = useToast();

const selected = ref<AppCourseSubscription[]>([]);
const userOrganizationsStore = useUserOrganizationsStore();

if (!userOrganizationsStore.selectedOrganization) {
  throw new Error("Organization not found");
}

const columns = [
  {
    key: "students",
    label: "Student",
  },
];

const courseActivity = await useCourseActivities(
  userOrganizationsStore.selectedOrganization.organization_id,
  props.courseid,
  props.courseActivitySchedule.activity_id
);

const {
  data: subscriptions,
  error
} = await useAsyncData(
  `courses_${props.courseid}_subscriptions`,
  async () => {
    const { data, error } = await supabase
      .from("course_subscriptions")
      .select("*, student:students(*)")
      .eq("course_id", props.courseid);
    if (error) {
      console.error(error);
      throw error;
    }
    return data;
  },
  {
    immediate: true,
  }
);

const filteredStudents = computed(() => {
  if (!subscriptions.value) return [];
  return subscriptions.value.filter((s) => {
    return (
      s.student?.firstname?.search(new RegExp(q.value, "i")) !== -1 ||
      s.student.lastname?.search(new RegExp(q.value, "i")) !== -1
    );
  });
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Teilnehmer hinzufügen oder entfernen",
    "section_title": "{activityName} am {date} um {time} bearbeiten",
    "description": "Fügen Sie Teilnehmer zu diesem Termin hinzu oder entfernen Sie sie."
  },
  "en": {
    "title": "Add or remove students",
    "section_title": "Edit {activityName} on {date} at {time}",
    "description": "Add or remove students to this schedule."
  }
}
</i18n>
