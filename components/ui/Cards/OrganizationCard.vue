<template>
    <UPageCard
        v-if="organization"
      class="mb-4"
      :key="organization.id"
      :title="organization.name"
      :description="organization.inserted_at"
      :icon="organizationsStore.selectedOrganization?.organization_id == organization?.id ? 'i-simple-icons-tailwindcss' : ''"
      :ui="{ wrapper: 'relative group org-card' }"
    @click="organizationsStore.selectOrganization(organization.id)"
    />
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';

type Props = {
    org_id: string
}
const props = defineProps<Props>()
const supabase = useSupabaseClient<Database>()
const organizationsStore = useUserOrganizationsStore()

const { data: organization, error, status } = useAsyncData(`organization_${props.org_id}`, async () => {
    const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', props.org_id).single()
    if (error) {
        throw error
    }
    return data
})
</script>

<style scoped>

</style>