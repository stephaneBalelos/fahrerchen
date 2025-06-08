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
const route = useRoute();
const subscription_id = route.params.s_id as string;
const org_id = route.params.org_id as string;
const { t } = useI18n({
  useScope: "local",
});
const subscriptionStore = useSubscriptionStore();

const links = computed(() => {
  if (!subscriptionStore.subscription) {
    return [];
  }
  const l = [
    {
      label: t("subscription_settlements"),
      to: `/students/${org_id}/subscription/${subscription_id}/billing`,
        exact: true,
    },
    {
      label: t("subscription_bills"),
      to: `/students/${org_id}/subscription/${subscription_id}/billing/bills`,
        exact: true,
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
