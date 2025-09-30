<template>
  <UDashboardPanelContent>
    <!-- <StudentsStudentSubscriptionStats :subscription-id="subscription_id" />
    <StudentsCourseStudentProgression :subscription-id="subscription_id" /> -->
    <UPageHeader
      v-if="studentsStore.selectedStudent"
      :title="`${studentsStore.selectedStudent.firstname} ${studentsStore.selectedStudent.lastname}`"
      :ui="{
        wrapper: 'py-4 pb-4',
      }"
    >
    <template #icon>
      <UAvatar :alt="studentsStore.selectedStudent.full_name ? studentsStore.selectedStudent.full_name : ''" size="lg" />
    </template>
    <template #description>
      <div class="flex items-center gap-2">
        <span class="text-lg text-gray-600 dark:text-gray-400">
          {{ studentsStore.selectedStudent.email }}
        </span>
      </div>
    </template>
    <div class="flex flex-wrap gap-2 mt-4">
      <UButton
        :color="'white'"
        variant="solid"
        :icon="'i-heroicons-phone-arrow-down-left'"
        >
      {{ studentsStore.selectedStudent.phone_number }}
      </UButton>
      <UButton
        :color="'white'"
        variant="solid"
        :icon="'i-heroicons-calendar-days'"
        >
        {{ formatDate(studentsStore.selectedStudent.birth_date) }}
      </UButton>
    </div>
  </UPageHeader>
    <div v-else>No student selected</div>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/formatters';

definePageMeta({
  layout: "orgs",
});

const studentsStore = useStudentsStore();
const { courses } = useCoursesStore();

const activeCourse = computed(() => {
  const student = studentsStore.selectedStudent;
  if (!student || !student.subscriptions || student.subscriptions.length === 0) return null;
  const activeSubscription = student.subscriptions.find(sub => sub.archived_at === null);
  if (!activeSubscription) return null;
  return courses.find(course => course.id === activeSubscription.course_id) || null;
});

function _deleteStudent() {
  console.log("delete student");
}
</script>

<style scoped></style>
