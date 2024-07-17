// store.js
import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import type { Database } from '~/types/database.types'
import { useStorage } from '@vueuse/core'
import type { AppOrganization } from '~/types/app.types'



export const useGlobalOrgState = createGlobalState(() => {
    const supabase = useSupabaseClient<Database>()
    const org = useStorage('org-scope', '') // returns Ref<string>

    const orgData = ref<AppOrganization | null>(null)
    const route = useRoute()
    

    watch(() => org.value, async () => {
        if (!org.value) {
            navigateTo('/')
            orgData.value = null
            return;
        }
        const { data, error } = await supabase.from('organizations').select('*').eq('id', org.value).single();
        if (error) {
            console.log('we have an error')
            console.error(error)
            return
        }
        orgData.value = data

        // const inRoot = route.path.split('/')[1] === ''
        // if (!inRoot) {
        //     const firstRoute = route.path.split('/')[2] ?? ''
            
        //     navigateTo('/my/' + firstRoute)
        // }
      }, { immediate: true })
    return { org, orgData }
})
