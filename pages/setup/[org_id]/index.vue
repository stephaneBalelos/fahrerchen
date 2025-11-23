<template>
  <UDashboardCard class="py-2">
    <template #header>
      <div
        class="flex items-center gap-4 justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-4"
      >
        <div class="flex flex-col">
          <h3
            class="text-xl font-semibold leading-6 text-gray-900 dark:text-white mb-2"
          >
            {{ t("driving_school_informations") }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t("please_verify") }}
          </p>
        </div>
        <UButton
          v-if="organizationsStore.selectedOrganization"
          data-label="next-step"
          :to="`/setup/${organizationsStore.selectedOrganization.id}/courses`"
        >
          {{ t("continue_setup") }}
        </UButton>
      </div>
    </template>
    <div v-if="!organizationsStore.selectedOrganization" class="space-y-2">
      <USkeleton v-if="organizationsStore.isLoading" class="h-24 w-full" />
      <UAlert
        v-else
        icon="i-heroicons-exclamation-triangle-20-solid"
        color="red"
        variant="subtle"
        :title="t('error_loading_organization')"
        :description="t('error_loading_organization_description')"
      />
    </div>
    <div v-if="organizationsStore.selectedOrganization">
      <FormsEditOrganizationForm
        :org-id="organizationsStore.selectedOrganization.id"
      />
    </div>
  </UDashboardCard>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const { t } = useI18n({
  useScope: "local",
});

const organizationsStore = useUserOrganizationsStore();
</script>

<style></style>

<i18n lang="json">
{
  "de": {
    "driving_school_informations": "Fahrschul-Informationen",
    "please_verify": "Bitte überprüfen und/oder vervollständigen Sie die Informationen Ihrer Fahrschule, bevor Sie mit dem Einrichtungsprozess fortfahren.",
    "continue_setup": "Einrichtung fortsetzen",
    "error_loading_organization": "Fehler beim Laden der Fahrschulinformationen",
    "error_loading_organization_description": "Es gab ein Problem beim Laden der Informationen Ihrer Fahrschule. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support, wenn das Problem weiterhin besteht."
  },
  "en": {
    "driving_school_informations": "Driving school informations",
    "please_verify": "Please verify and/or complete the informations of your driving school before continuing the setup process.",
    "continue_setup": "Continue setup",
    "error_loading_organization": "Error loading driving school informations",
    "error_loading_organization_description": "There was a problem loading the informations of your driving school. Please try again or contact support if the problem persists."
  }
}
</i18n>
