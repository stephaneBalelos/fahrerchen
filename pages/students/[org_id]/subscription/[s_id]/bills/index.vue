<template>
  <UContainer class="w-full">
    <StudentSubscriptionSettlement :subscription-id="subscription_id" :org-id="org_id" />
    <StudentBillsSection :subscription-id="subscription_id" />
  </UContainer>
</template>

<script setup lang="ts">
import StudentBillsSection from "~/components/students/StudentBillsSection.vue";
import StudentSubscriptionSettlement from "~/components/students/StudentSubscriptionSettlement.vue";

const route = useRoute();
const subscription_id = route.params.s_id as string;
const org_id = route.params.org_id as string;

</script>

<style scoped></style>

