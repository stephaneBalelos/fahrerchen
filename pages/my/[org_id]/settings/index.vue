<script setup lang="ts">
import DeleteAccountModal from "~/components/settings/DeleteSchoolModal.vue";


const modal = useModal();

const userOrganizationsStore = useUserOrganizationsStore();

const { t } = useI18n({
  useScope: "local",
});


function openDeleteOrganizationModal() {
  if (!userOrganizationsStore.selectedOrganization?.id) {
    return
  }
  modal.open(DeleteAccountModal, {
    orgId: userOrganizationsStore.selectedOrganization.id
  });
}
</script>

<template>
  <UDashboardPanelContent>
    <div v-if="userOrganizationsStore.selectedOrganization">
      <UDashboardSection
        :title="t('settings.title')"
        description="Customize the look and feel of your dashboard."
      >
        <template #links>
          <UColorModeSelect color="gray" />
        </template>
      </UDashboardSection>
      <UDivider class="mb-4" />
      <FormsEditOrganizationForm
        :org-id="userOrganizationsStore.selectedOrganization.id"
        />
      <UDivider />
      <UDashboardSection
        :title="t('settings.delete_account.title')"
        :description="t('settings.delete_account.description')"
        class="mt-8"
      >
      <template #links>
        <UButton
            color="red"
            :label="t('settings.delete_account.label')"
            size="md"
            @click="openDeleteOrganizationModal"
          />
      </template>

      <div class="py-24" />
      
      </UDashboardSection>
    </div>
  </UDashboardPanelContent>
</template>

<i18n lang="json">
{
  "de": {
    "settings": {
      "title": "Fahrschul-Einstellungen",
      "description": "Informationen über Ihre Fahrschule. Diese Informationen werden auf Rechnungen und anderen Kommunikationsmitteln angezeigt.",
      "delete_account": {
        "title": "Fahrschule löschen",
        "description": "Löschen Sie Ihre Fahrschule und alle damit verbundenen Daten. Diese Aktion kann nicht rückgängig gemacht werden.",
        "label": "Fahrschule löschen"
      }
    },
    "toast_success": {
      "title": "Erfolgreich gespeichert",
      "description": "Ihre Änderungen wurden erfolgreich gespeichert."
    },
    "toast_error": {
      "title": "Fehler beim Speichern",
      "description": "Ihre Änderungen konnten nicht gespeichert werden. Bitte versuchen Sie es erneut."
    }
  },
  "en": {
    "settings": {
      "title": "Driving School Settings",
      "description": "Information about your driving school. This information will be displayed on invoices and other communications.",
      "delete_account": {
        "title": "Delete Driving School",
        "description": "Delete your driving school and all associated data. This action cannot be undone.",
        "label": "Delete Driving School"
      }
    },
    "toast_success": {
      "title": "Successfully saved",
      "description": "Your changes have been successfully saved."
    },
    "toast_error": {
      "title": "Error saving",
      "description": "Your changes could not be saved. Please try again."
    }
  }
}
</i18n>
