<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar :title="t('title')" />
            <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
                <UHorizontalNavigation :links="links" />
            </UDashboardToolbar>
            <NuxtPage />
        </UDashboardPanel>
    </UDashboardPage>
</template>

<script setup lang="ts">

definePageMeta({
  layout: "orgs",
});

const { t } = useI18n({
  useScope: "local",
});

const userOrganizationsStore = useUserOrganizationsStore();

const links = computed(() => {
  if (!userOrganizationsStore.selectedOrganization) {
    return [];
  }
  return [
    [
      {
        label: t("overview"),
        icon: "i-heroicons-home",
        to: `/my/${userOrganizationsStore.selectedOrganization.id}/courses`,
        exact: true,
      },
      {
        label: t("activities"),
        icon: "i-heroicons-chart-bar",
        to: `/my/${userOrganizationsStore.selectedOrganization.id}/courses/activities`,
      },
      {
        label: t("costs"),
        icon: "i-heroicons-currency-dollar",
        to: `/my/${userOrganizationsStore.selectedOrganization.id}/courses/costs`,
      },
    ],
    [
      {
        label: "Documentation [not implemented]",
        icon: "i-heroicons-book-open",
        target: "_blank",
      },
    ],
  ];
});
</script>

<style scoped>

</style>

<i18n lang="json">
{
  "de": {
    "title": "Kurseangebote",
    "overview": "Übersicht",
    "activities": "Aktivitäten",
    "costs": "Kosten"
  },
    "en": {
        "title": "Course offerings",
        "overview": "Overview",
        "activities": "Activities",
        "costs": "Costs"
    }
}
</i18n>