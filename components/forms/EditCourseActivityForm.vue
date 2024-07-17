<template>
  <UDashboardSlideover :title="state.name" ref="slideover">
    <UForm
      ref="form"
      :state="state"
      :validate="validate"
      :validate-on="['submit']"
      :onSubmit="saveCourseActivity"
    >
      <UDashboardSection
        :title="t('form_section_title')"
        :description="
          props.course_activity_id
            ? t('form_section_desc')
            : t('form_section_desc_new')
        "
      >
        <UFormGroup
          name="name"
          label="Activity Name"
          placeholder="Theorie Unterricht"
          description="Name of the activity. Will appear on receipts, invoices, and other communication."
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UInput v-model="state.name" autocomplete="on" size="md" />
        </UFormGroup>

        <UFormGroup
          name="requirement_id"
          :label="`Course Requirement`"
          description="Welche Anforderung wird durch diese Aktivität erfüllt."
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <USelectMenu
            v-model="state.activity_type"
            :options="activity_types"
            value-attribute="id"
          >
            <template #label>
              <div v-if="state.activity_type && activity_types">
                <span class="truncate">{{
                  activity_types.find((r) => r.id === state.activity_type)
                    ?.type
                }}</span>
              </div>
              <div v-else>
                <span class="truncate">{{ t('select_activity_type') }}</span>
              </div>
            </template>
            <template #option="{ option }">
              <span class="truncate">{{ option.type }}</span>
            </template>
          </USelectMenu>
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
      <UButton
        v-if="props.course_activity_id"
        @click="deleteCourseActivity(props.course_activity_id)"
        color="red"
        variant="ghost"
        >Delete</UButton
      >
      <UButton @click="form?.submit()">Save</UButton>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppCourseActivity, Database } from "~/types/app.types";
import type { Form, FormSubmitEvent } from "#ui/types";
import { format } from "date-fns";
import DatePicker from "~/components/forms/Inputs/Datepicker.vue";
import UserSelect from "./Inputs/UserSelect.vue";
import { useCourseActivityTypes } from "~/composables/useCourseActivityTypes";

type CourseActivityEdit = Omit<
  AppCourseActivity,
  "id" | "course_id" | "organization_id"
>;
type Props = {
  courseid: string;
  orgid: string;
  course_activity_id?: string;
};

type Emits = {
  (event: "activity-saved", payload?: AppCourseActivity): void;
  (event: "activity-deleted", payload?: AppCourseActivity): void;
};

const { t } = useI18n({
  useScope: 'local'
})

const slideover = useSlideover();

const toast = useToast();

const props = defineProps<Props>();

const form = ref<Form<CourseActivityEdit> | null>(null);

const client = useSupabaseClient<Database>();

const $emit = defineEmits<Emits>();

const activity_types = await useCourseActivityTypes()


const state = reactive<CourseActivityEdit>({
  name: "",
  description: "",
  activity_type: 0,
  required: 0,
  price: 0,
});

onMounted(async () => {
  if (props.course_activity_id) {
    // load the course activity
    try {
      const { data, error } = await client
        .from("course_activities")
        .select("*")
        .eq("id", props.course_activity_id)
        .single();

      if (error) {
        console.error(error);
        toast.add({
          title: "Error",
          description: "An error occured while loading the activity",
          color: "red",
        });
        throw error;
      } else {
        state.name = data.name;
        state.description = data.description;
        state.price = data.price;
        state.activity_type = data.activity_type
      }
    } catch (error) {
      console.log(error);
      toast.add({
        title: "Error",
        description: "An error occured while loading the activity",
        color: "red",
      });
    }
  }
});

onUnmounted(() => {
  console.log("unmounted");
  slideover.reset();
});

const validate = (state: CourseActivityEdit) => {
  const errors = [];
  if (!state.name)
    errors.push({ path: "name", message: "Please enter a name" });
  if (!state.description)
    errors.push({ path: "description", message: "Please enter a description" });
  if (!state.price)
    errors.push({ path: "price", message: "Please enter a price" });
  return errors;
};

async function saveCourseActivity(event: FormSubmitEvent<CourseActivityEdit>) {
  if (props.course_activity_id) {
    await updateCourseActivity(state);
  } else {
    await createCourseActivity(state);
  }
}

async function updateCourseActivity(params: CourseActivityEdit) {
  if (!props.course_activity_id) return;
  try {
    const { data, error } = await client
      .from("course_activities")
      .update({...params})
      .eq("id", props.course_activity_id)
    if (error) { 
      console.error(error)
      throw error
    }
    $emit("activity-saved");
    toast.add({
      title: "Activity saved",
      description: "The activity has been saved successfully.",
      color: "green",
    });
  } catch (error) {
    console.log(error);
    toast.add({
      title: "Error",
      description: "An error occured while updating the activity",
      color: "red",
    });
  }
}
async function createCourseActivity(params: CourseActivityEdit) {
  try {
    const { data, error } = await client
      .from("course_activities")
      .insert({...params, course_id: props.courseid, organization_id: props.orgid})
      .select("*").single()
    if (error) { 
      console.error(error)
      throw error
    }
    console.log(data);
    $emit("activity-saved");
    toast.add({
      title: "Activity saved",
      description: "The activity has been saved successfully.",
      color: "green",
    });
  } catch (error) {
    console.log(error);
    toast.add({
      title: "Error",
      description: "An error occured while updating the activity",
      color: "red",
    });
  }
}

const deleteCourseActivity = async (id: string) => {
  try {
    const { data, error } = await client
      .from("course_activities")
      .delete()
      .eq("id", id).select()
    if (error) {
      console.error(error);
      throw error;
    }

    $emit("activity-deleted");
    toast.add({
      title: "Activity deleted",
      description: "The activity has been deleted successfully.",
      color: "green",
    });
  } catch (error) {
    console.log(error);
    toast.add({
      title: "Error",
      description: "An error occured while deleting the activity",
      color: "red",
    });
  }
};
</script>

<style scoped></style>

<i18n lang="json">
  {
    "de": {
      "form_section_title": "Kurs Aktivität",
      "form_section_desc": "Änderungen vornehmen",
      "form_section_desc_new": "Kurs Aktivität erstellen",
      "form_group_name_label": "Activity Name",
      "select_activity_type": "Äktivitättyp auswählen"
    },
    "en": {
      "form_section_title": "Kurs Aktivität",
      "form_section_desc": "Änderungen vornehmen",
      "form_section_desc_new": "Kurs Aktivität erstellen",
      "form_group_name_label": "Activity Name",
      "select_activity_type": "Äktivitättyp auswählen"
    }
  }
</i18n>
