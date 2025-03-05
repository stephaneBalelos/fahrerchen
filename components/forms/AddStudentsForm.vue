<template>
  <UDashboardSlideover :title="t('title')">
    <UCard
      :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
      class="min-w-0"
    >
      <template #header>
        <UInput
          v-model="q"
          icon="i-heroicons-magnifying-glass"
          :placeholder="t('search_students')"
          autofocus
        />
      </template>
      <ul v-if="filteredStudents.length > 0" role="list" class="divide-y divide-gray-200 dark:divide-gray-800">
        <li
          v-for="(student, index) in filteredStudents"
          :key="index"
          class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
          @click="
            selected.includes(student.id)
              ? selected.splice(selected.indexOf(student.id), 1)
              : selected.push(student.id)
          "
        >
          <div class="flex items-center gap-3 min-w-0">
            <UCheckbox :model-value="selected.includes(student.id)" />
            <UAvatar
              :alt="`${student.firstname} ${student.lastname}`"
              size="md"
            />

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
      <UAlert
        v-else
        :title="t('no_students_found')"
        :description="t('no_students_found_description')"
      />
    </UCard>

    <template #footer>
      <div class="flex flex-1 flex-col">
        <UAlert
          v-if="selected.length > 0"
          class="my-4"
          icon="i-heroicons-command-line"
          color="primary"
          variant="solid"
          :title="t('student_to_add', { count: selected.length })"
        />
        <UButton v-if="selected.length > 0" block @click="addStudents"
          >{{ t('add_students') }}</UButton
        >
      </div>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";

type Props = {
  courseid: string;
  orgid: string;
};

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();

const emits = defineEmits(["student-added"]);

const supabase = useSupabaseClient<Database>();

const q = ref("");

const toast = useToast();

const selected = ref<string[]>([]);

const {
  data: students,
} = await useAsyncData(
  `students_${props.courseid}`,
  async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*, course_subscriptions(*)")
      .eq("course_subscriptions.course_id", props.courseid)
      .is("course_subscriptions", null)
      .eq("organization_id", props.orgid);
    if (error) {
      console.error(error);
      throw error;
    }
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
  selected.value.forEach(async (studentId) => {
    const { error } = await supabase.from("course_subscriptions").insert({
      course_id: props.courseid,
      student_id: studentId,
      organization_id: props.orgid,
    });
    if (error) {
      toast.add({
        title: "Error",
        description: "An error occurred while adding the student.",
        color: "red",
        timeout: 3000,
      });
      throw error;
    }
    toast.add({
      title: "Student added",
      description: "The student has been added to the course.",
      color: "green",
      timeout: 3000,
    });
    emits("student-added");
  });
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Abonnieren Student",
    "search_students": "Suche Studenten",
    "no_students_found": "Keine Studenten gefunden",
    "no_students_found_description": "Keine Studenten gefunden, die dem Kurs hinzugefügt werden können",
    "add_students": "Studenten hinzufügen",
    "student_added": "Student hinzugefügt",
    "student_added_description": "Der Student wurde dem Kurs hinzugefügt.",
    "student_to_add": "{count} Student(innen) hinzufügen"
  },
  "en": {
    "title": "Subscribe Student",
    "search_students": "Search Students",
    "no_students_found": "No students found",
    "no_students_found_description": "No students found",
    "add_students": "Add Students",
    "student_added": "Student added",
    "student_added_description": "The student has been added to the course.",
    "student_to_add": "Add {count} Student(s)"
  }
}
</i18n>