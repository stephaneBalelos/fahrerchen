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
      <UCard
        :ui="{
          body: {
            base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col',
          },
        }"
      >
        <NuxtErrorBoundary>
          <EditBillSettingsForm
            v-if="userOrganizationsStore.selectedOrganization"
            :organization-id="
              userOrganizationsStore.selectedOrganization.organization_id
            "
          />
          <template #error="{ error, clearError }">
            <p>An error occurred: {{ error }}</p>

            <button @click="clearError">Clear error</button>
          </template>
        </NuxtErrorBoundary>
      </UCard>
    </UDashboardSection>
    <UDashboardSection
      :title="t('template.label')"
      :description="t('template.description')"
      orientation="horizontal"
      class="px-4 pt-8"
    >
      <UCard
        :ui="{
          body: {
            base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col',
          },
        }"
      >
        <UButton @click="openInvoiceCustomization">
          {{ t("template.customize") }}
        </UButton>
      </UCard>
    </UDashboardSection>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import InvoiceCustomizerModal from "~/components/settings/InvoiceCustomizerModal.vue";
import EditBillSettingsForm from "~/components/forms/EditBillSettingsForm.vue";

const { t } = useI18n({
  useScope: "local",
});

const modal = useModal();

const userOrganizationsStore = useUserOrganizationsStore();

const openInvoiceCustomization = () => {
  modal.open(InvoiceCustomizerModal);
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "billing_settings": {
      "label": "Rechnungseinstellungen",
      "description": "Passen Sie Ihre Rechnungseinstellungen an. Diese Einstellungen werden auf alle Rechnungen angewendet, die Sie erstellen."
    },
    "template": {
      "label": "Rechnungsvorlage",
      "description": "Passen Sie das Design und die Informationen Ihrer Rechnungen an.",
      "customize": "Rechnung anpassen"
    }
  }
}
</i18n>
