<template>
  <slot>
    <UInput
      ref="fileRef"
      type="file"
      size="md"
      icon="i-heroicons-folder"
      @change="onFileChange"
      :loading="uploadState === 'uploading'"
      :disabled="uploadState === 'uploading'"
    />
  </slot>

</template>

<script setup lang="ts">
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
// Don't forget the CSS: core and UI components + plugins you are using
import "@uppy/core/dist/style.css";

type Props = {
  bucketId: string;
  path: string;
  extensions?: string[];
  onCompleted?: () => void;
  mode?: "single" | "multiple";
};

const props = defineProps<Props>();
const $emits = defineEmits(["uploaded"]);
const runtimeConfig = useRuntimeConfig();
const session = useSupabaseSession()
const file = ref<string>();
const fileRef = ref<HTMLInputElement>();
const uploadState = ref<"idle" | "uploading" | "completed" | "failed">("idle");
const uploadProgress = ref(0);
const uppy = ref<Uppy>();

function onFileChange(files: FileList) {
  if (files.length === 0) {
    return;
  }

  uppy.value?.addFile({
    name: files[0].name,
    type: files[0].type,
    data: files[0],
  });

  file.value = URL.createObjectURL(files[0]);
}

function onFileClick() {
  fileRef.value?.click();
}

onMounted(async () => {
  if (!session.value) {
    throw new Error("Not logged in");
  }

  uppy.value = new Uppy().use(Tus, {
    endpoint: runtimeConfig.public.supabase_storage_url + "/upload/resumable",
    retryDelays: [0, 1000, 3000, 5000],
    headers: {
      authorization: `Bearer ${session.value.access_token}`,
      "x-upsert": "true",
    },
    uploadDataDuringCreation: true,
    removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
    chunkSize: 6 * 1024 * 1024,
    allowedMetaFields: [
      "bucketName",
      "objectName",
      "contentType",
      "cacheControl",
    ],
  });

  uppy.value.on("file-added", (file) => {
    const filename = props.path + "/" + file.name;
    file.name = filename;
    const supabaseMetadata = {
      bucketName: props.bucketId,
      objectName: filename,
      contentType: file.type,
      cacheControl: "3600",
    };

    console.log(supabaseMetadata)

    file.meta = {
      ...file.meta,
      ...supabaseMetadata,
    };
    uploadState.value = "idle";
    uppy.value?.upload();
  });
  uppy.value.on("upload", (progress) => {
    uploadState.value = "uploading";
  });
  uppy.value.on("progress", (progress) => {
    uploadProgress.value = progress;
  });
  uppy.value.on("complete", (result) => {
    if (result.failed.length > 0) {
      uploadState.value = "failed";
    } else {
      $emits("uploaded");
      uploadState.value = "completed";
      if(fileRef.value) {
        console.log(fileRef.value.value)
        fileRef.value.value = "";
      }
      uppy.value?.clearUploadedFiles();
    }
  });
  uppy.value.on("error", (error) => {
    console.error("Upload error:", error);
    uploadState.value = "failed";
  });
});
</script>

<style scoped></style>
