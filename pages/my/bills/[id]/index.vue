<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar>
        <template #left> 
          <p class="font-semibold">
            Bill #{{ bill?.id }}
          </p>
        </template>

        <template #right>
          <UButton color="gray" variant="solid" size="xs" @click="markAsPaid">
            <i class="i-heroicons-check"></i>
            <span>Mark as paid</span>
          </UButton>
        </template>
      </UDashboardNavbar>
      <div class="flex h-full">
        <UDashboardPanel :width="400">
          <UDashboardPanelContent>
            <StudentsStudentProfileSection
              :student_id="'5ce0b7bd-3312-5b3e-ab6b-ffcf05b50752'"
            />
          </UDashboardPanelContent>
        </UDashboardPanel>
        <UDashboardPanel grow>
          <div class="h-full">
            <div class="absolute inset-0 overflow-y-auto">
              <BillsBillingList :bill_id="id" />
            </div>
          </div>
        </UDashboardPanel>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import type { Database, AppCourseSubscription } from "~/types/app.types";

definePageMeta({
  layout: "orgs",
});

const { id } = useRoute().params;
const client = useSupabaseClient<Database>();
const subscription = ref<AppCourseSubscription | null>(null);
const toast = useToast();

const {
  data: bill,
  error,
  status,
} = useAsyncData(`bills_${id}`, async () => {
  const { data, error } = await client
    .from("course_subscription_bills")
    .select("*")
    .eq("id", id as string)
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
});

async function markAsPaid() {
  try {
    const { data, error } = await client
      .from("course_subscription_bills")
      .update({ paid_at: new Date().toISOString() })
      .eq("id", id as string);

    if (error) {
      console.error(error);
      throw error;
    }
    toast.add({
      title: "Bill marked as paid",
      description: "The bill has been marked as paid",
      color: "green",
    });
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "An error occurred while marking the bill as paid",
      color: "red",
    });
  }
}
</script>

<style scoped></style>
