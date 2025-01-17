<template>
  <UDashboardCard
    :title="t('course_documents')"
    :description="t('upload_course_documents')"
    icon="i-heroicons-document-text-solid"
    :ui="{
      header: {
        base: 'flex flex-nowrap items-center justify-between gap-2',
      },
    }"
  >
    <div v-if="docs && docs.length > 0">
      <div
        v-for="(doc, index) in docs"
        :key="index"
        class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
        @click="openPreview(doc)"
      >
        <UAvatar :icon="doc.extension_icon" size="md" />
        <div class="text-sm flex-1">
          <div>
            <p class="text-gray-900 dark:text-white font-medium">
              {{ doc.name ?? doc.path.split("/").pop() }}
            </p>
            <p class="text-gray-500 dark:text-gray-400">
              {{ doc.description ?? t("no_description") }}
            </p>
          </div>
        </div>
        <p class="flex items-center gap-2 text-gray-900 dark:text-white font-medium text-lg">
          <UTooltip :text="t('delete_file')">
              <UButton
                  icon="i-heroicons-trash"
                  size="sm"
                  color="red"
                  square
                  variant="ghost"
                  @click.stop="deleteDocument(doc)"
              />
          </UTooltip>
        </p>
      </div>
    </div>
    <div v-else>
      <UAlert
        :title="t('no_documents')"
        :description="t('upload_course_documents')"
      />
    </div>
    <div class="mt-4">
        <FormsInputsFileUploader
          :bucket-id="'course_documents'"
          :path="`${userOrganizationsStore.selectedOrganization?.organization_id}/${props.courseid}`"
          @uploaded="refresh"
        />
    </div>
  </UDashboardCard>
</template>

<script setup lang="ts">
import type { AppCourseDocument, Database } from "~/types/app.types";
import { formatDateTime } from "~/utils/formatters";
import DocumentPreview from "../files/DocumentPreview.vue";

type Props = {
  courseid: string;
};

const props = defineProps<Props>();
const client = useSupabaseClient<Database>();
const userOrganizationsStore = useUserOrganizationsStore();
const modal = useModal()

const { t } = useI18n({
  useScope: "local",
});

const {
  data: docs,
  refresh,
} = await useAsyncData(async () => {
  const { data, error } = await client
    .from("course_documents")
    .select("*")
    .eq("course_id", props.courseid);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}, {
  transform: (d) => {

    return d.map((doc: AppCourseDocument) => {
      const extension = doc.path.split(".").pop();
      const date = formatDateTime(doc.created_at);
      const document = {
        ...doc,
        extension_icon: extension == 'pdf' ? 'i-heroicons-document-text' : extension == 'mp4' ? 'i-heroicons-video-camera' : 'i-heroicons-photo',
        created_at: date,
      }
      return document;
    });

  },
});


async function deleteDocument(doc: AppCourseDocument) {
  try {
    const res = await client.storage.from("course_documents").remove([doc.path]);
    if (res.error) {
      throw res.error;
    }
    refresh();
  } catch (error) {
    console.error(error);
  }
}

function openPreview(doc: AppCourseDocument) {
  modal.open(DocumentPreview, {
    bucketId: "course_documents",
    path: doc.path,
    "onClose": () => {
      modal.close();
    },
  });
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "course_documents": "Kursdokumente",
    "upload_course_documents": "Laden Sie Kursdokumente hoch, die von den Schülern heruntergeladen werden können",
    "upload": "Hochladen",
    "no_documents": "Keine Dokumente",
    "no_description": "Keine Beschreibung",
    "change": "Ändern",
    "delete_file": "Datei löschen"  
  },
  "en": {
    "course_documents": "Course Documents",
    "upload_course_documents": "Upload course documents for students to download",
    "upload": "Upload",
    "no_documents": "No documents",
    "no_description": "No description",
    "change": "Change",
    "delete_file": "Delete file"
  }
}
</i18n>
