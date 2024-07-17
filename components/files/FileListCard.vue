<template>
  <UDashboardCard :title="title" :description="description">
    <template #links>
      <FileUploader :bucketId="bucketId" :path="path" @uploaded="refresh" />
    </template>
    <NuxtLink
      v-if="status !== 'pending'"
      v-for="(file, index) in files"
      :key="index"
      @click="openPreview(file.id, bucketId, path + '/' + file.name)"
      class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
    >
      <UAvatar :alt="`pdf`" size="md" />

      <div class="text-sm flex-1">
        <div>
          <p class="text-gray-900 dark:text-white font-medium">
            {{ file.name }} | {{  bucketId }}
          </p>
          <p class="text-gray-500 dark:text-gray-400 text-xs">
            Hochgeladen am
            {{ new Date(file.updated_at).toLocaleDateString("de") }}
          </p>
        </div>
      </div>
    </NuxtLink>
    <div
      v-if="status === 'success' && !files?.length"
      class="flex flex-col justify-center items-center min-h-64"
    >
      <UIcon name="i-heroicons-document-solid" />
      <p class="text-gray-500 dark:text-gray-400">No files found.</p>
    </div>
  </UDashboardCard>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import FileUploader from "../forms/Inputs/FileUploader.vue";
import { useSupabaseFile } from "~/composables/useSupabaseFile";
import FilePreviewSlideover from "./FilePreviewSlideover.vue";

type Props = {
  bucketId: string;
  path: string;

  limit?: number;
  offset?: number;
  sortBy?: string;
  order?: "asc" | "desc";

  title?: string;
  description?: string;
};

const { selected_organization_id } = useUserOrganizations();
const slideover = useSlideover();

const props = withDefaults(defineProps<Props>(), {
  limit: 5,
  offset: 0,
  sortBy: "name",
  order: "asc",
});

const supabase = useSupabaseClient<Database>();

const {
  data: files,
  error,
  status,
  refresh,
} = useAsyncData(
  `files_${org.value}_${props.bucketId}_${props.path}`,
  async () => {
    const { data, error } = await supabase.storage
      .from(props.bucketId)
      .list(`${org.value}/${props.path}`, {
        limit: props.limit,
        offset: props.offset,
        sortBy: { column: props.sortBy, order: props.order },
      });

    if (error) {
      console.log(error);
    }
    console.log(data);
    return data;
  }
);

const openPreview = async (id: string, bucket_id: string, path: string) => {
        slideover.open(FilePreviewSlideover, {
            id: id,
            bucketId: bucket_id,
            path: path,
        })
    }
</script>

<style scoped></style>
