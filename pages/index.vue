<script setup lang="ts">
import OrganizationCard from "~/components/ui/Cards/OrganizationCard.vue";
import type { AppOrganization, AppOrganizationMember } from "~/types/app.types";
import { type Database } from "~/types/app.types";

const client = useSupabaseClient<Database>();
const organizationsStore = useUserOrganizationsStore();

const { t } = useI18n({
  useScope: "local",
});

const newOrgName = ref("");

// const createOrganization = async () => {
//   if(user.value === null) {
//     return
//   }
//   if(newOrgName.value === '') {
//     return
//   }
//   const { data, error } = await client.from('organizations').insert({ name: newOrgName.value, owner_id: user.value.id})
//   if (error) {
//     throw error
//   }
//   isOpen.value = false
// }

function selectOrg(org: AppOrganizationMember) {
  organizationsStore.selectedOrganization = org;
}

function openCreateOrgModal() {
  console.log("openCreateOrgModal");
}
</script>

<template>
  <UContainer class="w-full">
    <UPageHeader
      :headline="t('organizations')"
      :title="t('my_organizations')"
      :description="t('description')"
      :links="[
        { label: t('create_new_organization'), click: () => openCreateOrgModal },
      ]"
    />
    <OrganizationCard
      v-for="org in organizationsStore.organizations"
      :org_id="org.organization_id"
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

    <!-- <UModal v-model="isOpen" >
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Your new organization
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <UInput v-model="newOrgName" label="Name" placeholder="Enter the name of your organization" />

        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton color="gray" variant="ghost" @click="isOpen = false">Cancel</UButton>
            <UButton @click="createOrganization">Create</UButton>
          </div>
        </template>
      </UCard>
    </UModal> -->
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
    "create_new_organization": "Neue Fahrschule erstellen"
  },
  "en": {
    "organizations": "Organizations",
    "my_organizations": "My Organizations",
    "description": "All your organizations in one place.",
    "no_organizations_found": "No organizations found",
    "you_have_not_created_any_organizations_yet": "You have not created any organizations yet.",
    "create_new_organization": "Create new organization"
  }
}
</i18n>
