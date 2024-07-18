<template>
  <UDashboardSection
    title="Students for this course"
    description="Add students to this course."
  ></UDashboardSection>
  <UCard
    :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
    class="min-w-0"
  >
    <template #header>
      <UInput
        v-model="q"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search Students"
        autofocus
      />
    </template>
    <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-800">
      <li
        v-for="(student, index) in filteredStudents"
        :key="index"
        class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
        @click="selected.includes(student.id) ? selected.splice(selected.indexOf(student.id), 1) : selected.push(student.id)"
      >
        <div class="flex items-center gap-3 min-w-0">
          <UCheckbox :model-value="selected.includes(student.id)" />
          <UAvatar :alt="`${student.firstname} ${student.lastname}`" size="md" />

          <div class="text-sm min-w-0">
            <p class="text-gray-900 dark:text-white font-medium truncate">
              {{ student.firstname }} {{ student.lastname }}
            </p>
            <p class="text-gray-500 dark:text-gray-400 truncate">
              {{ student.email }}
            </p>
          </div>
        </div>
      </li>
    </ul>
  </UCard>
  <UAlert v-if="selected.length > 0"
      class="my-4"
      icon="i-heroicons-command-line"
      color="primary"
      variant="solid"
      :title="`${selected.length} student(s) selected`"
    />

    <UButton v-if="selected.length > 0" @click="addStudents" label="Add Students" color="black" />
</template>

<script setup lang="ts">
import { add } from "date-fns";
import type { Database } from "~/types/app.types";

type Props = {
  courseid: string;
  orgid: string;
};

const props = defineProps<Props>();

const emits = defineEmits(["student-added"]);

const supabase = useSupabaseClient<Database>();

const q = ref("");

const toast = useToast();

const selected = ref<string[]>([]);

const {
  data: students,
  error,
  refresh,
} = await useAsyncData(
  `students_${props.courseid}`,
  async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*, course_subscriptions(*)").eq("course_subscriptions.course_id", props.courseid)
      .is("course_subscriptions", null);
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
  if (!students.value) return [];
  return students.value.filter((s) => {
    return (
      s.firstname?.search(new RegExp(q.value, "i")) !== -1 ||
      s.lastname?.search(new RegExp(q.value, "i")) !== -1
    );
  });
});

function addStudents() {
  console.log(selected.value);
  selected.value.forEach(async (studentId) => {
    console.log(studentId, props.courseid, props.orgid);
    const { data, error } = await supabase
      .from("course_subscriptions")
      .insert({
        course_id: props.courseid,
        student_id: studentId,
        organization_id: props.orgid,
      });
    if (error) {
      toast.add({
        title: "Error",
        description: "An error occurred while adding the student.",
        color: "red",
      });
      throw error;
    }
    toast.add({
      title: "Student added",
      description: "The student has been added to the course.",
      color: "green",
    });
    emits('student-added')
  });
}
</script>

<style scoped></style>
