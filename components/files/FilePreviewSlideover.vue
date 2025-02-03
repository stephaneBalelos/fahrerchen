<template>
  <UDashboardSlideover title="Notifications">
    <UForm
      ref="form"
      :state="state"
      :schema="schema"
      :validate-on="['submit']"
      :onSubmit="saveFileMetadata"
    >
      <UDashboardSection
        icon="i-heroicons-document-text"
        title="Profile"
        description="This information will be displayed publicly."
        orientation="vertical"
      >
        <img v-if="url" :src="url" class="w-full rounded-md" />
      </UDashboardSection>

      <UFormGroup
        name="name"
        label="Datei Name"
        placeholder="zb. Sehe Test 1"
        description="Benenne die Datei um sie besser zu finden."
        required
        class="grid grid-cols-1 gap-4 items-center"
        :ui="{ container: '' }"
      >
        <UInput v-model="state.name" autocomplete="on" size="md" />
      </UFormGroup>
      <UFormGroup
        name="description"
        label="Datei Beschreibung"
        description="Beschreibe die Datei um sie zu verstehen."
        class="grid gap-2"
        :ui="{ container: '' }"
      >
        <UTextarea v-model="state.description" :rows="5" autoresize size="md" />
      </UFormGroup>
    </UForm>
    <template #title>
      <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
        {{ filename }}
      </h2>
    </template>
    <template #footer>
      <UButton v-if="file" @click="deleteFile" color="red" variant="ghost"
        >Delete</UButton
      >
      <UButton @click="form?.submit()">Save</UButton>
      <UButton
        icon="i-heroicons-arrow-down-tray-solid"
        size="sm"
        color="primary"
        variant="solid"
        @click="downloadFile"
      />
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import { z } from "zod";
import { useSupabaseFile } from "~/composables/useSupabaseFile";
import type { AppFileObject, Database } from "~/types/app.types";

type Props = {
  id: string;
  bucketId: string;
  path: string;
};

const schema = z.object({
  name: z
    .string({ required_error: "Title is required" })
    .min(14, "Title must be at least 14 characters"),
  description: z
    .string({ required_error: "Description is required" })
    .min(14, "Description must be at least 14 characters"),
});

type Schema = z.infer<typeof schema>;

const form = ref();
const props = defineProps<Props>();
const slideover = useSlideover();
const toast = useToast();
const client = useSupabaseClient<Database>();
const { file, url } = useSupabaseFile(props.id, props.bucketId, props.path);
const filename = computed(() => {
  return file.value?.name.split("/").pop();
});

const state = reactive<Schema>({
  name: "",
  description: "",
});

async function deleteFile() {
  try {
    const { data, error } = await client.storage
      .from("avatars")
      .remove(["folder/avatar1.png"]);
      if (error) {
        throw error;
      }
    toast.add({
        title: "File deleted",
        description: "The file was successfully deleted.",
        color: "green",
    })
    slideover.close();
  } catch (error) {
    console.log(error);
    toast.add({
        title: "Error",
        description: "The file could not be deleted.",
        color: "red",
    })
  }
}

function saveFileMetadata() {
  try {
  } catch (error) {
    
  }
  
}

function downloadFile() {
  console.log("download file");
}
</script>

<style scoped></style>
