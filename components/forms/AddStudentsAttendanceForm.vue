<template>
  <UDashboardSlideover title="Add Students to Schedule">
    <UDashboardSection
      :title="`Add students to ${courseActivity.name}`"
      :description="`Select students to add to ${courseActivity.name} at ${format(new Date(courseActivitySchedule.start_at), 'PPpp')}`"
      orientation="vertical"
    >
      <div>
        <UCard
          :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
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

          <UTable
            v-model="selected"
            :rows="filteredStudents"
            :columns="columns"
          >
            <template #students-data="{ row }">
              <div class="flex items-center gap-3">
                <UAvatar
                  v-bind="row.avatar"
                  :alt="`${row.students.firstname} ${row.students.lastname}`"
                  size="xs"
                />

                <span class="text-gray-900 dark:text-white font-medium">
                  {{
                    `${row.students.firstname} ${row.students.lastname}`
                  }}</span
                >
              </div>
            </template>
          </UTable>
        </UCard>
      </div>
    </UDashboardSection>

    <template #footer>
      <div class="flex flex-1 flex-col">
        <UAlert
          v-if="selected.length > 0"
          class="my-4"
          icon="i-heroicons-command-line"
          color="primary"
          variant="solid"
          :title="`${selected.length} student(s) selected`"
        />
        <UButton v-if="selected.length > 0" @click="addStudents" block
          >{{ selected.length }} Add Students</UButton
        >
      </div>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import type { AppCourseActivityAttendance, AppCourseActivitySchedule, AppCourseSubscription, AppStudent, Database } from "~/types/app.types";

type Props = {
  courseid: string;
  courseActivitySchedule: AppCourseActivitySchedule;
};

const props = defineProps<Props>();
const emits = defineEmits(["students-added"]);

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

const course = await useCourses(userOrganizationsStore.selectedOrganization.organization_id, props.courseid);
const courseActivity = await useCourseActivities(userOrganizationsStore.selectedOrganization.organization_id, props.courseid, props.courseActivitySchedule.activity_id);


const {
  data: subscriptions,
  error,
  refresh,
} = await useAsyncData(
  `courses_${props.courseid}_subscriptions`,
  async () => {
    const { data, error } = await supabase
      .from("course_subscriptions")
      .select("*, students(*)")
      .eq("course_id", props.courseid);
    if (error) {
      console.error(error);
      throw error;
    }
    console.log(data);
    return data;
  },
  { immediate: true }
);

const filteredStudents = computed(() => {
  if (!subscriptions.value) return [];
  return subscriptions.value.filter((s) => {
    return (
      s.students?.firstname?.search(new RegExp(q.value, "i")) !== -1 ||
      s.students.lastname?.search(new RegExp(q.value, "i")) !== -1
    );
  });
});

async function addStudents() {

    const entries = selected.value
    .map((subscriptions) => {
        const attendance: Omit<AppCourseActivityAttendance, "id" | "status" | "attended_at"> = {
        course_subscription_id: subscriptions.id,
        course_activity_id: courseActivity.id,
        organization_id: courseActivity.organization_id,
        activity_schedule_id: props.courseActivitySchedule.id,
      };
      return attendance;
    });
    console.log(entries);
  try {
    const {data, error} = await supabase.from("course_activity_attendances").upsert(entries);
    if (error) {
      console.error(error);
      throw error;
    }
    toast.add({
      title: "Students added",
      description: `${entries.length} students added to the schedule.`,
      color: "green",
    });
    emits('students-added');
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "An error occurred while adding the students.",
      color: "red",
    });
  }
}
</script>

<style scoped></style>
