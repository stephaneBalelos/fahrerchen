<template>
  <UDashboardPanelContent>
    <UContainer class="w-full py-4">
      <StudentSubscriptionSettlement
        :subscription-id="subscription_id"
        :org-id="org_id"
      />
    </UContainer>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import StudentSubscriptionSettlement from "~/components/students/StudentSubscriptionSettlement.vue";

const route = useRoute();
const subscription_id = route.params.s_id as string;
const org_id = route.params.org_id as string;
</script>

<style scoped></style>
