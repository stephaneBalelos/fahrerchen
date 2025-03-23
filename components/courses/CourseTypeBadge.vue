<template>
  <UBadge 
    v-if="data && status === 'success'"
    :icon="COURSE_ICONS[data.type]"
    size="xs"
    color="primary"
    :variant="'soft'"
  >Class {{ data.type }}</UBadge>
  <USkeleton v-else class="h-4 w-16" />

</template>

<script setup lang="ts">
import { COURSE_ICONS } from '~/constants';
import type { Database } from '~/types/app.types';


type Props = {
    id: number
}

const props = defineProps<Props>()
const client = useSupabaseClient<Database>()

const { data, status } = useAsyncData(`course_type_${props.id}`, async () => {
    const { data, error } = await client.from('course_types').select('*').eq('id', props.id).single()

    if (error) {
        console.log(error)
        throw error
    }

    return data
})

</script>

<style scoped>

</style>