<template>
  <UDashboardSlideover :title="'New Activity Schedule'" ref="slideover" prevent-close>
    <UForm
      ref="form"
      :state="state"
      :schema="schema"
      :validate-on="['submit']"
      :onSubmit="onSubmit"
    >
      <UDashboardSection
        title="Course Activity Schedule"
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
            :options="course_activities"
            value-attribute="id"
            label-attribute="name"
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
            value-attribute="member_id"
            option-attribute="email"
          >
            <template #label>
              <div v-if="state.assigned_to && organization_members.length > 0">
                <span class="truncate">{{
                  organization_members.find((m) => m.member_id === state.assigned_to)
                    ?.email
                }}</span>
              </div>
              <div v-else>
                <span class="truncate">Zugewiesen an</span>
              </div>
            </template>
            <template #option="{ option }">
              <span v-if="option.firstname && option.lastname" class="truncate">{{ option.firstname }} {{ option.lastname }}</span>
              <span v-else class="truncate">{{ option.email }}</span>
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
            <UPopover :popper="{ placement: 'bottom-start' }">
              <div class="grid grid-cols-1 gap-2 w-full">
                Start Datum
                <UButton
                  block
                  icon="i-heroicons-calendar-days-20-solid"
                  :label="format(new Date(state.start_at), 'd MMM, yyy')"
                />
              </div>

              <template #panel="{ close }">
                <DatePicker
                  v-model="state.start_at"
                  is-required
                  @close="close"
                  @update:model-value="onUpdateStartDate"
                />
              </template>
            </UPopover>
            <UPopover :popper="{ placement: 'bottom-start' }">
              <div class="grid grid-cols-1 gap-2 w-full">
                <div>End Datum</div>
                <UButton
                  block
                  icon="i-heroicons-calendar-days-20-solid"
                  :label="format(new Date(state.end_at), 'd MMM, yyy')"
                />
              </div>
              <template #panel="{ close }">
                <DatePicker v-model="state.end_at" is-required @close="close" />
              </template>
            </UPopover>
          </div>
        </UFormGroup>
        <UFormGroup
          name="repeat"
          :label="`Activity Repeat`"
          description="Wann soll die Aktivität wiederholt werden"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <div class="grid grid-cols-1 gap-2 my-4">
            <div>Wiederholen</div>
            <USelectMenu
              v-model="state.repeat"
              :options="repeatOptions"
              :value-attribute="'value'"
              placeholder="Wiederholen"
            />
          </div>

          <div v-if="state.repeat == 'weekly'" class="grid grid-cols-1 gap-4 my-4">
            <div>An welcher tag</div>
            <USelectMenu
              v-model="state.day_of_week"
              :options="dayOfWeekOptions"
              :value-attribute="'value'"
              multiple
              placeholder="Days"
            />
          </div>

          <div class="grid grid_cols-1 gap-4">
            <UAlert
              v-if="state.repeat == 'daily'"
              :description="`jeden Tag um ${format(
                new Date(state.start_at),
                'HH:mm'
              )}`"
            />
            <UAlert
              v-if="state.repeat == 'weekly'"
              :description="`Jede Woche am ${state.day_of_week
                .map((d) => dayOfWeekOptions.find((o) => o.value === d)?.label)
                .join(', ')} um ${format(new Date(state.start_at), 'HH:mm')}`"
            />
            <UAlert
              v-if="state.repeat == 'monthly'"
              :description="`Jede Monat am ${format(
                state.start_at,
                'dd.'
              )} um ${format(new Date(state.start_at), 'HH:mm')}`"
            />
          </div>
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
import type {
  AppCourseActivity,
  AppCourseActivitySchedule,
  AppScheduleType,
  Database,
} from "~/types/app.types";
import type { Form, FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import { addHours, format, set } from "date-fns";
import DatePicker from "./Inputs/Datepicker.vue";

type CourseActivityScheduleEdit = Omit<
  AppCourseActivitySchedule,
  "id" | "organization_id"
>;

type RepeatMode = AppScheduleType

const repeatOptions = [
  { label: "Once", value: "ONCE" },
  { label: "Daily", value: "DAILY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Yearly", value: "YEARLY" },
] as { label: string; value: RepeatMode }[];

const dayOfWeekOptions = [
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
  courseid: string;
  activityid: string;
  activity_schedule_id?: string;
  date?: Date;
};

const props = defineProps<Props>();
const toast = useToast();
const client = useSupabaseClient<Database>();


const zDayOfWeek = z.number().int().min(1).max(7);

const schema = z.object({
  activity_id: z.string().uuid(),
  assigned_to: z.string().uuid().optional(),
  start_at: z.date(),
  end_at: z.date(),
  repeat: z.enum(repeatOptions.map((o) => o.value) as [string, ...string[]]),
  day_of_week: z.array(zDayOfWeek).max(7),
});

schema.refine((date) => {
  return date.start_at < date.end_at;
});

type Schema = z.infer<typeof schema>;

const form = ref<Form<Schema>>();

const state = reactive<Schema>({
  start_at: new Date(),
  end_at: addHours(new Date(), 1),
  repeat: "once",
  activity_id: props.activityid,
  assigned_to: "",
  day_of_week: [],
});

const { course_activities } = useCourseActivities(props.courseid);
const { organization_members } = useorganizationMembers(props.orgid);

function onSubmit(event: FormSubmitEvent<Schema>) {

  console.log("Submit", event);

  const data: CourseActivityScheduleEdit = {
    activity_id: state.activity_id,
    assigned_to: state.assigned_to ?? null,
    start_at: state.start_at.toISOString(),
    end_at: state.end_at.toISOString(),
    repeat: state.repeat as RepeatMode,
    day_of_week: state.day_of_week,
    hour: state.start_at.getHours(),
    minute: state.start_at.getMinutes(),
    day: state.start_at.getDate(),
    month: state.start_at.getMonth(),
    year: state.start_at.getFullYear(),
  };

  createCourseActivitySchedule(data);
}

async function createCourseActivitySchedule(data: CourseActivityScheduleEdit) {
  console.log(data)
  try {
    const { data:res, error } = await client
      .from("course_activity_schedules")
      .insert({
        ...data,
        organization_id: props.orgid,
      }).select();

    if (error) {
      console.error(error);
      toast.add({
        title: "Error",
        description: "Failed to create course activity schedule",
        color: 'red',
      });
    } else {
      console.log(res)
      toast.add({
        title: "Success",
        description: "Course activity schedule created",
        color: 'green',
      });
    }
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "Failed to create course activity schedule",
      color: 'red',
    });
  }
}

function deleteCourseActivitySchedule(id: string) {
  console.log("Delete course activity schedule", id);
}

function onUpdateStartDate(date: Date) {
  state.start_at = date;
  state.end_at = addHours(date, 1);
  const dayOfWeekStart = date.getDay() === 0 ? 7 : date.getDay();
  state.day_of_week = dayOfWeekOptions
    .filter((d) => d.value == dayOfWeekStart)
    .map((d) => d.value);
}

function onChangeRepeat(value: RepeatMode) {
  console.log("Change repeat", value);
}
</script>

<style scoped></style>
