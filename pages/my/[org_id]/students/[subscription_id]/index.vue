<template>
  <UDashboardPanelContent>
    <!-- <StudentsStudentSubscriptionStats :subscription-id="subscription_id" />
    <StudentsCourseStudentProgression :subscription-id="subscription_id" /> -->
    <div v-if="subscriptionStore.selectedSubscription">
      <StudentsStudentSubscriptionStats
        :subscription-id="subscriptionStore.selectedSubscription.id"
      />
      <StudentsCourseStudentProgression
        :subscription="subscriptionStore.selectedSubscription"
      />
    </div>
    <div v-else>No student selected</div>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">

definePageMeta({
  layout: "orgs",
});

const studentsStore = useStudentsStore();
const subscriptionStore = useSubscriptionStore();

const _student = computed(() => {
  if (!subscriptionStore.selectedSubscription) return null;
  return studentsStore.students.find(
    (s) => s.id === (subscriptionStore.selectedSubscription?.student_id ?? "")
  );
});

function _deleteStudent() {
  console.log("delete student");
}
</script>

<style scoped></style>
