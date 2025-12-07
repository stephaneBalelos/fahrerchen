<template>
  <UDashboardSlideover>
    <template #title>
      <p v-if="state.name" class="text-lg font-bold">{{ state.name }}</p>
      <p v-else class="text-lg font-bold text-gray-400 dark:text-gray-400">
        {{ t("new_required_document") }}
      </p>
    </template>
    <UForm
      ref="form"
      :state="state"
      :validate="validate"
      :validate-on="['submit']"
      @submit="saveCourseRequirement"
    >
      <UDashboardSection
        :title="t('required_document')"
        :description="t('required_document_description')"
      >
        <UFormGroup
          name="name"
          :label="t('form.name.label')"
          :description="t('form.name.description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UInput v-model="state.name" autocomplete="on" size="md" />
        </UFormGroup>

        <UFormGroup
          name="description"
          :label="t('form.description.label')"
          :description="t('form.description.description')"
          class="grid gap-2"
          :ui="{ container: '' }"
        >
          <UTextarea
            v-model="state.description"
            :rows="5"
            autoresize
            size="md"
          />
        </UFormGroup>
        <UFormGroup
          v-if="props.organizationId && props.courseRequiredDocumentId"
          :label="t('form.classes_settings')"
          :description="t('form.classes_settings_desc')"
          :ui="{ container: '' }"
        >
          <div class="py-6">
            <CourseRequiredDocumentCombinationSettings
              :organization-id="props.organizationId"
              :required-document-id="props.courseRequiredDocumentId"
            />
          </div>
        </UFormGroup>
      </UDashboardSection>
    </UForm>

    <template #footer>
      <UButton @click="form?.submit()">
        {{ t("save") }}
      </UButton>
      <!-- <UButton v-if="props.requirementid" variant="ghost" color="red" @click="deleteCourseRequirement">
        {{ t('delete') }}
      </UButton> -->
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { CourseRequiredDocumentEdit } from "~/types/app.types";
import type { Form } from "#ui/types";
import CourseRequiredDocumentCombinationSettings from "~/components/courses/settings/CourseRequiredDocumentCombinationSettings.vue";

type Props = {
  organizationId: string;
  courseRequiredDocumentId?: string;
};
const slideover = useSlideover();
const props = defineProps<Props>();
const form = ref<Form<CourseRequiredDocumentEdit> | null>(null);
const $emit = defineEmits([
  "requirement-saved",
  "requirement-created",
  "requirement-deleted",
]);
const courseRequiredDocumentsStore = useCourseRequiredDocumentsStore();

const state = reactive<CourseRequiredDocumentEdit>({
  name: "",
  description: "",
});

const { t } = useI18n({
  useScope: "local",
});

onMounted(async () => {
  if (props.courseRequiredDocumentId) {
    try {
      const data = await courseRequiredDocumentsStore.getCourseRequiredDocument(
        props.courseRequiredDocumentId
      );

      if (!data) {
        throw new Error("Course cost not found");
      }
      state.name = data.name;
      state.description = data.description;
    } catch (error) {
      console.error("Error loading course cost:", error);
      // Handle error, e.g., show a notification
    }
  }
});
onUnmounted(() => {
  slideover.reset();
});

const validate = (state: CourseRequiredDocumentEdit) => {
  const errors = [];
  if (!state.name)
    errors.push({ path: "name", message: "Please enter a name" });
  if (!state.description)
    errors.push({ path: "description", message: "Please enter a description" });
  return errors;
};

const saveCourseRequirement = async () => {
  if (props.courseRequiredDocumentId) {
    await updateCourseRequirement(state);
  } else {
    await createCourseRequirement(state);
  }
};

const updateCourseRequirement = async (state: CourseRequiredDocumentEdit) => {
  if (!props.courseRequiredDocumentId) return;
  try {
    await courseRequiredDocumentsStore.updateCourseRequiredDocument(
      props.courseRequiredDocumentId!,
      state
    );
    $emit("requirement-saved");
  } catch (error) {
    console.error(error);
    // Handle error, e.g., show a notification
  }
};

const createCourseRequirement = async (state: CourseRequiredDocumentEdit) => {
  try {
    await courseRequiredDocumentsStore.createCourseRequiredDocument(state);
    $emit("requirement-created");
  } catch (error) {
    console.error(error);
    // Handle error, e.g., show a notification
  }
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "new_required_document": "Neues erforderliches Dokument",
    "required_document": "Erforderliches Dokument",
    "required_document_description": "Beschreiben Sie das erforderliche Dokument, das die Teilnehmer:innen hochladen müssen, um den Kurs abzuschließen.",
    "form": {
      "name": {
        "label": "Name",
        "description": "Geben Sie den Namen des erforderlichen Dokuments ein."
      },
      "description": {
        "label": "Beschreibung",
        "description": "Beschreiben Sie das erforderliche Dokument."
      },
      "classes_settings": "Ausbildungsklassen Einstellungen",
      "classes_settings_desc": "Wählen Sie die Ausbildungsklassen aus, für die dieses Dokument erforderlich ist."
    },
    "save": "Speichern",
    "delete": "Löschen"
  },
  "en": {
    "new_required_document": "New Required Document",
    "required_document": "Required Document",
    "required_document_description": "Describe the required document that participants need to upload to complete the course.",
    "form": {
      "name": {
        "label": "Name",
        "description": "Enter the name of the required document."
      },
      "description": {
        "label": "Description",
        "description": "Describe the required document."
      },
      "classes_settings": "Classes Settings",
      "classes_settings_desc": "Select the course classes for which this document is required."
    },
    "save": "Save",
    "delete": "Delete"
  }
}
</i18n>
