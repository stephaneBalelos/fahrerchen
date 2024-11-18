<template>
  <UModal fullscreen>
    <NuxtErrorBoundary>
      <UCard
        :ui="{
          base: 'h-full flex flex-col',
          rounded: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          body: {
            base: 'grow relative',
          },
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {{ data?.name }}
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="$emits('close')"
            />
          </div>
        </template>
        <div ref="contentPreview" class="grid place-items-center h-full">
          <object
            v-if="data"
            :data="data?.url + '#toolbar=0&navpanes=0'"
            :type="data.metadata.mimetype"
            :width="width"
            :height="height"
          ></object>
        </div>
      </UCard>
      <template #error="{ error }">
        <UAlert
          title="Error"
          description="An error occurred while loading the document"
          color="red"
          variant="soft"
        />
      </template>
    </NuxtErrorBoundary>
  </UModal>
</template>

<script setup lang="ts">
import { useElementBounding, useParentElement } from "@vueuse/core";
import type { Database } from "~/types/app.types";

type Props = {
  bucketId: string;
  path: string;
};

const contentPreview = ref();

const props = defineProps<Props>();

const $emits = defineEmits(["close"]);

const client = useSupabaseClient<Database>();

const { width, height } = useElementBounding(contentPreview);

const { data, error } = useAsyncData(
  `document_preview_${props.path}`,
  async () => {
    const { data: fileData, error: fileDataError } = await client
      .schema("storage")
      .from("objects")
      .select("*")
      .eq("name", props.path)
      .single();
    const { data: blob, error: blobError } = await client.storage
      .from(props.bucketId)
      .createSignedUrl(props.path, 60);

    if (fileDataError || blobError) {
      throw new Error("Error while fetching file data");
    }
    return {
        name: fileData.name.split("/").pop(),
      metadata: fileData.metadata as { mimetype: string },
      url: blob.signedUrl as string,
    };
  }
);

if (error.value) {
  console.error(error);
}
</script>

<style scoped></style>
