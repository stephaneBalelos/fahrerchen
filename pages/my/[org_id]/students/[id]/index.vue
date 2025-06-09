<template>
  <UDashboardPanelContent>
    <StudentsStudentSubscriptionStats :subscription-id="subscription_id" />
    <StudentsCourseStudentProgression :subscription-id="subscription_id" />
  </UDashboardPanelContent>
</template>

<script setup lang="ts">

definePageMeta({
  layout: "orgs",
});
const route = useRoute();
const subscription_id = route.params.id as string;


function _deleteStudent() {
  console.log("delete student");
}
</script>

<style scoped></style>


