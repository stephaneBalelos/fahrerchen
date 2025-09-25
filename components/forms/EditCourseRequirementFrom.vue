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
import type { Database } from "~/types/app.types";
import type { Form} from "#ui/types";

type Props = {
  courseid: string;
  orgid: string;
  requirementid?: string;
};

export type CourseRequirementEdit = Omit<
  Database["public"]["Tables"]["course_required_documents"]["Row"],
  "id" | "organization_id" | "course_id" | "name_slug"
>;

const tutorialStore = useTutorialStore();
const props = defineProps<Props>();
const client = useSupabaseClient<Database>();
const form = ref<Form<CourseRequirementEdit> | null>(null);
const $emit = defineEmits(['requirement-saved', 'requirement-created']);

const state = reactive<CourseRequirementEdit>({
  name: "",
  description: ""
});

const { t } = useI18n({
  useScope: "local",
});

const {
  data: requirement,
} = useAsyncData(`course_requirement_${props.requirementid}`, async () => {
  console.log(props.requirementid);
  if (!props.requirementid) return null;
  const { data, error } = await client
    .from("course_required_documents")
    .select("*")
    .eq("id", props.requirementid)
    .single();

    console.log(data);

    if (error) {
        console.error(error);
        throw error;
    } else {
      state.name = data.name;
      state.description = data.description;
    }
  return data;
});

onMounted(() => {
  if (requirement.value) {
    state.name = requirement.value.name;
    state.description = requirement.value.description;
  }
});

const validate = (state: CourseRequirementEdit) => {
  const errors = [];
  if (!state.name)
    errors.push({ path: "name", message: "Please enter a name" });
  if (!state.description)
    errors.push({ path: "description", message: "Please enter a description" });
  return errors;
};

const saveCourseRequirement = async () => {
    
  if (props.requirementid) {
    try {
      const {error} = await client
        .from("course_required_documents")
        .update(state)
        .eq("id", props.requirementid);
        if (error) throw error;
      $emit('requirement-saved');
    } catch (error) {
      console.error(error);
    }
  } else {
    createCourseRequirement();
  }
};

const createCourseRequirement = async () => {
    try {
        const { error} = await client.from("course_required_documents").insert({
            ...state,
            organization_id: props.orgid,
            course_id: props.courseid,
        });
        if (error) throw error;
        $emit('requirement-created');
        tutorialStore.completeStep('course_document_create')
    } catch (error) {
        console.error(error);
    }
};

const _deleteCourseRequirement = async () => {
  console.log('delete');
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
