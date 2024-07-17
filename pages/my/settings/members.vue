<script setup lang="ts">
import AddMemberForm from '~/components/forms/AddMemberForm.vue';
import type { AppUserWithRole } from '~/types/app.types';
import { type Database } from '~/types/database.types';

const client = useSupabaseClient<Database>()
const { selected_organization_id } = useUserOrganizations()

const { data, error, refresh } = await useAsyncData('members', async () => {
  const { data, error } = await client.from('organization_members').select('role, users(*)').eq('organization_id', selected_organization_id.value)
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
  <div>
    <UDashboardSection
      title="Manage access"
      description="Invite new members by email address."
      orientation="horizontal"
      :ui="{ container: 'lg:sticky top-2' }"
    >
      <template #links>
        <UButton
          id="invite-people"
          label="Invite people"
          color="black"
          @click="isInviteModalOpen = true"
        />
      </template>

      <UCard
        :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
        class="min-w-0"
      >
        <template #header>
          <UInput
            v-model="q"
            icon="i-heroicons-magnifying-glass"
            placeholder="Search members"
            autofocus
          />
        </template>

        <!-- ~/components/settings/MembersList.vue -->
        <SettingsMembersList :members="filteredMembers" />
      </UCard>
    </UDashboardSection>

    <UDashboardModal
      v-model="isInviteModalOpen"
      title="Invite people"
      description="Invite new members by email address"
      :ui="{ width: 'sm:max-w-md', height: 'h-auto' }"
    >
      <!-- ~/components/settings/MembersForm.vue -->
      <AddMemberForm @close="onClose" />
    </UDashboardModal>
  </div>
</template>
