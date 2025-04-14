export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide: {
            publicStorageUrl: (bucket:string, path:string) => {
                const storageUrl = nuxtApp.$config.public.supabase_storage_url
                if (!path) {
                  return null;
                }
                return `${storageUrl}/object/public/${bucket}/${path}`
              }
        }
    }
})