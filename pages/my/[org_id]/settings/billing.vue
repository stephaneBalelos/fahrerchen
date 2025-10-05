<template>
  <UDashboardPanelContent
    class="p-0 pb-24 divide-y divide-gray-200 dark:divide-gray-800"
  >
    <UDashboardSection
      :title="t('billing_settings.label')"
      :description="t('billing_settings.description')"
      orientation="horizontal"
      class="px-4 pt-8"
    >
    <template #links>
        <UButton
          size="sm"
          color="gray"
          variant="outline"
          square
          icon="mdi-pencil"
          @click="openBillCustomerModal"
        />
    </template>
      <NuxtErrorBoundary>
        <EditBillSettingsForm
          v-if="userOrganizationsStore.selectedOrganization"
          :organization-id="userOrganizationsStore.selectedOrganization.id"
        />
        <template #error="{ error, clearError }">
          <p>An error occurred: {{ error }}</p>

          <button @click="clearError">Clear error</button>
        </template>
      </NuxtErrorBoundary>
    </UDashboardSection>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import EditBillSettingsForm from "~/components/forms/EditBillSettingsForm.vue";
import InvoiceCustomizerModal from "~/components/settings/InvoiceCustomizerModal.vue";

const { t } = useI18n({
  useScope: "local",
});

const userOrganizationsStore = useUserOrganizationsStore();
const modal = useModal();

const openBillCustomerModal = () => {
  if (!userOrganizationsStore.selectedOrganization) return;
  modal.open(InvoiceCustomizerModal, {
    organizationId: userOrganizationsStore.selectedOrganization.id,
  });
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "billing_settings": {
      "label": "Rechnungseinstellungen",
      "description": "Passen Sie Ihre Rechnungseinstellungen an. Diese Einstellungen werden auf alle Rechnungen angewendet, die Sie erstellen."
    }
  },
  "en": {
    "billing_settings": {
      "label": "Billing Settings",
      "description": "Adjust your billing settings. These settings will apply to all invoices you create."
    }
  }
}
</i18n>
