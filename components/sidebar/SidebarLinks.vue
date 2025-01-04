<template>
  <UDashboardSidebarLinks :links="links" />
</template>

<script setup lang="ts">
const userOrganizationsStore = useUserOrganizationsStore();
const userPermissionStore = useUserPermissionsStore();

const { t } = useI18n({
  useScope: "local",
});

const links = computed(() => {
  const selectedOrganization = userOrganizationsStore.selectedOrganization;
  if (!selectedOrganization) {
    return [];
  }
  const items = [];

  items.push({
    id: "dashboard",
    label: t("dashboard"),
    icon: "i-heroicons-chart-pie",
    to: `/my/${selectedOrganization.organization_id}`,
    exact: true,
    tooltip: {
      text: t("dashboard"),
      shortcuts: ["G", "D"],
    },
  });

  items.push({
    id: "schedules",
    label: t("schedules"),
    icon: "i-heroicons-calendar",
    to: `/my/${selectedOrganization.organization_id}/schedules`,
    exact: true,
    tooltip: {
      text: t("schedules"),
      shortcuts: ["G", "S"],
    },
  });
  

  items.push({
    id: "courses",
    label: t("courses"),
    icon: "i-heroicons-book-open",
    to: `/my/${selectedOrganization.organization_id}/courses`,
    exact: true,
    tooltip: {
      text: t("courses"),
      shortcuts: ["G", "C"],
    },
  });

  if (userPermissionStore.hasPermission("students.read")) {
    items.push({
      id: "students",
      label: t("students"),
      icon: "i-heroicons-users",
      to: `/my/${selectedOrganization.organization_id}/students`,
      exact: true,
      tooltip: {
        text: t("students"),
        shortcuts: ["G", "U"],
      },
    });
  }

  items.push({
    id: "bills",
    label: t("bills"),
    icon: "i-heroicons-credit-card",
    to: `/my/${selectedOrganization.organization_id}/bills/`,
    exact: true,
    tooltip: {
      text: t("bills"),
      shortcuts: ["G", "B"],
    },
  });

  if (userPermissionStore.hasPermission("organizations.update")) {
    items.push({
      id: "settings",
      label: t("settings"),
      icon: "i-heroicons-cog-8-tooth",
      to: `/my/${selectedOrganization.organization_id}/settings`,
      exact: true,
      children: [
        {
          label: t("general"),
          to: `/my/${selectedOrganization.organization_id}/settings`,
          exact: true,
        },
        {
          label: t("members"),
          to: `/my/${selectedOrganization.organization_id}/settings/members`,
        },
        {
          label: t("payments"),
          to: `/my/${selectedOrganization.organization_id}/settings/payments`,
        },
      ],
      tooltip: {
        text: t("settings"),
        shortcuts: ["G", "S"],
      },
    });
  }

  return items;
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "dashboard": "Dashboard",
    "schedules": "Stundenpläne",
    "courses": "Kurse",
    "students": "Schüler",
    "bills": "Rechnungen",
    "settings": "Einstellungen",
    "general": "Allgemein",
    "members": "Mitglieder",
    "payments": "Zahlungen"
  },
  "en": {
    "dashboard": "Dashboard",
    "schedules": "Schedules",
    "courses": "Courses",
    "students": "Students",
    "bills": "Bills",
    "settings": "Settings",
    "general": "General",
    "members": "Members",
    "payments": "Payments"
  }
}
</i18n>
