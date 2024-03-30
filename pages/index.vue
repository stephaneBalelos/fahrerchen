<script setup lang="ts">
import { useGlobalOrgState } from '~/composables/useOrgScope';
import Orgs from '~/layouts/orgs.vue';
import { type Database } from '~/types/database.types';

const route = useRoute()

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { org, orgData } = useGlobalOrgState()

const { data, error } = await useAsyncData('organisations', async () => {
  const { data, error } = await client.from('organisations').select('*')
  if (error) {
    throw error
  }
  console.log(data)
  return data
})

const newOrgName = ref('')
const createOrganization = async () => {
  console.log(user.value)
  if(user.value === null) {
    return
  }
  if(newOrgName.value === '') {
    return
  }
  const { data, error } = await client.from('organisations').insert({ name: newOrgName.value, owner_id: user.value.id})
  if (error) {
    throw error
  }
  console.log(data)
  isOpen.value = false
}

const selectOrg = (o: string) => {
  org.value = o
  navigateTo(`/my/`)

}

const isOpen = ref(false)


</script>

<template>
  <UContainer>
    <UPageHeader headline="Organizations" title="My Organizations" description="All your organizations in one place." />
    <UDashboardToolbar>
      <template #left>
        <USelectMenu icon="i-heroicons-check" placeholder="Status" multiple />
        <USelectMenu icon="i-heroicons-map-pin" placeholder="Location" multiple />
      </template>

      <template #right>
        <USelectMenu label="Display" icon="i-heroicons-computer-desktop" multiple />
        <UButton @click="isOpen = true">Create an Organization</UButton>
      </template>
    </UDashboardToolbar>
    <UPageCard v-for="org in data" :key="org.id" :title="org.name" :description="'Dasds'" icon="i-simple-icons-tailwindcss" @click="selectOrg(org.id)" />

    <UPageCard v-if="data?.length == 0" :title="'No organizations found'"
      :description="'You have not created any organizations yet.'"
      icon="i-simple-icons-tailwindcss" />
      
      <UModal v-model="isOpen" >
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
    </UModal>
  </UContainer>

</template>
