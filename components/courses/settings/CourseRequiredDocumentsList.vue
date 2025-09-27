<template>
  <UDashboardSection
    :title="t('required_documents_settings_title')"
    :description="t('required_documents_settings_desc')"
    orientation="horizontal"
    class="px-4 py-6"
  >
    <template #links>
      <UButton
        color="primary"
        icon="i-heroicons-plus"
        variant="soft"
        size="2xs"
        @click="openEditCourseRequiredDocument('')"
        >{{ t("create_btn_label") }}</UButton
      >
    </template>
    <div v-if="courseRequiredDocumentsStore.courseRequiredDocuments.length > 0" class="space-y-4">
      <UiCardsBodyCollapseCard
        v-for="field in courseRequiredDocumentsStore.courseRequiredDocuments"
        :key="field.id"
      >
        <template #header>
          <div class="flex items-center justify-between pt-4 first:pt-0 gap-2">
            <div class="flex flex-col gap-1 grow">
              <p class="font-semibold">{{ field.name }}</p>
              <span class="text-sm text-gray-500">{{ field.description }}</span>
            </div>
            <UButton
              color="gray"
              variant="solid"
              @click.stop="openEditCourseRequiredDocument(field.id)"
              >{{ t("edit") }}</UButton
            >
            <UButton
              color="red"
              variant="soft"
              :icon="'i-heroicons-trash'"
              @click.stop="courseRequiredDocumentsStore.deleteCourseRequiredDocument(field.id)"
            />
          </div>
        </template>
        <div class="flex flex-col gap-1">
          <p class="text-sm text-gray-500 mb-2">
            {{ g(`required_documents.allowed_classes`) }}
          </p>
          <UCard
            :ui="{
              body: {
                padding: 'sm:p-0 py-0 px-0',
              },
            }"
          >
            <div class="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-800">
              <CoursesSettingsAllowedListItemsRequiredDocumentAllowedCourseItem
                v-for="course in coursesStore.activeCourses"
                :key="field.id + course.id"
                :course="course"
                :required-document-id="field.id"
              />
            </div>
          </UCard>
        </div>
      </UiCardsBodyCollapseCard>
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
  </UDashboardSection>
</template>

<script setup lang="ts">
import EditCourseRequirementFrom from "~/components/forms/EditCourseRequirementFrom.vue";

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});


const coursesStore = useCoursesStore();
const courseRequiredDocumentsStore = useCourseRequiredDocumentsStore();
const toast = useToast();

const slideover = useSlideover();

function openEditCourseRequiredDocument(id?: string) {
  slideover.open(EditCourseRequirementFrom, {
    courseRequiredDocumentId: id,
    "onRequirement-created": () => {
      slideover.close();
    },
    "onRequirement-saved": () => {
      slideover.close();
    },
  });

}

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
