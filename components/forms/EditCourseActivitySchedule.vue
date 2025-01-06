<template>
  <UDashboardSlideover
    id="edit-activity-schedule"
    ref="slideover"
    :title="props.scheduleId ? 'Edit Activity Schedule' : 'New Activity Schedule'"
  >
    <UForm
      ref="form"
      :state="state"
      :schema="schema"
      @submit="onSubmit"
    >
      <UDashboardSection
        title="Course Activity Schedule"
        :description="
          props.scheduleId
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
            :options="course_activities"
            value-attribute="id"
            label-attribute="name"
            :disabled="!!props.scheduleId"
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
        <UFormGroup
          name="assigned_to"
          :label="`Verantwortlich`"
          description="Wer ist für die Aktivität verantwortlich."
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <USelectMenu
            v-model="state.assigned_to"
            :options="organization_members"
            value-attribute="user_id"
            option-attribute="email"
          >
            <template #label>
              <div v-if="state.assigned_to && organization_members.length > 0">
                <span class="truncate">{{
                  organization_members.find(
                    (m) => m.user_id === state.assigned_to
                  )?.user?.fullname
                }}</span>
              </div>
              <div v-else>
                <span class="truncate">Zugewiesen an</span>
              </div>
            </template>
            <template #option="{ option }">
              <span v-if="option.user.firstname && option.user.lastname" class="truncate"
                >{{ option.user.firstname }} {{ option.user.lastname }}</span
              >
              <span v-else class="truncate">{{ option.user.email }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>
        <UFormGroup
          name="start_at"
          :label="`Date`"
          description="Wann ist die Aktivität geplant."
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <div class="grid grid-cols-2 gap-4">
            <UPopover class="col-span-2" :popper="{ placement: 'bottom-start' }">
              <div class="w-full">
                <UButton
                  block
                  color="white" variant="solid"
                  icon="i-heroicons-calendar-days-20-solid"
                  :label="format(new Date(state.start_at), 'd MMM, yyy')"
                />
              </div>
              <template #panel="">
                <DatePicker
                  v-model="state.start_at"
                  is-required
                  :mode="'dateTime'"
                  @update:model-value="onUpdateStartDate"
                />
              </template>
            </UPopover>
            <UPopover :popper="{ placement: 'bottom-start' }">
              <div class="w-full">
                <UButton
                  block
                  color="white" variant="solid"
                  icon="i-heroicons-clock"
                  :label="format(new Date(state.start_at), 'HH:mm a')"
                />
              </div>
              <template #panel="">
                <DatePicker
                  v-model="state.start_at"
                  is-required
                  :mode="'time'"
                  @update:model-value="onUpdateStartDate"
                />
              </template>
            </UPopover>
            <UPopover :popper="{ placement: 'bottom-start' }">
              <div class="w-full">
                <UButton
                  block
                  color="white" variant="solid"
                  icon="i-heroicons-clock"
                  :label="format(new Date(state.end_at), 'HH:mm a')"
                />
              </div>
              <template #panel="">
                <DatePicker
                  v-model="state.end_at"
                  is-required
                  :mode="'time'"
                />
              </template>
            </UPopover>
          </div>
        </UFormGroup>
      </UDashboardSection>
    </UForm>

    <template #footer>
      <UButton
        v-if="props.scheduleId"
        color="red"
        variant="ghost"
        @click="deleteCourseActivitySchedule(props.scheduleId)"
        >Delete</UButton
      >
      <UButton @click="form?.submit()">Save</UButton>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type {
  AppCourseActivitySchedule,
  AppScheduleType,
  Database,
} from "~/types/app.types";
import type { Form, FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import { addHours, format } from "date-fns";
import DatePicker from "./Inputs/Datepicker.vue";
import { useCourseActivities } from "~/composables/useCourseActivities";

type CourseActivityScheduleEdit = Omit<
  AppCourseActivitySchedule,
  "id" | "organization_id" | "status"
>;

type RepeatMode = AppScheduleType;

const _repeatOptions = [
  { label: "Once", value: "ONCE" },
  { label: "Daily", value: "DAILY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Yearly", value: "YEARLY" },
] as { label: string; value: RepeatMode }[];

const _dayOfWeekOptions = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
];

type Props = {
  orgid: string;
  scheduleId?: string;
  courseid: string;
  activityid: string;
  date?: Date;
};

const props = defineProps<Props>();
const emits = defineEmits(["activity-saved", "activity-deleted"]);
const toast = useToast();
const client = useSupabaseClient<Database>();
const course_activities = await useCourseActivities(props.orgid, props.courseid);
const organization_members = await useOrganizationMembers(props.orgid, true);

const schema = z.object({
  activity_id: z.string().uuid(),
  assigned_to: z.string().uuid().optional(),
  start_at: z.date(),
  end_at: z.date(),
}).superRefine((data, ctx) => {
  if (data.start_at > data.end_at) {
    ctx.addIssue({
      path: ["start_at"],
      code: z.ZodIssueCode.custom,
      message: "End date must be after start date",
    });
    return z.NEVER;
  }
  return true;
});

type Schema = z.infer<typeof schema>;

const form = ref<Form<Schema>>();

const state = reactive<Schema>({
  start_at: new Date(),
  end_at: addHours(new Date(), 1),
  activity_id: props.activityid,
  assigned_to: undefined,
});

onMounted(async () => {
  if (props.scheduleId) {
    // load the course activity schedule
    try {
      const { data, error } = await client
        .from("course_activity_schedules")
        .select("*")
        .eq("id", props.scheduleId)
        .single();

      if (error) {
        console.error(error);
        toast.add({
          title: "Error",
          description: "Failed to load course activity schedule",
          color: "red",
        });
      } else {
        state.start_at = new Date(data.start_at);
        state.end_at = new Date(data.end_at);
        state.assigned_to = data.assigned_to ?? undefined;
      }
    } catch (error) {
      console.error(error);
      toast.add({
        title: "Error",
        description: "Failed to load course activity schedule",
        color: "red",
      });
    }
  }
})

function onSubmit(_event: FormSubmitEvent<Schema>) {
  const data: CourseActivityScheduleEdit = {
    activity_id: state.activity_id,
    course_id: props.courseid,

    assigned_to: state.assigned_to ?? null,
    start_at: state.start_at.toISOString(),
    end_at: state.end_at.toISOString(),
  };

  if (props.scheduleId) {
    // update the course activity schedule
    updateCourseActivitySchedule(props.scheduleId, data);
  } else {
    // create a new course activity schedule
    createCourseActivitySchedule(data);
  }
}

async function createCourseActivitySchedule(data: CourseActivityScheduleEdit) {
  try {
    const { error } = await client
      .from("course_activity_schedules")
      .insert({
        ...data,
        organization_id: props.orgid,
      })
      .select();

    if (error) {
      console.error(error);
      toast.add({
        title: "Error",
        description: "Failed to create course activity schedule",
        color: "red",
      });
    } else {
      toast.add({
        title: "Success",
        description: "Course activity schedule created",
        color: "green",
      });
      emits('activity-saved');
    }
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "Failed to create course activity schedule",
      color: "red",
    });
  }
}

async function updateCourseActivitySchedule(
  id: string,
  data: CourseActivityScheduleEdit
) {
  try {
    const { error } = await client
      .from("course_activity_schedules")
      .update(data)
      .eq("id", id)
      .select();

    if (error) {
      console.error(error);
      toast.add({
        title: "Error",
        description: "Failed to update course activity schedule",
        color: "red",
      });
    } else {
      toast.add({
        title: "Success",
        description: "Course activity schedule updated",
        color: "green",
      });
      emits('activity-saved');
    }
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "Failed to update course activity schedule",
      color: "red",
    });
  }
}

function deleteCourseActivitySchedule(id: string) {
  console.log("Delete course activity schedule", id);
}

function onUpdateStartDate(date: Date) {
  state.start_at = date;
  state.end_at = addHours(date, 1);
}


function _onChangeRepeat(value: RepeatMode) {
  console.log("Change repeat", value);
}
</script>

<style scoped></style>


