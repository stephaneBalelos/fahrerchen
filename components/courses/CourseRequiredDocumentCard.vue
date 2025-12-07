<template>
  <UCard
    :ui="{
      base: 'h-full flex flex-col',
      body: {
        base: 'flex-1',
      },
    }"
  >
    <div class="flex items-center gap-2">
      <div class="flex items-center justify-between w-full gap-4">
        <div class="flex flex-1 flex-col items-start">
          <h4 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ props.courseRequiredDocument.name }}
          </h4>
          <p class="text-sm text-gray-500 truncate max-w-md">
            {{ props.courseRequiredDocument.description }}
          </p>
        </div>
        <UTooltip :text="t('edit_required_document')" :popper="{ placement: 'top' }">
          <UButton
            color="white"
            variant="solid"
            icon="i-heroicons-pencil-square"
            @click="$emits('edit', props.courseRequiredDocument.id)"
          />
        </UTooltip>
              <UTooltip :text="t('delete_required_document')" :popper="{ placement: 'top' }">
        <UButton
          color="red"
          variant="ghost"
          :icon="'i-heroicons-trash'"
          @click="$emits('delete', props.courseRequiredDocument.id)"
        />
      </UTooltip>
      </div>
    </div>
    <template #footer>
      <div class="flex gap-4">
        <p>{{ t("classes") }}</p>
        <div
          v-if="allowedClasses && allowedClasses.length > 0"
          class="flex flex-wrap"
        >
          <CourseTypeBadge
            v-for="courseCombination in allowedClasses"
            :key="courseCombination.id"
            :type="courseCombination.course.type"
            class="mr-2 mb-2"
          />
        </div>
        <p
          v-else-if="allowedClasses && allowedClasses.length == 0"
          class="text-sm text-gray-500"
        >
          {{ t("no_classes_assigned_to_required_document") }}
        </p>
        <p v-else-if="status == 'pending'" class="flex items-center gap-2">
          <USkeleton class="w-8" />
        </p>
        <p v-else class="text-sm text-red-500">
          {{ t("error_loading_classes") }}
        </p>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { AppCourseRequiredDocument } from "~/types/app.types";
import CourseTypeBadge from "./CourseTypeBadge.vue";
import { USkeleton } from "#components";

type Props = {
  courseRequiredDocument: AppCourseRequiredDocument;
};

const { t } = useI18n({
  useScope: "local",
});
const props = defineProps<Props>();
const courseRequiredDocumentsStore = useCourseRequiredDocumentsStore();
const $emits = defineEmits<{
  (e: "edit" | "delete", id: string): void;
}>();

const {
  data: allowedClasses,
  status,
} = useAsyncData(
  `required-documents-allowed-classes-${props.courseRequiredDocument.id}`,
  async () => {
    return courseRequiredDocumentsStore.getAllowedCourseForRequiredDocument(
      props.courseRequiredDocument.id
    );
  }
);

</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "edit_required_document": "Einschreibungsdokument bearbeiten",
    "delete_required_document": "Einschreibungsdokument löschen",
    "not_specified": "Nicht angegeben",
    "course_type": "Kurstyp",
    "classes": "Klassen",
    "no_classes_assigned_to_required_document": "Dieses Dokument ist für keine Ausbildungsklasse erforderlich",
    "error_loading_classes": "Fehler beim Laden der Klassen"
  },
  "en": {
    "edit_required_document": "Edit Required Document",
    "delete_required_document": "Delete Required Document",
    "not_specified": "Not specified",
    "course_type": "Course Type",
    "base_price": "Base Price",
    "base_required": "Base Required Attendances",
    "max_attendees": "Max Attendees",
    "classes": "Classes",
    "no_classes_assigned_to_required_document": "This document is not required for any course class",
    "error_loading_classes": "Error loading classes"
  }
}
</i18n>
