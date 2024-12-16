<script setup lang="ts">


definePageMeta({
  layout: "orgs",
});

const userOrganizationsStore = useUserOrganizationsStore();

const links = [
  [
    {
      label: "General",
      icon: "i-heroicons-user-circle",
      to: `/my/${userOrganizationsStore.selectedOrganization?.organization_id}/settings`,
      exact: true,
    },
    {
      label: "Members",
      icon: "i-heroicons-user-group",
      to: `/my/${userOrganizationsStore.selectedOrganization?.organization_id}/settings/members`,
    },
    {
      label: "Payments",
      icon: "i-heroicons-bell",
      to: `/my/${userOrganizationsStore.selectedOrganization?.organization_id}/settings/payments`,
    },
  ],
  [
    {
      label: "Documentation",
      icon: "i-heroicons-book-open",
      to: "https://ui.nuxt.com/pro",
      target: "_blank",
    },
    {
      label: "Subscription",
      icon: "i-heroicons-credit-card",
      to: `/my/${userOrganizationsStore.selectedOrganization?.organization_id}/settings/subscription`,
    },
  ],
];
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>
      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>
