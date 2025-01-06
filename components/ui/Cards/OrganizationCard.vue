<template>
    <UPageCard
        v-if="organization"
      :key="organization.id"
      class="mb-4"
      :title="organization.name"
      :description="organization.inserted_at"
      :ui="{ wrapper: 'relative group org-card' }"
    @click="navigateTo(`/my/${organization.id}`)"
    >
    <template #icon>
        <UAvatar
            :src="organization.avatar"
            :alt="organization.name"
            size="lg"
        />
    </template>
    </UPageCard>
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';

type Props = {
    orgId: string
}
const props = defineProps<Props>()
const supabase = useSupabaseClient<Database>()

const config = useRuntimeConfig().public

const { data: organization } = useAsyncData(`organization_${props.orgId}`, async () => {
    const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', props.orgId).single()
    if (error) {
        throw error
    }
    console.log(data)
    return data
}, {
    transform: (data) => {
        return {
            ...data,
            avatar: data.avatar_path ? `${config.supabase_storage_url}/object/public/organizations_avatars/${data.avatar_path}` : undefined
        }
    }
})
</script>

<style scoped>

</style>