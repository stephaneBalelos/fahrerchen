<script setup lang="ts">
import CreateOrganizationForm from "~/components/forms/CreateOrganizationForm.vue";
import OrganizationCard from "~/components/ui/Cards/OrganizationCard.vue";

const organizationsStore = useUserOrganizationsStore();

const isGeneratingDemoData = ref(false);

const modal = useModal();

const { t } = useI18n({
  useScope: "local",
});

function openCreateOrgModal() {
  modal.open(CreateOrganizationForm, {
    onClose: () => {
      modal.close();
    },
    onCreated: () => {
      organizationsStore.loadOrganizationsMemberships();
    },
  })
}

async function generateDemoData() {
  if (isGeneratingDemoData.value) return;
  isGeneratingDemoData.value = true;

  try {
    const _res = await $fetch("/api/demo/generate", {
      retry: 0
    });
    organizationsStore.loadOrganizationsMemberships();
  } catch (error) {
    console.error(error);
  } finally {
    isGeneratingDemoData.value = false;
  }
}
</script>

<template>
  <UContainer class="w-full">
    <UPageHeader
      :headline="t('organizations')"
      :title="t('my_organizations')"
      :description="t('description')"
      :links="[
        { label: t('create_new_organization'), click: () => openCreateOrgModal() },
        { label: t('generate_demo_data'), click: () => generateDemoData(), loading: isGeneratingDemoData },
      ]"
    />
    <OrganizationCard
      v-for="org in organizationsStore.organizations"
      :key="org.organization_id"
      :org-id="org.organization_id"
    />

    <UPageCard
      v-if="
        organizationsStore.organizations.length == 0 &&
        !organizationsStore.isLoading
      "
      :title="t('no_organizations_found')"
      :description="t('you_have_not_created_any_organizations_yet')"
      icon="i-simple-icons-tailwindcss"
    />

    <div v-if="organizationsStore.isLoading" class="space-y-2">
      <USkeleton class="h-24 w-full" />
      <USkeleton class="h-24 w-full" />
    </div>

  </UContainer>
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
    "my_organizations": "My Organizations",
    "description": "All your organizations in one place.",
    "no_organizations_found": "No organizations found",
    "you_have_not_created_any_organizations_yet": "You have not created any organizations yet.",
    "create_new_organization": "Create new organization",
    "generate_demo_data": "Generate Demo Data"
  }
}
</i18n>
