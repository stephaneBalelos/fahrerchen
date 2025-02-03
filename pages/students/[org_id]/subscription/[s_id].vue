<template>
  <UDashboardPanelContent class="p-0">
    <UDashboardToolbar class="p-0">
      <UContainer class="w-full p-0">
          <UHorizontalNavigation :links="links" />
      </UContainer>
    </UDashboardToolbar>
    <NuxtPage />
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
const userOrganizationsStore = useUserOrganizationsStore();

const { t } = useI18n({
  useScope: "local",
});
const route = useRoute();
const subscription_id = route.params.s_id as string;

const links = computed(() => {
  if (!userOrganizationsStore.selectedOrganization) {
    return [];
  }

  const l = [
    {
      label: t("overview"),
      icon: "i-heroicons-home",
      to: `/students/${userOrganizationsStore.selectedOrganization.organization_id}/subscription/${subscription_id}`,
      exact: true,
    },
    // {
    //   label: t("course"),
    //   icon: "i-heroicons-home",
    //   to: `/students/${userOrganizationsStore.selectedOrganization.organization_id}/subscription/${subscription_id}/courses`,
    //   exact: true,
    // },
    {
      label: t("bills"),
      icon: "i-heroicons-document",
      to: `/students/${userOrganizationsStore.selectedOrganization.organization_id}/subscription/${subscription_id}/bills`,
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
    "overview": "Übersicht",
    "course": "Kurs",
    "bills": "Rechnungen"
  },
  "en": {
    "overview": "Overview",
    "course": "Course",
    "bills": "Bills"
  }
}
</i18n>
