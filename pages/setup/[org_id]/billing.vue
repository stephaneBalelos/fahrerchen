<template>
  <div class="flex-1 flex flex-col h-full">
    <div
      class="w-full py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
    >
      <UContainer class="w-full">
        <div class="flex items-center gap-4 justify-between">
          <div class="flex flex-col">
            <h3
              class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white mb-2"
            >
              {{ t('setup_your_bill_information')}}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('setup_your_bill_information_description') }}
            </p>
          </div>
        </div>
      </UContainer>
    </div>
    <div class="flex-1 relative">
      <div class="absolute inset-0 py-8 overflow-y-auto">
        <UContainer class="w-full">
          <div v-if="organizationsStore.selectedOrganization">
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
    "setup_your_bill_information": "Richte deine Rechnungseinstellungen ein",
    "setup_your_bill_information_description": "Passen Sie Ihre Rechnungseinstellungen an. Diese Einstellungen werden auf alle Rechnungen angewendet, die Sie erstellen.",
    "billing_settings": {
      "label": "Rechnungseinstellungen",
      "description": "Passen Sie die Rechnungseinstellungen für Ihre Organisation an."
    },
    "continue_setup": "Weiter"
  },
  "en": {
    "setup_your_bill_information": "Set up your billing settings",
    "setup_your_bill_information_description": "Adjust your billing settings. These settings will apply to all invoices you create.",
    "billing_settings": {
      "label": "Billing Settings",
      "description": "Adjust the billing settings for your organization."
    },
    "continue_setup": "Continue"
  }
}
</i18n>
