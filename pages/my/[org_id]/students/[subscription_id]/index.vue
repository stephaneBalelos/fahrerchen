<template>
  <UDashboardPanelContent>
    <!-- <StudentsStudentSubscriptionStats :subscription-id="subscription_id" />
    <StudentsCourseStudentProgression :subscription-id="subscription_id" /> -->
    <UPageHeader
      v-if="student"
      :title="`${student.firstname} ${student.lastname}`"
      :ui="{
        wrapper: 'py-4 pb-4',
      }"
    >
    <template #icon>
      <UAvatar :alt="student.full_name ? student.full_name : ''" size="lg" />
    </template>
    <template #description>
      <div class="flex items-center gap-2">
        <span class="text-lg text-gray-600 dark:text-gray-400">
          {{ student.email }}
        </span>
      </div>
    </template>
    <div class="flex flex-wrap gap-2 mt-4">
      <UButton
        :color="'white'"
        variant="solid"
        :icon="'i-heroicons-phone-arrow-down-left'"
        >
      {{ student.phone_number }}
      </UButton>
      <UButton
        :color="'white'"
        variant="solid"
        :icon="'i-heroicons-calendar-days'"
        >
    {{ formatDate(student.birth_date) }}
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
const subscriptionStore = useSubscriptionStore();

const student = computed(() => {
  if (!subscriptionStore.selectedSubscription) return null;
  return studentsStore.students.find(
    (s) => s.id === (subscriptionStore.selectedSubscription?.student_id ?? "")
  );  
});

if (!subscriptionStore.selectedSubscription) {
  // Throw error if no subscription found
  throw new Error("No subscription found");
}

function _deleteStudent() {
  console.log("delete student");
}
</script>

<style scoped></style>
