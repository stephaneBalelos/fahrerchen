<template>
  <UDashboardSidebarLinks :links="links" />
</template>

<script setup lang="ts">
const userOrganizationsStore = useUserOrganizationsStore();
const userPermissionStore = useUserPermissionsStore();

const links = computed(() => {
  const selectedOrganization = userOrganizationsStore.selectedOrganization;
  if (!selectedOrganization) {
    return [];
  }
  const items = [];

  items.push({
    id: "dashboard",
    label: "Dashboard [NOT IMPLEMENTED]",
    icon: "i-heroicons-chart-pie",
    to: `/my/${selectedOrganization.organization_id}`,
    exact: true,
    tooltip: {
      text: "Dashboard",
      shortcuts: ["G", "D"],
    },
  });

  items.push({
    id: "schedules",
    label: "Schedules",
    icon: "i-heroicons-calendar",
    to: `/my/${selectedOrganization.organization_id}/schedules`,
    exact: true,
    tooltip: {
      text: "Schedules",
      shortcuts: ["G", "S"],
    },
  });
  

  items.push({
    id: "courses",
    label: "Courses",
    icon: "i-heroicons-book-open",
    to: `/my/${selectedOrganization.organization_id}/courses`,
    exact: true,
    tooltip: {
      text: "Courses",
      shortcuts: ["G", "C"],
    },
  });

  if (userPermissionStore.hasPermission("students.read")) {
    items.push({
      id: "students",
      label: "Students",
      icon: "i-heroicons-users",
      to: `/my/${selectedOrganization.organization_id}/students`,
      exact: true,
      tooltip: {
        text: "Students",
        shortcuts: ["G", "U"],
      },
    });
  }

  items.push({
    id: "bills",
    label: "Bills",
    icon: "i-heroicons-credit-card",
    to: `/my/${selectedOrganization.organization_id}/bills/`,
    exact: true,
    tooltip: {
      text: "Bills",
      shortcuts: ["G", "B"],
    },
  });

  if (userPermissionStore.hasPermission("organizations.update")) {
    items.push({
      id: "settings",
      label: "Settings",
      icon: "i-heroicons-cog-8-tooth",
      to: `/my/${selectedOrganization.organization_id}/settings`,
      exact: true,
      children: [
        {
          label: "General [NOT IMPLEMENTED]",
          to: `/my/${selectedOrganization.organization_id}/settings`,
          exact: true,
        },
        {
          label: "Members",
          to: `/my/${selectedOrganization.organization_id}/settings/members`,
        },
        {
          label: "Payments",
          to: `/my/${selectedOrganization.organization_id}/settings/payments`,
        },
      ],
      tooltip: {
        text: "Settings",
        shortcuts: ["G", "S"],
      },
    });
  }

  return items;
});
</script>

<style scoped></style>
