<template>
  <div class="flex-1 flex flex-col h-full">
    <div
      class="w-full py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
    >
      <UContainer class="w-full max-w-6xl">
        <div class="flex items-center gap-4 justify-between">
          <div class="flex flex-col">
            <h3
              class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white mb-2"
            >
              {{ t('setup_your_costs_settings')}}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('setup_your_costs_settings_description') }}
            </p>
          </div>
        </div>
      </UContainer>
    </div>
    <div class="flex-1 relative">
      <div class="absolute inset-0 py-8 overflow-y-auto">
        <UContainer class="w-full max-w-6xl">
          <div
            v-if="organizationId"
          >
            <CoursesSettingsCourseCostsList :org-id="organizationId" />
          </div>
        </UContainer>
      </div>
    </div>
    <div
      class="w-full relative py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end px-8"
    >
      <UButton
        :disabled="!isCostSettingsSetupComplete"
        data-label="next-step"
        :to="`/setup/${organizationId}/billing`"
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

const route = useRoute();

const organizationId = route.params.org_id as string;

const isCostSettingsSetupComplete = computed(() => {
  return courseCostsStore.courseCosts.length > 0;
});
</script>

<style scoped></style>

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
