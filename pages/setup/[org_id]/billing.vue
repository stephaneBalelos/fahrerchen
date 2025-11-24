<template>
  <div class="flex-1 flex flex-col h-full">
    <div
      class="w-full py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
    >
      <UContainer class="w-full">
        <UPageHeader
          :title="t('billing_settings.label')"
          :description="t('billing_settings.description')"
        />
      </UContainer>
    </div>
    <div class="flex-1 relative">
      <div class="absolute inset-0 py-8 overflow-y-auto">
        <UContainer class="w-full">
          <div v-if="organizationsStore.selectedOrganization" class="py-12">
            <EditBillSettingsForm
              :organization-id="organizationsStore.selectedOrganization.id"
            />
          </div>
        </UContainer>
      </div>
    </div>
    <div
      class="w-full relative py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end px-8"
    >
      <UButton
        v-if="organizationsStore.selectedOrganization"
        :disabled="!isBillingSettingsSetupComplete"
        data-label="next-step"
        :to="`/setup/${organizationsStore.selectedOrganization.id}/required-documents`"
      >
        {{ t("continue_setup") }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditBillSettingsForm from "~/components/forms/EditBillSettingsForm.vue";

const { t } = useI18n({
  useScope: "local",
});

const organizationsStore = useUserOrganizationsStore();

const isBillingSettingsSetupComplete = computed(() => {
  return true;
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "setup_your_course_activities": "Richte deine Rechnungseinstellungen ein",
    "setup_your_course_activities_description": "Passen Sie Ihre Rechnungseinstellungen an. Diese Einstellungen werden auf alle Rechnungen angewendet, die Sie erstellen.",
    "billing_settings": {
      "label": "Rechnungseinstellungen",
      "description": "Passen Sie die Rechnungseinstellungen für Ihre Organisation an."
    },
    "continue": "Weiter"
  },
  "en": {
    "setup_your_course_activities": "Set up your billing settings",
    "setup_your_course_activities_description": "Adjust your billing settings. These settings will apply to all invoices you create.",
    "billing_settings": {
      "label": "Billing Settings",
      "description": "Adjust the billing settings for your organization."
    },
    "continue": "Continue"
  }
}
</i18n>
