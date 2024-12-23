<template>
  <div
    class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
    @click="openPreview(submitted_doc)"
  >
    <UAvatar v-if="submitted_doc"
      :icon="submitted_doc.extension_icon"
      size="md"
    />
    <UAvatar v-else
      icon="i-heroicons-exclamation-triangle"
      size="md"
    />
    <div class="flex justify-between text-sm flex-1">
      <div>
        <p class="text-gray-900 dark:text-white font-medium">
          {{ doc.name }}
        </p>
        <p class="text-gray-500 dark:text-gray-400">
          {{ doc.description ?? t("no_description") }}
        </p>
      </div>
      <div
        class="flex items-center gap-2 text-gray-900 dark:text-white font-medium text-lg"
      >
        <UButton
          size="sm"
          color="gray"
          square
          :label="submitted_doc ? t('change') : t('upload')"
          variant="solid"
          :loading="isUploading"
          @click.stop="fileRef?.click()"
        />
        <input class="hidden" ref="fileRef" type="file" @change="onChange" />
        <UTooltip :text="t('delete_file')" v-if="submitted_doc">
          <UButton
            icon="i-heroicons-trash"
            size="sm"
            color="red"
            square
            variant="ghost"
            @click=""
          />
        </UTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  AppCourse,
  AppCourseRequiredDocument,
  Database,
} from "~/types/app.types";
import { getDocumentIconFromExtension } from "~/utils/helpers";
import DocumentPreview from "../DocumentPreview.vue";

type Props = {
  doc: AppCourseRequiredDocument;
  bucketId: string;
  path: string;
};

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();
const client = useSupabaseClient<Database>();
const modal = useModal();
const toast = useToast();
const fileRef = ref<HTMLInputElement>();
const isUploading = ref(false);

const {
  data: submitted_doc,
  error,
  status,
  refresh,
} = useAsyncData(
  `course_required_documents/${props.doc.id}`,
  async () => {
    const { data, error } = await client
      .from("course_subscription_documents")
      .select("*")
      .eq("required_document_id", props.doc.id);
    if (error) {
      throw error;
    }
    return data;
  },
  {
    transform: (data) => {
      const icon = getDocumentIconFromExtension(data[0].path);
      console.log(icon);
      return {
        ...data[0],
        extension_icon: icon,
      };
    },
  }
);

const openPreview = (doc: typeof submitted_doc.value) => {
  if (!doc) return;
  modal.open(DocumentPreview, {
    bucketId: props.bucketId,
    path: doc.path,
    onClose: () => {
      refresh();
      modal.close();
    },
  })
};

function onChange($event: Event) {
  if (fileRef.value && fileRef.value.files) {
    onFileChange(fileRef.value.files);
  }
}
function onFileChange(files: FileList) {
  isUploading.value = true;
  const file = files[0];

  useFileUpload(file, props.bucketId, props.path, {
    onError: (error) => {
      console.error(error);
      isUploading.value = false;
    },
    onProgress: (progress) => {
      console.log(progress);
    },
    onSuccess: () => {
      console.log("success");
      isUploading.value = false;
      refresh();
    },
  });
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "change": "Ändern",
    "upload": "Hochladen",
    "delete_file": "Datei löschen",
    "error_fetching_data": "Fehler beim Abrufen der Daten",
    "no_description": "Keine Beschreibung"
  }
}
</i18n>
