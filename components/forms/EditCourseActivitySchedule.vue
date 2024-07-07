<template>
  <UDashboardSlideover :title="'New Activity Schedule'" ref="slideover">
    <UForm
      ref="form"
      :state="state"
      :schema="schema"
      :validate-on="['submit']"
      :onSubmit="onSubmit"
    >
      <UDashboardSection
        title="Course Activity"
        :description="
          props.activity_schedule_id
            ? 'Edit the course activity schedule'
            : 'Add a new course activity schedule'
        "
      >
        <UFormGroup
          name="activity_id"
          :label="`Course Activity`"
          description="Welche Aktivität wird durchgeführt."
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <USelectMenu
            v-model="state.activity_id"
            :options="course_activities ?? []"
            value-attribute="id"
          >
            <template #label>
              <div v-if="state.activity_id && course_activities">
                <span class="truncate">{{
                  course_activities.find((a) => a.id === state.activity_id)
                    ?.name
                }}</span>
              </div>
              <div v-else>
                <span class="truncate">Select an Activity</span>
              </div>
            </template>
            <template #option="{ option }">
              <span class="truncate">{{ option.name }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>
      </UDashboardSection>
    </UForm>

    <template #footer>
      <UButton
        v-if="props.activity_schedule_id"
        @click="deleteCourseActivitySchedule(props.activity_schedule_id)"
        color="red"
        variant="ghost"
        >Delete</UButton
      >
      <UButton @click="form?.submit()">Save</UButton>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppCourseActivity, AppCourseActivitySchedule, Database } from "~/types/app.types";
import type { Form, FormSubmitEvent } from "#ui/types";
import { z } from "zod";

type CourseActivityScheduleEdit = Omit<
  AppCourseActivitySchedule,
  "id" | "organisation_id"
>;

type Props = {
  orgid: string;
  courseid: string;
  activityid: string;
  activity_schedule_id?: string;
  date?: Date;
};

const props = defineProps<Props>();
const toast = useToast();
const client = useSupabaseClient<Database>();

const schema = z.object({
  repeat: z.boolean(),
  activity_id: z.string().uuid(),
  assigned_to: z.string().uuid().optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
});

type Schema = z.infer<typeof schema>;

const form = ref<Form<Schema>>();

const state = reactive<Schema>({
  start_time: "",
  end_time: "",
  repeat: false,
  activity_id: props.activityid,
  assigned_to: "",
});

const course_activities = ref<AppCourseActivity[] | null>(null);

function onSubmit(event: FormSubmitEvent<any>) {
  console.log("Form submitted", event);
}

function deleteCourseActivitySchedule(id: string) {
  console.log("Delete course activity schedule", id);
}
</script>

<style scoped></style>
