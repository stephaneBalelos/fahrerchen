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
        title="Course Activity"
        :description="
          props.course_activity_id
            ? 'Edit the course activity'
            : 'Add a new course activity'
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
          name="date"
          label="Date"
          description="When"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton
              block
              color="white"
              trailing-icon="i-heroicons-chevron-down-20-solid"
              :label="format(state.date, 'd MMM, yyy')"
            />

            <template #panel="{ close }">
              <DatePicker v-model="state.date" is-required @close="close" />
            </template>
          </UPopover>
        </UFormGroup>

        <UFormGroup
          name="assigned_to"
          :label="`Assigned To`"
          description="Who is assigned to this activity."
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UserSelect v-model="state.assigned_to" />
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
            v-model="state.requirement_id"
            :options="course_requirements ?? []"
            value-attribute="id"
          >
            <template #label>
              <div v-if="state.requirement_id && course_requirements">
                <span class="truncate">{{
                  course_requirements.find((r) => r.id === state.requirement_id)
                    ?.name
                }}</span>
              </div>
              <div v-else>
                <span class="truncate">Select a requirement</span>
              </div>
            </template>
            <template #option="{ option }">
              <span class="truncate">{{ option.name }}</span>
            </template>
          </USelectMenu>
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
        <!-- <UFormGroup
          name="price"
          label="Price"
          description="Will appear on receipts, invoices, and other communication."
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UInput v-model="state.price" autocomplete="on" size="md" />
        </UFormGroup> -->
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

type CourseActivityEdit = Omit<
  AppCourseActivity,
  "id" | "date" | "course_id" | "organisation_id"
> & {
  date: Date;
};
type Props = {
  courseid: string;
  orgid: string;
  date: Date;
  course_activity_id?: string;
};

type Emits = {
  (event: "activity-saved", payload?: AppCourseActivity): void;
  (event: "activity-deleted", payload?: AppCourseActivity): void;
};

const slideover = useSlideover();

const toast = useToast();

const props = defineProps<Props>();

const form = ref<Form<CourseActivityEdit> | null>(null);

const date = ref(new Date());

const client = useSupabaseClient<Database>();

const $emit = defineEmits<Emits>();

const { data: course_requirements, error } = await useAsyncData(
  `course_requirements_${props.courseid}`,
  async () => {
    const { data, error } = await client
      .from("course_requirements")
      .select("*")
      .eq("course_id", props.courseid);
    if (error) {
      console.error(error);
      throw error;
    }
    return data;
  }
);

const state = reactive<CourseActivityEdit>({
  name: "",
  description: "",
  assigned_to: null,
  date: props.date,
  requirement_id: null,
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
        state.assigned_to = data.assigned_to;
        state.date = new Date(data.date);
        state.requirement_id = data.requirement_id;
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
  if (!state.date)
    errors.push({ path: "date", message: "Please enter a date" });
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
      .update({...params, date: params.date.toISOString()})
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
      .insert({...params, date: params.date.toDateString(), course_id: props.courseid, organisation_id: props.orgid})
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
