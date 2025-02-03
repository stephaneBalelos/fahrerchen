<template>
  <div v-if="attendances" class="flex flex-col mb-4">
    <p class="font-bold">{{ props.activityName }}</p>
    <UProgress
      v-if="props.activityRequired > 0"
      :value="attendances.length"
      :max="props.activityRequired"
      color="primary"
      indicator
    >
      <template #indicator>
        <span :color="`primary`">
          {{ attendances.length }} /
          {{ props.activityRequired }}
        </span>
      </template>
    </UProgress>
    <div v-else>{{ attendances.length }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";

type Props = {
  subscriptionId: string;
  activityId: string;
  activityName: string;
  activityRequired: number;
  orgId: string;
};

const props = defineProps<Props>();

const supabase = useSupabaseClient<Database>();

const { data: attendances, } = useAsyncData(
  `course_attendance_${props.subscriptionId}_${props.activityId}`,
  async () => {
    const { data, error } = await supabase
      .from("course_activity_attendances")
      .select("*")
      .eq("course_activity_id", props.activityId)
      .eq("course_subscription_id", props.subscriptionId)
      .eq("organization_id", props.orgId);

    if (error) {
      console.error(error);
      throw error;
    }
    return data;
  }
);
</script>

<style scoped></style>

