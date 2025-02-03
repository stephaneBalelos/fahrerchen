import * as tus from "tus-js-client";

type UseFileUploadOptions = {
    onError?: (error: Error) => void
    onProgress?: (bytesSent: number, bytesTotal: number) => void
    onSuccess?: (payload: tus.OnSuccessPayload) => void
}

export const useFileUpload = (file: File, bucket_id: string, path: string, options: UseFileUploadOptions) => {

    const upload = ref<tus.Upload | null>(null)
    const runtimeConfig = useRuntimeConfig()
    const session = useSupabaseSession()

    if (!session.value) {
        throw new Error("Session is not available")
    }

    const filename = path + "/" + file.name;
    const supabaseMetadata = {
        bucketName: bucket_id,
        objectName: filename,
        contentType: file.type,
        cacheControl: "3600",
    };

    upload.value = new tus.Upload(file, {
        endpoint: runtimeConfig.public.supabase_storage_url + "/upload/resumable",
        retryDelays: [0, 1000, 3000, 5000],
        headers: {
            authorization: `Bearer ${session.value.access_token}`,
            "x-upsert": "true",
        },
        removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file
        chunkSize: 6 * 1024 * 1024,
        metadata: {
            filename: filename,
            filetype: file.type,
            ...supabaseMetadata,
        },
        // Callback for errors which cannot be fixed using retries
        onError: options.onError,
        // Callback for reporting upload progress
        onProgress: options.onProgress,
        // Callback for once the upload is completed
        onSuccess: options.onSuccess,
    });

    upload.value.start();
}