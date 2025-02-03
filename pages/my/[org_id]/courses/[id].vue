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

const { t } = useI18n({
  useScope: 'local'
}); 

const links = computed(() => [
  [
    {
      label: t('general'),
      icon: "i-heroicons-user-circle",
      to: userOrganizationsStore.relativePath(`/courses/${route.params.id}`),
      exact: true,
    },
    {
      label: t('students'),
      icon: "i-heroicons-user-group",
      to: userOrganizationsStore.relativePath(`/courses/${route.params.id}/students`),
    },
  ],
  [
    {
      label: t('settings'),
      icon: "i-heroicons-cog-6-tooth",
      to: userOrganizationsStore.relativePath(`/courses/${route.params.id}/settings`),
    },
  ],
]);
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "general": "Übersicht",
    "students": "Teilnehmer",
    "settings": "Einstellungen"
  }, 
  "en": {
    "general": "General",
    "students": "Students",
    "settings": "Settings"
  }
}
</i18n>
