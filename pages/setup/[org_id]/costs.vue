<template>
  <UPageHeader
    :title="t('setup_your_costs_settings')"
    :description="t('setup_your_costs_settings_description')"
  >
    <template #links>
      <UButton
        v-if="isCostSettingsSetupComplete"
        data-label="next-step"
        color="primary"
        icon="i-heroicons-check-circle"
        @click="() => navigateTo(`/setup/${organizationsStore.selectedOrganization?.id}/billing`)"
        >{{
          t("continue")
        }}</UButton
      >
    </template>
    <div 
    v-if="organizationsStore.selectedOrganization"
      class="py-12 divide-y">
    <CoursesSettingsCourseCostsList/>
    </div>
  </UPageHeader>
</template>

<script setup lang="ts">


const { t } = useI18n({
  useScope: "local",
});


const courseCostsStore = useCourseCostsStore();

const organizationsStore = useUserOrganizationsStore();
const isCostSettingsSetupComplete = computed(() => {
  return courseCostsStore.courseCosts.length > 0;
});
</script>

<style scoped>

</style>

<i18n lang="json">
{
  "de": {
    "setup_your_costs_settings": "Richte deine Kosten-Einstellungen ein",
    "setup_your_costs_settings_description": "Lege die Kosten-Optionen für deine Kurse fest, um den Lernenden flexible Zugangsmöglichkeiten zu bieten.",
    "continue": "Weiter"
  },
  "en": {
    "setup_your_costs_settings": "Set up your costs settings",
    "setup_your_costs_settings_description": "Define the costs options for your courses to provide learners with flexible access.",
    "continue": "Continue"
  }
}
</i18n>