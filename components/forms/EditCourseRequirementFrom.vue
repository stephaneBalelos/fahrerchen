<template>
  <UDashboardSlideover :title="state.name">
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
      </UDashboardSection>
    </UForm>

    <template #footer>
      <UButton @click="form?.submit()">
        {{ t('save') }}
      </UButton>
      <!-- <UButton v-if="props.requirementid" variant="ghost" color="red" @click="deleteCourseRequirement">
        {{ t('delete') }}
      </UButton> -->
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { CourseRequiredDocumentEdit } from "~/types/app.types";
import type { Form} from "#ui/types";

type Props = {
  courseRequiredDocumentId?: string;
};
const slideover = useSlideover();
const props = defineProps<Props>();
const form = ref<Form<CourseRequiredDocumentEdit> | null>(null);
const $emit = defineEmits(['requirement-saved', 'requirement-created']);
const courseRequiredDocumentsStore = useCourseRequiredDocumentsStore();

const state = reactive<CourseRequiredDocumentEdit>({
  name: "",
  description: ""
});

const { t } = useI18n({
  useScope: "local",
});


onMounted(async () => {
  if (props.courseRequiredDocumentId) {
    try {
      const data = await courseRequiredDocumentsStore.getCourseRequiredDocument(props.courseRequiredDocumentId);

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
    await courseRequiredDocumentsStore.updateCourseRequiredDocument(props.courseRequiredDocumentId!, state);
    $emit('requirement-saved');
  } catch (error) {
    console.error(error);
    // Handle error, e.g., show a notification
  }
};

const createCourseRequirement = async (state: CourseRequiredDocumentEdit) => {
  try {
    await courseRequiredDocumentsStore.createCourseRequiredDocument(state);
    $emit('requirement-created');
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
      }
    },
    "save": "Speichern",
    "delete": "Löschen"
  },
  "en": {
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
      }
    },
    "save": "Save",
    "delete": "Delete"
  }
}
</i18n>
