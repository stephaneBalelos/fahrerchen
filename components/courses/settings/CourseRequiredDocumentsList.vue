<template>
  <div
    v-if="courseRequiredDocuments && courseRequiredDocuments.length > 0 && status === 'success'"
    class="space-y-4"
  >
    <div
      v-for="courseRequiredDocument in courseRequiredDocuments"
      :key="courseRequiredDocument.id"
    >
      <CourseRequiredDocumentCard
        :course-required-document="courseRequiredDocument"
        @edit="openEditCourseRequiredDocumentForm"
        @delete="deleteCourseRequiredDocument"
      />
    </div>
    <div class="flex justify-center">
      <div class="mt-4">
        <UButton
          color="black"
          variant="solid"
          :icon="'i-heroicons-plus-circle'"
          @click="() => openEditCourseRequiredDocumentForm()"
        >
          {{ t("add_required_document") }}
        </UButton>
      </div>
    </div>
  </div>
  <div v-else-if="status === 'pending'" class="space-y-4">
    <USkeleton v-for="n in 3" :key="n"  class="h-24 w-full"/>
  </div>
  <UAlert
    v-else
    :title="t('no_required_documents')"
    :description="t('no_required_documents_description')"
    :actions="[
      {
        label: t('add_required_document'),
        color: 'black',
        icon: 'i-heroicons-plus-circle',
        variant: 'solid',
        size: 'sm',
        click: () => {},
      },
      {
        label: t('add_required_document_from_template'),
        color: 'white',
        icon: 'i-heroicons-sparkles',
        variant: 'outline',
        size: 'sm',
        click: () => {
          createCourseRequiredDocumentsFromTemplate();
        },
      },
    ]"
  />
</template>

<script setup lang="ts">
import CourseRequiredDocumentCard from "~/components/courses/CourseRequiredDocumentCard.vue";
import EditCourseRequirementForm from "~/components/forms/EditCourseRequirementForm.vue";

type Props = {
  organizationId: string;
};

const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});


const courseRequiredDocumentsStore = useCourseRequiredDocumentsStore();
const toast = useToast();
const slideover = useSlideover();


const { data: courseRequiredDocuments, refresh, status } = await useAsyncData(
  `course-required-documents-for-organization-${props.organizationId}`,
  async () => {
    return await courseRequiredDocumentsStore.getCourseRequiredDocuments(
      props.organizationId
    );
  }
);

const createCourseRequiredDocumentsFromTemplate = async () => {
  try {
    await courseRequiredDocumentsStore.createCourseRequiredDocumentsFromTemplate();
    toast.add({
      title: t("required_documents_created"),
      description: t("required_documents_created_description"),
      color: "green",
    });
  } catch (error) {
    console.error("Error creating required documents from template:", error);
    toast.add({
      title: t("error_creating_required_documents"),
      description: t("error_creating_required_documents_description"),
      color: "red",
    });
  }
};

const openEditCourseRequiredDocumentForm = (id?: string) => {
  slideover.open(EditCourseRequirementForm, {
    organizationId: props.organizationId,
    courseRequiredDocumentId: id,
    "onRequirement-saved": () => {
      slideover.close();
    },
    "onRequirement-created": () => {
      slideover.close();
    },
    "onVnodeUnmounted": () => {
      refresh();
    },
  });
};

const deleteCourseRequiredDocument = async (id: string) => {
  try {
    await courseRequiredDocumentsStore.deleteCourseRequiredDocument(id);
    toast.add({
      title: t("required_document_deleted"),
      description: t("required_document_deleted_description"),
      color: "green",
    });
    refresh();
  } catch (error) {
    console.error("Error deleting required document:", error);
    toast.add({
      title: t("error_deleting_required_document"),
      description: t("error_deleting_required_document_description"),
      color: "red",
    });
  }
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "required_documents_settings_title": "Erforderliche Dokumente",
    "required_documents_settings_desc": "Verwalte die erforderlichen Dokumente für deine Kurse, um sicherzustellen, dass alle Lernenden die notwendigen Unterlagen bereitstellen.",
    "create_btn_label": "Neues Dokument erstellen",
    "edit": "Bearbeiten",
    "no_required_documents": "Keine erforderlichen Dokumente",
    "no_required_documents_description": "Es gibt keine erforderlichen Dokumente für diesen Kurs.",
    "add_required_document": "Dokument hinzufügen",
    "add_required_document_from_template": "Dokument aus Vorlage hinzufügen",
    "required_documents_created": "Erforderliche Dokumente erstellt",
    "required_documents_created_description": "Die erforderlichen Dokumente wurden erfolgreich aus der Vorlage erstellt.",
    "error_creating_required_documents": "Fehler beim Erstellen der erforderlichen Dokumente",
    "error_creating_required_documents_description": "Beim Erstellen der erforderlichen Dokumente aus der Vorlage ist ein Fehler aufgetreten."
  },
  "en": {
    "required_documents_settings_title": "Required Documents",
    "required_documents_settings_desc": "Manage the required documents for your courses to ensure all learners provide the necessary paperwork.",
    "create_btn_label": "Create New Document",
    "edit": "Edit",
    "no_required_documents": "No Required Documents",
    "no_required_documents_description": "There are no required documents for this course.",
    "add_required_document": "Add Document",
    "add_required_document_from_template": "Add Document from Template",
    "required_documents_created": "Required Documents Created",
    "required_documents_created_description": "The required documents have been successfully created from the template.",
    "error_creating_required_documents": "Error Creating Required Documents",
    "error_creating_required_documents_description": "An error occurred while creating the required documents from the template."
  }
}
</i18n>
