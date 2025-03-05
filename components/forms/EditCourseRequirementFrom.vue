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
        title="Course Requirement"
        description="This information will be displayed publicly so be careful what you share."
      >
        <UFormGroup
          name="name"
          label="Requirement Name"
          description="Will appear on receipts, invoices, and other communication."
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UInput v-model="state.name" autocomplete="on" size="md" />
        </UFormGroup>

        <UFormGroup
          name="description"
          label="Course Description"
          description="Describe your course in detail."
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
      <UButton>Cancel</UButton>
      <UButton @click="form?.submit()">Save</UButton>
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

type CourseRequirementEdit = Omit<
  Database["public"]["Tables"]["course_required_documents"]["Row"],
  "id" | "organization_id" | "course_id" | "name_slug"
>;

const tutorialStore = useTutorialStore();
const props = defineProps<Props>();
const client = useSupabaseClient<Database>();
const form = ref<Form<CourseRequirementEdit> | null>(null);
const $emit = defineEmits(['requirement-saved', 'requirement-created']);

const {
  data: requirement,

} = useAsyncData(`course_requirement_${props.requirementid}`, async () => {
  if (!props.requirementid) return null;
  const { data } = await client
    .from("course_required_documents")
    .select("*")
    .eq("id", props.requirementid)
    .single();
  return data;
});


const state = reactive<CourseRequirementEdit>({
  name: "",
  description: ""
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
        tutorialStore.completeStep('step-4')
    } catch (error) {
        console.error(error);
    }
};
</script>

<style scoped></style>
