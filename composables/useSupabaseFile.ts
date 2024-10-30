import FilePreviewSlideover from "~/components/files/FilePreviewSlideover.vue";
import type { AppFileObject, Database } from "~/types/app.types";

export function useSupabaseFile(id: string, bucket_id: string, path: string) {

    const runtimeConfig = useRuntimeConfig()
    const supabase = useSupabaseClient<Database>()
    const slideover = useSlideover()

    const url = ref<string>(`${runtimeConfig.public.supabase_storage_url}/object/authenticated/${bucket_id}/${path}`)
    const file: Ref<AppFileObject | null> = ref(null)

    supabase.schema('storage').from('objects').select('*').eq('id', id) .single()
    .then((res) => {
        const { data, error } = res
        if (error) {
            console.error(error)
        }
        if (data) {
            file.value = data
        }
        if (!data) {
            file.value = null
            throw new Error("Failed to load file")
        }
    })

    return { url, file }

}