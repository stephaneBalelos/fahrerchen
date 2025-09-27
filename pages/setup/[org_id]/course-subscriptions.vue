<template>
  <UPageHeader
    :title="t('setup_your_subscriptions_settings')"
    :description="t('setup_your_subscriptions_settings_description')"
  >
    <template #links>
      <UButton
        v-if="isSubscriptionSettingsSetupComplete"
        color="primary"
        icon="i-heroicons-check-circle"
        >{{
          t("continue")
        }}</UButton
      >
    </template>
    <div 
    v-if="organizationsStore.selectedOrganization"
      class="py-12 divide-y">
    <CoursesSettingsCourseCostsList/>
    <CoursesSettingsCourseRequiredDocumentsList />
    </div>
  </UPageHeader>
</template>

<script setup lang="ts">


const { t } = useI18n({
  useScope: "local",
});


const courseCostsStore = useCourseCostsStore();

const organizationsStore = useUserOrganizationsStore();
const isSubscriptionSettingsSetupComplete = computed(() => {
  return courseCostsStore.courseCosts.length > 0;
});
</script>

<style scoped>

</style>

<i18n lang="json">
{
  "de": {
    "setup_your_subscriptions_settings": "Richte deine Abonnement-Einstellungen ein",
    "setup_your_subscriptions_settings_description": "Lege die Abonnement-Optionen für deine Kurse fest, um den Lernenden flexible Zugangsmöglichkeiten zu bieten.",
    "continue": "Weiter"
  },
  "en": {
    "setup_your_subscriptions_settings": "Set up your subscription settings",
    "setup_your_subscriptions_settings_description": "Define the subscription options for your courses to provide learners with flexible access.",
    "continue": "Continue"
  }
}
</i18n>