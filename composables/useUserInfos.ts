import { createGlobalState } from "@vueuse/core";
import type { Database } from '~/types/database.types'

type UserInfos = Database['public']['Tables']['users']['Row']

export const useUserInfos = createGlobalState(() => {
    const client = useSupabaseClient<Database>()
    const user = useSupabaseUser()

    const userInfos: Ref<UserInfos | null> = ref(null)


    watchEffect(async (onCleanup) => {
        if(!user.value) {
            userInfos.value = null
            return
        }
        const res = await client.from('users').select("*").eq('id', user.value.id).single()
        userInfos.value = res.data
    })

    return { userInfos }
})