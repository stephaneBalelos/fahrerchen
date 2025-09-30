<template>
  <UDashboardPanelContent>
    <!-- <StudentsStudentSubscriptionStats :subscription-id="subscription_id" />
    <StudentsCourseStudentProgression :subscription-id="subscription_id" /> -->
    <div v-if="studentsStore.selectedStudent">
      {{ studentsStore.selectedStudent.full_name}}
    </div>
    <div v-else>
      No student selected
    </div>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">

definePageMeta({
  layout: "orgs",
});

const studentsStore = useStudentsStore();



function _deleteStudent() {
  console.log("delete student");
}
</script>

<style scoped></style>


