<template>
  <UPageHeader
    :title="t('setup_your_required_documents_settings')"
    :description="t('setup_your_required_documents_settings_description')"
  >
    <template #links>
      <UButton
        v-if="isRequiredDocumentsSettingsSetupComplete"
        color="primary"
        icon="i-heroicons-check-circle"
        @click="
          () =>
            navigateTo(
              `/setup/${organizationsStore.selectedOrganization?.id}/complete`
            )
        "
        >{{
          t("continue")
        }}</UButton
      >
    </template>
    <div 
    v-if="organizationsStore.selectedOrganization"
      class="py-12 divide-y">
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
const isRequiredDocumentsSettingsSetupComplete = computed(() => {
  return courseCostsStore.courseCosts.length > 0;
});
</script>

<style scoped>

</style>

<i18n lang="json">
{
  "de": {
    "setup_your_required_documents_settings": "Richte deine erforderlichen Dokumente ein",
    "setup_your_required_documents_settings_description": "Lege die erforderlichen Dokumente für deine Kurse fest, um den Lernenden flexible Zugangsmöglichkeiten zu bieten.",
    "continue": "Weiter"
  },
  "en": {
    "setup_your_required_documents_settings": "Set up your required documents settings",
    "setup_your_required_documents_settings_description": "Define the required documents for your courses to provide learners with flexible access.",
    "continue": "Continue"
  }
}
</i18n>