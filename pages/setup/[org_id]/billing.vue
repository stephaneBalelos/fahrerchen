<template>
  <UPageHeader
    :title="t('setup_your_course_activities')"
    :description="t('setup_your_course_activities_description')"
  >
    <template #links>
      <UButton
        v-if="isBillingSettingsSetupComplete"
        data-label="next-step"
        color="primary"
        icon="i-heroicons-check-circle"
        @click="
          () =>
            navigateTo(
              `/setup/${organizationsStore.selectedOrganization?.id}/required-documents`
            )
        "
        >{{ t("continue") }}</UButton
      >
    </template>
    <div v-if="organizationsStore.selectedOrganization" class="py-12">
      <UDashboardSection
        :title="t('billing_settings.label')"
        :description="t('billing_settings.description')"
        orientation="horizontal"
        class="px-4"
      >
        <EditBillSettingsForm
          :organization-id="organizationsStore.selectedOrganization.id"
        />
      </UDashboardSection>
    </div>
  </UPageHeader>
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
