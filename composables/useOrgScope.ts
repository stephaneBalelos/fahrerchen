// store.js
import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import type { Database } from '~/types/database.types'
import { error } from 'console'

export const useGlobalOrgState = createGlobalState(() => {
    const org = ref<string | null>(null)
    const orgData = ref()

    const supabase = useSupabaseClient<Database>()

    watch(() => org.value, async () => {
        console.log('org changed', org.value)
        if (org.value === null) {
            navigateTo('/')
            return;
        }
        const { data, error } = await supabase.from('organisations').select('*').eq('id', org.value).single();
        if (error) {
            console.error(error)
            return
        }
        orgData.value = data
        navigateTo('/my')
      }, { immediate: true})
    return { org, orgData }
})
