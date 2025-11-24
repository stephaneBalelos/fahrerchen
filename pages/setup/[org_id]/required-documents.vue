<template>
  <div class="flex-1 flex flex-col h-full">
    <div
      class="w-full py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
    >
      <UContainer class="w-full">
        <UPageHeader
          :title="t('setup_your_required_documents_settings')"
          :description="t('setup_your_required_documents_settings_description')"
        />
      </UContainer>
    </div>
    <div class="flex-1 relative">
      <div class="absolute inset-0 py-8 overflow-y-auto">
        <div
          v-if="organizationsStore.selectedOrganization"
          class="py-12 divide-y"
        >
          <CoursesSettingsCourseRequiredDocumentsList />
        </div>
      </div>
    </div>
    <div
      class="w-full relative py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end px-8"
    >
      <UButton
        v-if="organizationsStore.selectedOrganization"
        :disabled="!isRequiredDocumentsSettingsSetupComplete"
        data-label="next-step"
        :to="`/setup/${organizationsStore.selectedOrganization.id}/complete`"
      >
        {{ t("continue_setup") }}
      </UButton>
    </div>
  </div>
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