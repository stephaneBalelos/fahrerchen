<template>
  <UDashboardSlideover :title="state.name">
    <UForm
      ref="form"
      :state="state"
      :validate="validate"
      :validate-on="['submit']"
      :onSubmit="saveCourseRequirement"
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
          name="type"
          label="Requirement Type"
          description="Describe the type of requirement. Activity based on this requirement will be tracked."
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <USelectMenu
            v-model="state.requirements_type"
            value-attribute="id"
            :options="requirements_types ?? []"
            placeholder="Select a type"
            option-attribute="type"
            leadingIcon="i-heroicons-book-open"
          />
        </UFormGroup>

        <UFormGroup v-if="selected_type" :ui="{ container: '' }">
          <UAlert
            :title="selected_type.type"
            :description="selected_type.description"
            color="primary"
            variant="subtle"
          >
            <template #title="{ title }">
              <span class="text-lg">Führerscheinklasse {{ title }}</span>
            </template>
          </UAlert>
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

        <UFormGroup
          name="price"
          label="Price"
          description="Will appear on receipts, invoices, and other communication."
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UInput v-model="state.price" autocomplete="on" size="md" />
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
import { z } from "zod";
import type { Database } from "~/types/app.types";
import type { Form, FormSubmitEvent } from "#ui/types";

type Props = {
  courseid: string;
  orgid: string;
  requirementid?: string;
};

type CourseRequirementEdit = Omit<
  Database["public"]["Tables"]["course_requirements"]["Row"],
  "id" | "organisation_id" | "course_id"
>;

const props = defineProps<Props>();
const client = useSupabaseClient<Database>();
const form = ref<Form<CourseRequirementEdit> | null>(null);
const $emit = defineEmits(['requirement-saved', 'requirement-created']);

const {
  data: requirement,
  error,
  pending,
} = useAsyncData(`course_requirement_${props.requirementid}`, async () => {
  if (!props.requirementid) return null;
  const { data, error } = await client
    .from("course_requirements")
    .select("*")
    .eq("id", props.requirementid)
    .single();
  return data;
});

const {
  data: requirements_types,
  error: requirements_types_error,
  pending: requirements_types_pending,
} = useAsyncData("requirements_types", async () => {
  const { data, error } = await client
    .from("course_requirements_types")
    .select("*");
  return data;
});

const state = reactive<CourseRequirementEdit>({
  name: "",
  description: "",
  requirements_type: 1,
  required: 1,
  price: 0,
});

onMounted(() => {
  if (requirement.value) {
    state.name = requirement.value.name;
    state.description = requirement.value.description;
    state.requirements_type = requirement.value.requirements_type;
    state.required = requirement.value.required;
    state.price = requirement.value.price;
  }
});

const selected_type = computed(() => {
  if (!state.requirements_type) return null;
  if (!requirements_types.value) return null;
  return (
    requirements_types.value.find(
      (type) => type.id === state.requirements_type
    ) ?? null
  );
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
      const {data, error} = await client
        .from("course_requirements")
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
        const {data, error} = await client.from("course_requirements").insert({
            ...state,
            organisation_id: props.orgid,
            course_id: props.courseid,
        });
        if (error) throw error;
        $emit('requirement-created');
    } catch (error) {
        console.error(error);
    }
};
</script>

<style scoped></style>
