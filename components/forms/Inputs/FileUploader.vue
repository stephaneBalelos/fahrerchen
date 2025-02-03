<template>
  <slot>
    <UButton
      color="white"
      variant="solid"
      size="md"
      icon="i-heroicons-arrow-up-tray"
      trailing
      :loading="uploadState === 'uploading'"
      :disabled="uploadState === 'uploading'"
      @click="fileRef?.click()"
      >{{ fileName ? fileName : t("choose_file") }}</UButton
    >
    <UProgress
      v-if="uploadState === 'uploading'"
      size="xs"
      :indicator="false"
      :value="uploadProgress"
    />
    <UAlert
      v-if="uploadState === 'failed'"
      class="mt-2"
      icon="i-heroicons-x-circle"
      color="red"
      variant="soft"
      :title="t('upload_failed')"
    >
    <template #description>
      <span v-if="uploadErrorType">{{ t(`upload_failed_${uploadErrorType}`) }}</span>
    </template>
    </UAlert>
    <input ref="fileRef" class="hidden" type="file" :accept="props.extensions?.join(', ')" @change="onChange" >
  </slot>
</template>

<script setup lang="ts">
import * as tus from "tus-js-client";

type Props = {
  bucketId: string;
  path: string;
  extensions?: string[];
  onCompleted?: () => void;
  mode?: "single" | "multiple";
};

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();
const $emits = defineEmits(["uploaded"]);
const runtimeConfig = useRuntimeConfig();
const session = useSupabaseSession();
const filePreview = ref<string>();
const fileName = ref<string>();
const fileRef = ref<HTMLInputElement>();
const uploadState = ref<"idle" | "uploading" | "failed">("idle");
const uploadErrorType = ref<"too_large" | "invalid_extension" | null>(null);
const uploadProgress = ref(0);
const upload = ref();

function onChange(_$event: Event) {
  if (fileRef.value && fileRef.value.files) {
    onFileChange(fileRef.value.files);
  }
}

function onFileChange(files: FileList) {
  if (files.length === 0) {
    return;
  }

  if (!session.value) {
    throw new Error("Not logged in");
  }

  uploadState.value = "idle";

  const file = files[0];

  const filename = props.path + "/" + file.name;
  const supabaseMetadata = {
    bucketName: props.bucketId,
    objectName: filename,
    contentType: file.type,
    cacheControl: "3600",
  };

  clearError();
  console.log("Uploading file", filename, file.type);

  upload.value = new tus.Upload(files[0], {
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
    onError: function (err) {
      const response = (err as tus.DetailedError).originalResponse?.getUnderlyingObject()
      if (response?.status === 413) {
        uploadErrorType.value = "too_large";
      } else if (response?.status === 415) {
        uploadErrorType.value = "invalid_extension";
      }
      uploadState.value = "failed";
    },
    // Callback for reporting upload progress
    onProgress: function (bytesUploaded, bytesTotal) {
      const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
      uploadProgress.value = parseFloat(percentage);
    },
    // Callback for once the upload is completed
    onSuccess: function () {
      filePreview.value = undefined;
      fileName.value = undefined;
      $emits("uploaded");
      uploadState.value = "idle";
    },
  });
  filePreview.value = URL.createObjectURL(file);
  fileName.value = file.name;
  uploadState.value = "uploading";
  upload.value.start();
}

onMounted(async () => {});

onUnmounted(() => {
  if (upload.value) {
    upload.value.abort();
  }
  clearError();
});

function clearError() {
  uploadErrorType.value = null;
  uploadState.value = "idle";
  uploadProgress.value = 0;
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "choose_file": "Datei auswählen",
    "start_upload": "Upload starten",
    "uploading": "Lädt hoch...",
    "upload_completed": "Upload abgeschlossen",
    "upload_failed": "Upload fehlgeschlagen",
    "upload_failed_too_large": "Datei zu groß, maximal 20MB erlaubt",
    "upload_failed_invalid_extension": "Ungültige Dateiendung, erlaubt sind: bilder, pdf, mp4"
  },
  "en": {
    "choose_file": "Choose file",
    "start_upload": "Start upload",
    "uploading": "Uploading...",
    "upload_completed": "Upload completed",
    "upload_failed": "Upload failed",
    "upload_failed_too_large": "File too large, maximum 20MB allowed",
    "upload_failed_invalid_extension": "Invalid file extension, allowed are: images, pdf, mp4"
  }
}
</i18n>
