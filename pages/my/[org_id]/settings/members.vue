<script setup lang="ts">
import AddMemberForm from '~/components/forms/AddMemberForm.vue';
import InvitationList from '~/components/settings/InvitationList.vue';
import type { AppUserWithRole, Database } from '~/types/app.types';

const client = useSupabaseClient<Database>()
const userOrganizationsStore = useUserOrganizationsStore()

const { t } = useI18n({
  useScope: 'local'
})

const { data, refresh } = await useAsyncData('members', async () => {
  if (!userOrganizationsStore.selectedOrganization) {
    return null
  }
  const { data, error } = await client.from('organization_members').select('role, users(*)').eq('organization_id', userOrganizationsStore.selectedOrganization.organization_id)
  if (error) {
    throw error
  }
  return data.map((m) => {
    return {
      role: m.role,
      ...m.users
    } as AppUserWithRole
  })
})
const q = ref('')
const isInviteModalOpen = ref(false)

const filteredMembers = computed(() => {
    if (!data.value) return []
    return data.value.filter((member) => {
        return member.firstname?.search(new RegExp(q.value, 'i')) !== -1 || member.lastname?.search(new RegExp(q.value, 'i')) !== -1
    })
})

async function onClose() {
  refresh()
  isInviteModalOpen.value = false
}
</script>

<template>
  <UDashboardPanelContent>
    <div>
      <UDashboardSection
        :title="t('manage_access')"
        :description="t('invite_new_members')"
        orientation="horizontal"
        :ui="{ container: 'lg:sticky top-2' }"
      >
        <template #links>
          <UButton
            id="invite-people"
            :label="t('invite_people')"
            color="black"
            @click="isInviteModalOpen = true"
          />
        </template>
        <div class="flex flex-col gap-4">
          <UCard
            :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
            class="min-w-0"
          >
            <template #header>
              <UInput
                v-model="q"
                icon="i-heroicons-magnifying-glass"
                :placeholder="t('search_members')"
                autofocus
              />
            </template>
            <!-- ~/components/settings/MembersList.vue -->
            <SettingsMembersList :members="filteredMembers" />
          </UCard>
          <InvitationList v-if="userOrganizationsStore.selectedOrganization" :orgid="userOrganizationsStore.selectedOrganization.organization_id" />
        </div>
      </UDashboardSection>
      <UDashboardModal
        v-model="isInviteModalOpen"
        :title="t('invite_people')"
        :description="t('invite_new_members')"
        :ui="{ width: 'sm:max-w-md', height: 'h-auto' }"
      >
        <!-- ~/components/settings/MembersForm.vue -->
        <AddMemberForm v-if="userOrganizationsStore.selectedOrganization?.organization_id" :orgid="userOrganizationsStore.selectedOrganization.organization_id" @close="onClose" />
      </UDashboardModal>
    </div>
  </UDashboardPanelContent>
</template>

<i18n lang="json">
{
  "de": {
    "manage_access": "Zugriff verwalten",
    "invite_new_members": "Neue Mitglieder per E-Mail-Adresse einladen",
    "invite_people": "Personen einladen",
    "search_members": "Mitglieder suchen"
  },
  "en": {
    "manage_access": "Manage access",
    "invite_new_members": "Invite new members by email address",
    "invite_people": "Invite people",
    "search_members": "Search members"
  }
} 
</i18n>
