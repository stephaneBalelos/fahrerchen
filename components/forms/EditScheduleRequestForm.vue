<template>
  <UDashboardSlideover>
    <UForm
      :schema="_schema"
      :state="form"
      :submit-label="
        props.requestId ? t('update_request') : t('create_request')
      "
      @submit="onSubmit"
    >
      <CourseActivitySelect
        v-model="form.activityId"
        :org-id="props.organizationId"
      />
      <UPopover :popper="{ placement: 'bottom-start' }">
        <div class="w-full">
          <UButton
            block
            color="white"
            variant="solid"
            icon="i-heroicons-calendar-days-20-solid"
            :size="'md'"
            :label="format(new Date(form.start_at), 'd MMM, yyy')"
          />
        </div>
        <template #panel="">
          <DatePicker v-model="form.start_at" is-required :mode="'dateTime'" />
        </template>
      </UPopover>
      <UButton
        type="submit"
        :label="props.requestId ? t('update_request') : t('create_request')"
        color="primary"
        variant="solid"
        block
      />
    </UForm>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { UDashboardSlideover } from "#components";
import CourseActivitySelect from "./Inputs/CourseActivitySelect.vue";
import DatePicker from "./Inputs/Datepicker.vue";
import { format } from "date-fns";

type Props = {
  requestId?: string;
  subscriptionId?: string;
  organizationId: string;
  startAt?: Date;
};
const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const $emits = defineEmits<{
  (e: "request-saved" | "request-deleted"): void;
}>();

const userStore = useUserStore();
const $courseActivitySchedules = useCourseActivitySchedules();

const _schema = z.object({
  activityId: z.string({ required_error: "Activity ID is required" }),
  subscriptionId: z.string({ required_error: "Subscription ID is required" }),
  start_at: z.date({ required_error: "Start date is required" }),
});

type Schema = z.infer<typeof _schema>;

const form = ref<Schema>({
  activityId: "",
  subscriptionId: props.subscriptionId || "",
  start_at: props.startAt || new Date(),
});

const onSubmit = async ($event: FormSubmitEvent<Schema>) => {
  if (props.requestId) {
    await updateCourseActivityScheduleRequest($event.data);
  } else {
    await createCreateCourseActivityScheduleRequest($event.data);
  }

  $emits("request-saved");
};

const createCreateCourseActivityScheduleRequest = async (data: Schema) => {
  if (!userStore.user) {
    throw new Error("User not logged in");
  }
  try {
    await $courseActivitySchedules.createCourseActivityScheduleRequest({
      activity_id: data.activityId,
      subscription_id: data.subscriptionId,
      start_at: data.start_at.toISOString(),
      organization_id: props.organizationId,
      requested_by: userStore.user.id,
      schedule_id: null,
    });
    $emits("request-saved");
  } catch (error) {
    console.error("Error creating schedule request:", error);
  }
};

const updateCourseActivityScheduleRequest = async (data: Schema) => {
  if (!props.requestId) {
    throw new Error("No request ID provided for update");
  }
  try {
    await $courseActivitySchedules.updateCourseActivityScheduleRequest(
      props.requestId,
      {
        start_at: data.start_at.toISOString(),
      }
    );
    $emits("request-saved");
  } catch (error) {
    console.error("Error updating schedule request:", error);
  }
};
</script>

<style scoped></style>
