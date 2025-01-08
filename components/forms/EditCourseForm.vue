<template>
  <UDashboardSlideover
    id="create-course-slideover"
    :title="props.courseId ? state.name : t('new_course')"
    prevent-close
  >
    <UForm
      ref="form"
      :state="state"
      :validate="validate"
      :validate-on="['submit']"
      @submit="onSubmit"
    >
      <UDashboardSection
        :title="props.courseId ? t('title_edit') : t('title')"
        :description="t('basic_information')"
      >
        <UFormGroup
          name="name"
          :label="t('form.name.label')"
          :description="t('form.name.description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UInput v-model="state.name" autocomplete="off" size="md" />
        </UFormGroup>

        <UFormGroup
          name="type"
          :label="t('form.type.label')"
          :description="t('form.type.description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <USelectMenu
            v-model="state.type"
            value-attribute="id"
            :options="course_types ?? []"
            :placeholder="t('form.type.placeholder')"
            option-attribute="type"
            leading-icon="i-heroicons-truck"
            :ui="{ wrapper: 'app-select' }"
            :ui-menu="{
              container: 'app-select-menu',
              option: { base: 'app-select-menu-option' },
            }"
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
              <span class="text-lg">{{ t('driver_license_class') }} {{ title }}</span>
            </template>
          </UAlert>
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
      <UButton
        v-if="props.courseId"
        class="app-btn-submit"
        block
        label="Update Course"
        @click="form?.submit()"
      />
      <UButton
        v-else
        class="app-btn-submit"
        block
        label="Create Course"
        @click="form?.submit()"
      />
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { Database, AppCourse } from "~/types/app.types";
import type { FormError, FormSubmitEvent } from "#ui/types";

type EditCourseFormProps = Omit<
  AppCourse,
  "id" | "inserted_at" | "organization_id" | "is_active" | "allow_self_registration" | "create_bill_on_subscription"
>;

type Props = {
  courseId?: string;
};

const props = defineProps<Props>();
const supabase = useSupabaseClient<Database>();
const userOrganizationsStore = useUserOrganizationsStore();
const form = ref<HTMLFormElement | null>(null);

const { t } = useI18n({
  useScope: "local",
});

const toast = useToast();

const emit = defineEmits<{
  (e: "course-created" | "course-updated", value: AppCourse): void;
}>();

const { data: course_types } = useAsyncData("course_types", async () => {
  const { data } = await supabase.from("course_types").select("*");
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

onMounted(async () => {
  if (props.courseId) {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", props.courseId)
      .single();
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      state.name = data.name;
      state.type = data.type;
      state.description = data.description;
    }
  }
});

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

async function onSubmit(event: FormSubmitEvent<EditCourseFormProps>) {
  if (!userOrganizationsStore.selectedOrganization) {
    toast.add({
      title: "Error",
      description: "No organization data found",
      color: "red",
    });
    return;
  }
  if (props.courseId) {
    updateCourse(
      props.courseId,
      event.data,
      userOrganizationsStore.selectedOrganization.organization_id
    );
  } else {
    createCourse(
      event.data,
      userOrganizationsStore.selectedOrganization.organization_id
    );
  }
}

const createCourse = async (d: EditCourseFormProps, org_id: string) => {
  if (!userOrganizationsStore.selectedOrganization) {
    toast.add({
      title: "Error",
      description: "No organization data found",
      color: "red",
    });
    return;
  }
  try {
    const { data, error } = await supabase
      .from("courses")
      .insert({
        ...d,
        organization_id: org_id,
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
const updateCourse = async (
  course_id: string,
  d: EditCourseFormProps,
  org_id: string
) => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .update({
        ...d,
        organization_id: org_id,
      })
      .eq("id", course_id)
      .select("*");
    if (error) {
      toast.add({
        title: "Error",
        description: "Could not Update course",
        color: "red",
      });
      throw error;
    }
    toast.add({
      title: "Success",
      description: "Course Informations Updated",
      color: "green",
    });
    if (data) {
      emit("course-updated", data[0]);
    }
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "Could not Update Course",
      color: "red",
    });
  }
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "new_course": "Neuer Fahrkurs erstellen",
    "title": "Fahrkurs erstellen",
    "title_edit": "Fahrkus bearbeiten",
    "basic_information": "Grundinformationen. Diese Informationen werden öffentlich angezeigt.",
    "driver_license_class": "Führerscheinklasse",
    "form": {
      "name": {
        "label": "Name",
        "description": "Wird auf Rechnungen, Quittungen und anderen Kommunikationen angezeigt."
      },
      "type": {
        "label": "Kurstyp",
        "description": "Wählen Sie den Typ des Kurses, den Sie erstellen.",
        "placeholder": "Wählen Sie einen Kurs aus"
      },
      "description": {
        "label": "Kursbeschreibung",
        "description": "Beschreiben Sie Ihren Kurs im Detail."
      },
      "submit": "Kurs erstellen",
      "submit_edit": "Kurs bearbeiten",
      "type_error": "Bitte wählen Sie einen gültigen Kurs aus."
    }
  },
  "en": {
    "new_course": "Create New Course",
    "title": "Create Course",
    "title_edit": "Edit Course",
    "basic_information": "Basic information. This information will be displayed publicly.",
    "driver_license_class": "Driver License Class",
    "form": {
      "name": {
        "label": "Name",
        "description": "Will be displayed on invoices, receipts, and other communications."
      },
      "type": {
        "label": "Course Type",
        "description": "Select the type of course you are creating.",
        "placeholder": "Select a course"
      },
      "description": {
        "label": "Course Description",
        "description": "Describe your course in detail."
      },
      "submit": "Create Course",
      "submit_edit": "Edit Course",
      "type_error": "Please select a valid course."
    }
  }
}
</i18n>
