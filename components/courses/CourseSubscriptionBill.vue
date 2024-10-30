<template>
  <UDashboardSlideover :title="'Abrechnung'" ref="slideover">
    <StudentProfileSection
      v-if="subscription"
      :student_id="subscription.student_id"
    />
    <UDashboardCard
      title="Recent sales"
      description="You made 265 sales this month."
      icon="i-heroicons-chart-bar"
    >
      <UProgress />
    </UDashboardCard>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import StudentProfileSection from "../students/StudentProfileSection.vue";

type Props = {
  subscription_id: string;
};

const props = defineProps<Props>();

// const { subscription, student, course } = useAttrs() as Props;
const client = useSupabaseClient<Database>();

const {
  data: subscription,
  error,
  status,
} = await useAsyncData(
  `course_subscriptions_${props.subscription_id}`,
  async () => {
    const { data, error } = await client
      .from("course_subscriptions")
      .select("*")
      .eq("id", props.subscription_id)
      .single();
    if (error) {
      console.log("error", error);
      throw error;
    }
    console.log("data", data);
    return data;
  }
);


</script>

<style scoped></style>
