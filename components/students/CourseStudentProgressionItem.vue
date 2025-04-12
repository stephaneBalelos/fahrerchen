<template>
  <div v-if="attended_schedules" class="flex flex-col mb-4">
    <p class="font-bold">{{ props.activityName }}</p>
    <UProgress
      v-if="props.activityRequired > 0"
      :value="attended_schedules.length"
      :max="props.activityRequired"
      color="primary"
      indicator
    >
      <template #indicator>
        <span :color="`primary`">
          {{ attended_schedules.length }} /
          {{ props.activityRequired }}
        </span>
      </template>
    </UProgress>
    <div v-else>{{ attended_schedules.length }}</div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  subscriptionId: string;
  activityId: string;
  activityName: string;
  activityRequired: number;
  orgId: string;
};

const props = defineProps<Props>();

const supabase = useSupabaseClient();

const { data: attended_schedules } = useAsyncData(
  'attended_schedule_' + props.subscriptionId + '_' + props.activityId,
  async () => {
    const { data, error } = await supabase
      .from("course_activity_schedules")
      .select("*")
      .eq("activity_id", props.activityId)
      .eq("organization_id", props.orgId)
      .eq('status', 'COMPLETED')
      .contains('attendees', [props.subscriptionId])
    if (error) {
      console.error(error);
      throw error;
    }

    console.log("Attendanded schedule data", data);
    return data;
  }
);
</script>

<style scoped></style>

