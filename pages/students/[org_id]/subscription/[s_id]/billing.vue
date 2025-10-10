<template>
  <UDashboardPanelContent class="p-0">
    <UDashboardToolbar class="py-0">
      <UContainer class="w-full py-0">
        <UHorizontalNavigation :links="links" />
      </UContainer>
    </UDashboardToolbar>
    <NuxtPage />
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
const { t } = useI18n({
  useScope: "local",
});
const studentStore = useStudentStore();

const links = computed(() => {
  if (!studentStore.selectedSubscription) {
    return [];
  }
  const l = [
    {
      label: t("subscription_settlements"),
      to: `/students/${studentStore.selectedSubscription.organization_id}/subscription/${studentStore.selectedSubscription.id}/billing`,
        exact: true,
    },
    {
      label: t("subscription_bills"),
      to: `/students/${studentStore.selectedSubscription.organization_id}/subscription/${studentStore.selectedSubscription.id}/billing/bills`,
    },
  ];

  return l;
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "subscription_settlements": "Abrechnungen",
    "subscription_bills": "Rechnungen"
  },
  "en": {
    "subscription_settlements": "Settlements",
    "subscription_bills": "Bills"
  }
}
</i18n>
