<script setup lang="ts">
import { useGlobalOrgState } from '~/composables/useOrgScope';
import { type Database } from '~/types/database.types';

const route = useRoute()

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { org, orgData } = useGlobalOrgState()

const { data, error } = await useAsyncData('organizations', async () => {
  const { data, error } = await client.from('organizations').select('*')
  if (error) {
    throw error
  }
  console.log(data)
  return data
})

const newOrgName = ref('')
const createOrganization = async () => {
  if(user.value === null) {
    return
  }
  if(newOrgName.value === '') {
    return
  }
  const { data, error } = await client.from('organizations').insert({ name: newOrgName.value, owner_id: user.value.id})
  if (error) {
    throw error
  }
  isOpen.value = false
}

const selectOrg = (o: string) => {
  org.value = o
  navigateTo(`/my/`)

}

const isOpen = ref(false)


</script>

<template>
  <UContainer class="w-full">
    <UPageHeader headline="Organizations" title="My Organizations" description="All your organizations in one place." :links="[{label: 'Create new organization', click: () => isOpen = true}]" />
    <UPageCard class="mb-4" v-for="org in data" :key="org.id" :title="org.name" :description="new Date(org.inserted_at).toLocaleDateString('de')" icon="i-simple-icons-tailwindcss" @click="selectOrg(org.id)" :ui="{wrapper: 'relative group org-card',}" />

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
