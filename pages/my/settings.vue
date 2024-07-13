<script setup lang="ts">


definePageMeta({
  layout: "orgs",
});
const links = [
  [
    {
      label: "General",
      icon: "i-heroicons-user-circle",
      to: "/my/settings",
      exact: true,
    },
    {
      label: "Members",
      icon: "i-heroicons-user-group",
      to: "/my/settings/members",
    },
    {
      label: "Payments",
      icon: "i-heroicons-bell",
      to: "/my/settings/payments",
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
      to: "/my/settings/subscription",
    },
  ],
];
</script>

<template>
  <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
    <UHorizontalNavigation :links="links" />
  </UDashboardToolbar>
  <UDashboardPanelContent>

    <NuxtPage />
  </UDashboardPanelContent>
</template>
