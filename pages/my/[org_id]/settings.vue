<script setup lang="ts">


definePageMeta({
  layout: "orgs",
});

const userOrganizationsStore = useUserOrganizationsStore();

const { t } = useI18n({
  useScope: "local",
});

const links = [
  [
    {
      label: t("settings"),
      icon: "i-heroicons-cog",
      to: `/my/${userOrganizationsStore.selectedOrganization?.organization_id}/settings`,
      exact: true,
    },
    {
      label: t("members"),
      icon: "i-heroicons-user-group",
      to: `/my/${userOrganizationsStore.selectedOrganization?.organization_id}/settings/members`,
    },
    {
      label: t("payments"),
      icon: "i-heroicons-credit-card",
      to: `/my/${userOrganizationsStore.selectedOrganization?.organization_id}/settings/payments`,
    },
  ],
  [
    {
      label: "Documentation [not implemented]",
      icon: "i-heroicons-book-open",
      target: "_blank",
    }
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

<i18n lang="json">
{
  "en": {
    "settings": "Settings",
    "members": "Members",
    "payments": "Payments",
    "documentation": "Documentation",
    "subscription": "Subscription"
  },
  "de": {
    "settings": "Einstellungen",
    "members": "Mitglieder",
    "payments": "Zahlungen",
    "documentation": "Dokumentation",
    "subscription": "Abonnement"
  }
}
</i18n>
