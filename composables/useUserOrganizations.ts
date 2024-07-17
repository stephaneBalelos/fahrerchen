// store.js
import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import type { Database } from '~/types/database.types'
import { useStorage } from '@vueuse/core'
import type { AppOrganization } from '~/types/app.types'



export const useUserOrganizations = createGlobalState(() => {
    const supabase = useSupabaseClient<Database>()
    const selected_organization_id = useStorage('org-scope', '') // returns Ref<string>

    const organizations = ref<AppOrganization[]>([])

    const selected_organization = computed(() => {
        return organizations.value.find(org => org.id === selected_organization_id.value)
    })

    

    watch(() => selected_organization_id.value, async () => {
        const { data, error } = await supabase.from('organizations').select('*');
        if (error) {
            console.log('we have an error')
            console.error(error)
            return
        }
        organizations.value = data
        if (!selected_organization_id.value && data.length > 0) {
            selected_organization_id.value = organizations.value[data.length-1].id
        }
        console.log(selected_organization_id.value)

      }, { immediate: true })


    return { selected_organization_id, selected_organization, organizations }
})
