<template>
  <UDashboardPanelContent>
    <UDashboardSection
      :title="t('billing')"
      :description="t('billing_description')"
    >
      <UFormGroup
        :label="t('settings.template.label')"
        class="grid grid-cols-2 gap-2"
        :description="t('settings.template.description')"
        :ui="{
          container: 'flex flex-wrap items-center gap-3',
          help: 'mt-0',
        }"
      >
        <UButton @click="openInvoiceCustomization">
          {{ t("settings.template.customize") }}
        </UButton>
      </UFormGroup>
    </UDashboardSection>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import InvoiceCustomizerModal from '~/components/settings/InvoiceCustomizerModal.vue';

const { t } = useI18n({
  useScope: "local",
});

const modal = useModal();

const openInvoiceCustomization = () => {
  modal.open(InvoiceCustomizerModal)
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "billing": "Abrechnung",
    "billing_description": "Hier können Sie Ihre Abrechnungseinstellungen verwalten.",
    "settings.template.label": "Rechnungsvorlage",
    "settings.template.description": "Passen Sie das Design und die Informationen Ihrer Rechnungen an.",
    "settings.template.customize": "Rechnung anpassen"
  },
    "en": {
        "billing": "Billing",
        "billing_description": "Manage your billing settings here.",
        "settings.template.label": "Invoice Template",
        "settings.template.description": "Customize the design and information of your invoices.",
        "settings.template.customize": "Customize Invoice"
    }
}
</i18n>
