<template>
    
  <UContainer class="w-full">
      <StudentsStudentActivitiesSection
        v-if="studentStore.subscription"
        :subscription_id="studentStore.subscription?.id"
      />
  </UContainer>
</template>

<script setup lang="ts">

const studentStore = useStudentStore();
</script>

<style scoped></style>
