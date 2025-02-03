<template>
  <UDashboardSlideover :title="t('add_activity_attendance')">
    <UForm ref="form" :state="state" :schema="schema" @submit="onSubmit">
      <UDashboardSection
        :title="`${subscription.student?.firstname} ${subscription.student?.lastname}`"
        :description="t('add_new_schedule_description')"
      >
        <UFormGroup
          name="activity_id"
          :label="t('form.activity.label')"
          :description="t('form.activity.description')"
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
                <span class="truncate">{{
                  t("form.activity.placeholder")
                }}</span>
              </div>
            </template>
            <template #option="{ option }">
              <span class="truncate">{{ option.name }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>
        <UFormGroup
          name="assigned_to"
          :label="t('form.assigned_to.label')"
          :description="t('form.assigned_to.description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <FormsInputsUserSelect
            v-model="state.assigned_to"
            :orgid="props.orgId"
          />
        </UFormGroup>
        <UFormGroup
          name="start_at"
          :label="t('form.start_at.label')"
          :description="t('form.start_at.description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <div class="grid grid-cols-2 gap-4">
            <UPopover
              class="col-span-2"
              :popper="{ placement: 'bottom-start' }"
            >
              <div class="w-full">
                <UButton
                  block
                  color="white"
                  variant="solid"
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
                  color="white"
                  variant="solid"
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
                  color="white"
                  variant="solid"
                  icon="i-heroicons-clock"
                  :label="format(new Date(state.end_at), 'HH:mm a')"
                />
              </div>
              <template #panel="">
                <DatePicker v-model="state.end_at" is-required :mode="'time'" />
              </template>
            </UPopover>
          </div>
        </UFormGroup>
      </UDashboardSection>
    </UForm>

    <template #footer>
        <div class="flex w-full justify-end space-x-4">
            <UButton variant="solid" color="primary" @click="form?.submit()">
                {{ t('save') }}
            </UButton>
            <UButton variant="ghost" color="red" @click="$emit('close')">
                {{ t('cancel') }}
            </UButton>
        </div>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import { addHours, format } from "date-fns";
import { z } from "zod";
import type { Form, FormSubmitEvent } from "#ui/types";
import DatePicker from "./Inputs/Datepicker.vue";
import type { AppCourseActivitySchedule, Database } from "~/types/app.types";

type Props = {
  subscriptionId: string;
  orgId: string;
};
type CourseActivityScheduleEdit = Omit<
  AppCourseActivitySchedule,
  "id" | "organization_id" | "status"
>;

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();
const $emit = defineEmits(["close", "created"]);
const client = useSupabaseClient<Database>();
const toast = useToast();

const subscription = await useCourseSubscription(props.subscriptionId);

if (!subscription) {
  throw new Error("Subscription not found");
}

const course_activities = await useCourseActivities(
  props.orgId,
  subscription.course_id
);

const schema = z
  .object({
    course_id: z.string().uuid(),
    activity_id: z.string().uuid(),
    assigned_to: z.string().uuid().optional(),
    start_at: z.date(),
    end_at: z.date(),
  })
  .superRefine((data, ctx) => {
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
    course_id: subscription.course_id,
  start_at: new Date(),
  end_at: addHours(new Date(), 1),
  activity_id: course_activities[0].id,
  assigned_to: undefined,
});

async function onSubmit(_event: FormSubmitEvent<Schema>) {
    const schedule: CourseActivityScheduleEdit = {
        course_id: state.course_id,
        activity_id: state.activity_id,
        assigned_to: state.assigned_to ?? null,
        start_at: state.start_at.toISOString(),
        end_at: state.end_at.toISOString(),
        attendees: [],
    }
  try {
    const { data:newSchedule, error: scheduleError } = await client.from("course_activity_schedules").insert({
        ...schedule,
        organization_id: props.orgId
    }).select().single();

    if (scheduleError) {
        console.error(scheduleError);
      throw scheduleError;
    }

    console.log(newSchedule);

    const { error: attendanceError } = await client.from("course_activity_attendances").insert({
        course_activity_id: state.activity_id,
        activity_schedule_id: newSchedule.id,
        course_subscription_id: props.subscriptionId,
        organization_id: props.orgId
    });

    if (attendanceError) {
        console.error(attendanceError);
      throw attendanceError;
    }

    $emit("created");

  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "Failed to save course activity schedule",
      color: "red",
    });
  }
}

function onUpdateStartDate(date: Date) {
  state.start_at = date;
  state.end_at = addHours(date, 1);
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "add_activity_attendance": "Neue Termin hinzufügen",
    "add_new_schedule_description": "Fügen Sie eine neue Aktivität für den Schüler hinzu",
    "form": {
      "activity": {
        "label": "Aktivität",
        "description": "Wählen Sie die Aktivität aus",
        "placeholder": "Wählen Sie die Aktivität aus"
      },
      "assigned_to": {
        "label": "Zugewiesen an",
        "description": "Wählen Sie die Person aus, die für die Aktivität verantwortlich ist"
      },
      "start_at": {
        "label": "Startzeit",
        "description": "Wählen Sie die Startzeit der Aktivität aus"
      }
    },
    "cancel": "Abbrechen",
    "save": "Speichern"
  },
  "en": {
    "add_activity_attendance": "Add New Schedule",
    "add_new_schedule_description": "Add a new activity for the student",
    "form": {
      "activity": {
        "label": "Activity",
        "description": "Select the activity",
        "placeholder": "Select the activity"
      },
      "assigned_to": {
        "label": "Assigned to",
        "description": "Select the person responsible for the activity"
      },
      "start_at": {
        "label": "Start At",
        "description": "Select the start time of the activity"
      }
    },
    "cancel": "Cancel",
    "save": "Save"
  }
}
</i18n>
