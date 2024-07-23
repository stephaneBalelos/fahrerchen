import type { Database } from "~/types/app.types"


export async function useSupabaseFileUrl(bucket_id: string, path: string, transform?: any) {
    const res = ref<string | null>(null)
    try {
        const supabase = useSupabaseClient<Database>()
        const { data, error } = await supabase
            .storage
            .from(bucket_id)
            .download(path, {
                transform: transform
            })
    
        if (error) {
            throw new Error(error.message)
        }
        res.value = URL.createObjectURL(data)
    } catch (error) {
        console.error(error)
        res.value = null
    }
    return res
}