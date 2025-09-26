<script setup lang="ts">
import CreateOrganizationForm from "~/components/forms/CreateOrganizationForm.vue";
import OrganizationCard from "~/components/ui/Cards/OrganizationCard.vue";


const organizationsStore = useUserOrganizationsStore();
const modal = useModal();

const { t } = useI18n({
  useScope: "local",
});


function openCreateOrgModal() {
  modal.open(CreateOrganizationForm, {
    onClose: () => {
      modal.close();
    },
    onCreated: async () => {
      modal.close();
    },
  })
}
</script>

<template>
    <UDashboardPanelContent>
      <UContainer class="w-full">
        <UPageHeader
          :headline="t('organizations')"
          :title="t('my_organizations')"
          :description="t('description')"
          :links="[
            { label: t('create_new_organization'), click: () => openCreateOrgModal() },
          ]"
        />
        <OrganizationCard
          v-for="org in organizationsStore.organizations"
          :key="org.id"
          :org-id="org.id"
        />
        <UPageCard
          v-if="
            organizationsStore.organizations.length == 0 &&
            !organizationsStore.isLoading
          "
          :title="t('no_organizations_found')"
          :description="t('you_have_not_created_any_organizations_yet')"
        />
        <div v-if="organizationsStore.isLoading" class="space-y-2">
          <USkeleton class="h-24 w-full" />
          <USkeleton class="h-24 w-full" />
        </div>
      </UContainer>
    </UDashboardPanelContent>
</template>

<i18n lang="json">
{
  "de": {
    "organizations": "Fahrschulen",
    "my_organizations": "Meine Fahrschulen",
    "description": "Alle deine Fahrschulen an einem Ort.",
    "no_organizations_found": "Keine Fahrshulen gefunden",
    "you_have_not_created_any_organizations_yet": "Du hast noch keine Fahrschulen erstellt.",
    "create_new_organization": "Neue Fahrschule erstellen",
    "generate_demo_data": "Demo Daten generieren"
  },
  "en": {
    "organizations": "Organizations",
    "my_organizations": "My Drinving Schools",
    "description": "All your driving schools in one place.",
    "no_organizations_found": "No organizations found",
    "you_have_not_created_any_organizations_yet": "You have not created any organizations yet.",
    "create_new_organization": "Create new organization",
    "generate_demo_data": "Generate Demo Data"
  }
}
</i18n>
