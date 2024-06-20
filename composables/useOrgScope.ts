// store.js
import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import type { Database } from '~/types/database.types'
import { useStorage } from '@vueuse/core'
import type { AppOrganisation } from '~/types/app.types'



export const useGlobalOrgState = createGlobalState(() => {
    const supabase = useSupabaseClient<Database>()
    const org = useStorage('org-scope', '') // returns Ref<string>

    const orgData = ref<AppOrganisation | null>(null)

    watch(() => org.value, async () => {
        console.log('org changed', org.value)
        if (org.value === null) {
            navigateTo('/')
            orgData.value = null
            return;
        }
        const { data, error } = await supabase.from('organisations').select('*').eq('id', org.value).single();
        if (error) {
            console.log('we have an error')
            console.error(error)
            return
        }
        orgData.value = data
        // navigateTo('/my')
      }, { immediate: true})
    return { org, orgData }
})
