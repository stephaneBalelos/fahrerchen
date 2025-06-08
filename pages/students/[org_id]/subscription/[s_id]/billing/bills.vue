<template>
  <UDashboardPanelContent>
    <UContainer class="w-full py-4">
      <StudentBillsSection :subscription-id="subscription_id" />
    </UContainer>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import StudentBillsSection from "~/components/students/StudentBillsSection.vue";

const route = useRoute();
const subscription_id = route.params.s_id as string;
</script>

<style scoped></style>