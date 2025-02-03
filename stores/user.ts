import type { AppUser, Database } from "~/types/app.types";

export const useUserStore = defineStore('user', () => {
    const supabase = useSupabaseClient<Database>()
    const authUser  = useSupabaseUser();
    const user = ref<AppUser | null>(null);

    watch(() => authUser.value, async () => {
        if (!authUser.value) {
            user.value = null
            return
        }
        const { data, error } = await supabase.from('users').select('*').eq('id', authUser.value.id).single();
        if (error) {
            console.error(error)
            return
        }
        if (!data) {
            console.error('no user data found')
            return
        }
        user.value = data
    }, { immediate: true })

    async function refreshUser() {
        if (!authUser.value) {
            throw new Error('no user logged in')
        }
        const { data, error } = await supabase.from('users').select('*').eq('id', authUser.value.id).single();
        if (error) {
            console.error(error)
            return
        }
        if (!data) {
            console.error('no user data found')
            return
        }
        user.value = data
    }
    

    return { user, refreshUser }
    
});