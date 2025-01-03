<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardToolbar>
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>
      <NuxtPage :courseid="courseid" />
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">

definePageMeta({
  layout: "orgs",
});

const route = useRoute();
const userOrganizationsStore = useUserOrganizationsStore();
const courseid = route.params.id as string;

const links = [
  [
    {
      label: "General",
      icon: "i-heroicons-user-circle",
      to: userOrganizationsStore.relativePath(`/courses/${route.params.id}`),
      exact: true,
    },
    {
      label: "Students",
      icon: "i-heroicons-user-group",
      to: userOrganizationsStore.relativePath(`/courses/${route.params.id}/students`),
    },
  ],
  [
    {
      label: "Einstellungen",
      icon: "i-heroicons-cog-6-tooth",
      to: userOrganizationsStore.relativePath(`/courses/${route.params.id}/settings`),
    },
  ],
];
</script>

<style scoped></style>
