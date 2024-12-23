<template>
  <UContainer class="w-full">
    <StudentBillsSection v-if="studentStore.subscription":subscription_id="studentStore.subscription.id" />
  </UContainer>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import StudentBillsSection from "~/components/students/StudentBillsSection.vue";

const studentStore = useStudentStore();
const client = useSupabaseClient<Database>();

</script>

<style scoped></style>

