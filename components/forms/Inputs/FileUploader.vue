<template>
  <UAvatar :src="file" :alt="fileAlt" size="lg" />
  <UButton
    v-if="uploadState == 'idle'"
    label="Choose"
    color="white"
    size="md"
    @click="onFileClick"
  />
  <UProgress
    v-if="uploadState == 'uploading'"
    :value="uploadProgress"
    indicator
  />
  <input 
    ref="fileRef"
    type="file"
    class="hidden"
    accept=".jpg, .jpeg, .png, .gif"
    @change="onFileChange"
  />
  
</template>

<script setup lang="ts">
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
// Don't forget the CSS: core and UI components + plugins you are using
import "@uppy/core/dist/style.css";

type Props = {
  bucketId: string;
  path: string;
};

const user = useSupabaseUser();
const { userInfos } = useUserInfos();
const runtimeConfig = useRuntimeConfig();
const client = useSupabaseClient();
const file = ref<string>();
const fileRef = ref<HTMLInputElement>();
const uploadState = ref<"idle" | "uploading">("idle");
const fileAlt = computed(() => {
  if (userInfos.value) {
    return userInfos.value.firstname + " " + userInfos.value.lastname;
  } else {
    return "";
  }
});
const props = defineProps<Props>();
const uploadProgress = ref(0);
const uppy = ref<Uppy>();
const toast = useToast();

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;

  if (!input.files?.length) {
    return;
  }

  uppy.value?.addFile({
    name: input.files[0].name,
    type: input.files[0].type,
    data: input.files[0],
  });

  file.value = URL.createObjectURL(input.files[0]);
}

function onFileClick() {
  fileRef.value?.click();
}

onMounted(async () => {
  try {
    const { data, error } = await client.storage
      .from(props.bucketId)
      .download(`${props.path}.png`);
    if (error) {
      //   console.log(error);
    } else {
      file.value = URL.createObjectURL(data);
    }
  } catch (error) {
    // console.log(error)
  }

  const {
    data: { session },
  } = await client.auth.getSession();

  if (!session) {
    client.auth.signOut();
  } else {
    uppy.value = new Uppy().use(Tus, {
      endpoint: runtimeConfig.public.supabase_storage_url,
	  retryDelays: [0, 1000, 3000, 5000],
      headers: {
        authorization: `Bearer ${session.access_token}`,
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
		const filename = props.path + "." + file.extension;
		file.name = filename;
      const supabaseMetadata = {
        bucketName: props.bucketId,
        objectName: filename,
        contentType: file.type,
		cacheControl: "3600",
      };

      file.meta = {
        ...file.meta,
        ...supabaseMetadata,
      };
        uppy.value?.upload();
    });
    uppy.value.on("upload", (progress) => {
      uploadState.value = "uploading";
    });
    uppy.value.on("progress", (progress) => {
      uploadProgress.value = progress;
    });
    uppy.value.on("complete", (result) => {
      uploadState.value = "idle";
	  console.log(result);
	  if (result.failed.length > 0) {
		toast.add({
		  title: "Failed to upload the file",
		  color: "red",
		});
	  } else {
		toast.add({
		  title: "File uploaded!",
		  icon: "i-heroicons-check-circle",
		});
	  }
    });
    uppy.value.on("error", (error) => {
      console.error("Upload error:", error);
    });
  }
});
</script>

<style scoped></style>
