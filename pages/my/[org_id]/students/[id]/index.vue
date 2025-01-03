<template>
  <div>
    <StudentsCourseStudentProgression :subscription-id="subscription_id" />
    <div class="grid grid-cols-2 gap-4 mt-4">
      <StudentsStudentActivitiesSection
        :subscription_id="subscription_id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: "orgs",
});

type Props = {
  subscription_id: string;
};

const { subscription_id } = useAttrs() as Props;


function _deleteStudent() {
  console.log("delete student");
}
</script>

<style scoped></style>


