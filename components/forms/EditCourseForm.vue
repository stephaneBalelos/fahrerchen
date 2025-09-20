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
            :options="COURSE_TYPES"
            :placeholder="t('form.type.placeholder')"
            :leading-icon="COURSE_ICONS[state.type]"
            :disabled="!!props.courseId"
            :ui="{ wrapper: 'app-select' }"
            :ui-menu="{
              container: 'app-select-menu',
              option: { base: 'app-select-menu-option' },
            }"
          >
            <template #option="{ option }">
              <span class="truncate">{{ option }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup v-if="state.type" :ui="{ container: '' }">
          <UAlert
            :title="state.type"
            :description="g(`course_types.${state.type}.description`)"
            color="primary"
            variant="subtle"
          >
            <template #title="{ title }">
              <span class="text-lg"
                >{{ t("driver_license_class") }} {{ title }}</span
              >
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
import { COURSE_ICONS, COURSE_TYPES } from "~/constants";

type EditCourseFormProps = Omit<
  AppCourse,
  | "id"
  | "inserted_at"
  | "organization_id"
  | "is_active"
  | "allow_self_registration"
  | "create_bill_on_subscription"
>;

type Props = {
  courseId?: string;
  organizationId: string;
};

const props = defineProps<Props>();
const supabase = useSupabaseClient<Database>();
const userOrganizationsStore = useUserOrganizationsStore();
const organization = computed(() => {
  return userOrganizationsStore.organizations.find(
    (o) =>
      o.organization_id === props.organizationId
  );
});
const form = ref<HTMLFormElement | null>(null);

const tutorialStore = useTutorialStore();

const { t } = useI18n({
  useScope: "local",
});

const { t:g } = useI18n({
  useScope: "global",
});

const toast = useToast();

const emit = defineEmits<{
  (e: "course-created" | "course-updated", value: AppCourse): void;
}>();

const state = reactive<EditCourseFormProps>({
  name: "",
  type: "AM",
  description: "",
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
  if (!state.type) {
    errors.push({ path: "type", message: "Choose a course type" });
  }
  if (!state.description)
    errors.push({
      path: "description",
      message: "Please enter a description.",
    });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<EditCourseFormProps>) {
  if (!organization.value) {
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
      event.data
    );
  } else {
    createCourse(
      event.data,
      organization.value.organization_id
    );
  }
}

const createCourse = async (d: EditCourseFormProps, org_id: string) => {
  if (!organization.value) {
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
      if (error.code === "23505") {
        toast.add({
          title: t("course_error_duplicate_course_type.title"),
          description: t("course_error_duplicate_course_type.description", {
            type: state.type,
          }),
          color: "red",
        });
      } else {
        throw error;
      }
    }
    toast.add({
      title: t("course_created.title"),
      description: t("course_created.description"),
      color: "green",
    });
    if (data) {
      emit("course-created", data[0]);
      tutorialStore.completeStep("course_create");
    }
  } catch (error) {
    console.error(error);
    toast.add({
      title: t("course_error.title"),
      description: t("course_error.description"),
      color: "red",
    });
  }
};
const updateCourse = async (
  course_id: string,
  d: EditCourseFormProps,
) => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .update({
        name: d.name,
        description: d.description,
      })
      .eq("id", course_id)
      .select("*");
    if (error) {
      throw error;
    }
    toast.add({
      title: t("course_updated.title"),
      description: t("course_updated.description"),
      color: "green",
    });
    if (data) {
      emit("course-updated", data[0]);
    }
  } catch (error) {
    console.error(error);
    toast.add({
      title: t("course_error.title"),
      description: t("course_error.description"),
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
    },
    "course_created": {
      "title": "Kurs erstellt",
      "description": "Der Kurs wurde erfolgreich erstellt."
    },
    "course_updated": {
      "title": "Kurs aktualisiert",
      "description": "Die Kursinformationen wurden erfolgreich aktualisiert."
    },
    "course_error": {
      "title": "Fehler",
      "description": "Der Kurs konnte nicht erstellt werden."
    },
    "course_error_duplicate_course_type": {
      "title": "Fehler",
      "description": "Es existiert bereits ein Kurs für die Fürerscheinklasse {type}."
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
    },
    "course_created": {
      "title": "Course Created",
      "description": "The course was created successfully."
    },
    "course_updated": {
      "title": "Course Updated",
      "description": "The course information was updated successfully."
    },
    "course_error": {
      "title": "Error",
      "description": "The course could not be created."
    },
    "course_error_duplicate_course_type": {
      "title": "Error",
      "description": "A course for the driver's license class {type} already exists."
    }
  }
}
</i18n>
