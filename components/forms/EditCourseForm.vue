<template>
  <UDashboardSlideover :title="'New Course'" ref="slideover" prevent-close id="create-course-slideover">
    <UForm
    ref="form"
      :state="state"
      :validate="validate"
      :validate-on="['submit']"
      @submit="onSubmit"
    >
      <UDashboardSection
        title="Course"
        description="This information will be displayed publicly so be careful what you share."
      >
        <UFormGroup
          name="name"
          label="Name"
          description="Will appear on receipts, invoices, and other communication."
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UInput v-model="state.name" autocomplete="off" size="md" />
        </UFormGroup>

        <UFormGroup
          name="type"
          label="Course Type"
          description="Select the type of course you are creating."
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <USelectMenu
            v-model="state.type"
            value-attribute="id"
            :options="course_types ?? []"
            placeholder="Select a course type"
            option-attribute="type"
            leadingIcon="i-heroicons-truck"
            :ui="{ wrapper: 'app-select' }"
            :ui-menu="{ container: 'app-select-menu', option: { base: 'app-select-menu-option'} }"
          >
            <template #option="{ option }">
              <span class="truncate">{{ option.type }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup v-if="selected_type" :ui="{ container: '' }">
          <UAlert
            :title="selected_type.type"
            :description="selected_type.description ?? ''"
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
      </UDashboardSection>
    </UForm>
    <template #footer>
      <UButton class="app-btn-submit" block @click="form?.submit()" label="Create Course" />
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import { type Database } from "~/types/app.types";
import type { FormError, FormSubmitEvent } from "#ui/types";
import type { AppCourse } from "~/types/app.types";

type EditCourseFormProps = Omit<
  AppCourse,
  "id" | "inserted_at" | "organization_id"
>;

type Props = {
  course_id?: string;
};

const props = defineProps<Props>();
const supabase = useSupabaseClient<Database>();
const { selected_organization_id } = useUserOrganizations();
const slideover = useSlideover();
const form = ref<HTMLFormElement | null>(null);

const toast = useToast();

const emit = defineEmits<{
  (e: "course-created", value: AppCourse): void;
}>();

const {
  data: course_types,
  error,
  status,
  refresh,
} = useAsyncData("course_types", async () => {
  const { data, error } = await supabase.from("course_types").select("*");
  return data ? data : [];
});

const state = reactive<EditCourseFormProps>({
  name: "",
  type: 1,
  description: "",
});

const selected_type = computed(() => {
  return course_types.value?.find((t) => t.id === state.type);
});

// function onFileChange(e: Event) {
//     const input = e.target as HTMLInputElement

//     if (!input.files?.length) {
//         return
//     }

//     state.avatar = URL.createObjectURL(input.files[0])
// }

// function onFileClick() {
//     fileRef.value?.click()
// }

const validate = (state: EditCourseFormProps): FormError[] => {
  const errors = [];
  if (!state.name)
    errors.push({ path: "name", message: "Please enter an email." });
  if (
    course_types.value &&
    state.type >= course_types.value.length &&
    state.type < 1
  ) {
    errors.push({ path: "type", message: "willst du mich verarschen?!" });
  }
  if (!state.description)
    errors.push({
      path: "description",
      message: "Please enter a description.",
    });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  // Emit event
  createCourse(event.data);
}

const createCourse = async (d: EditCourseFormProps) => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .insert({
        ...d,
        organization_id: selected_organization_id.value,
      })
      .select("*");
    if (error) {
      toast.add({
        title: "Error",
        description: "Could not create course",
        color: "red",
      });
      return;
    }
    toast.add({
      title: "Success",
      description: "Course created",
      color: "green",
    });
    if (data) {
      emit("course-created", data[0]);
    }
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "Could not create course",
      color: "red",
    });
  }
};
</script>

<style scoped></style>
