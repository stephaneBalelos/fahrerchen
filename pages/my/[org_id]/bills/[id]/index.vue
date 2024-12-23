<template>
  <UDashboardPage>
    <UDashboardPanel grow v-if="bill">
      <UDashboardNavbar>
        <template #left>
          <p class="font-semibold">Bill #{{ bill.data.id }}</p>
        </template>

        <template #right>
          <UButton v-if="!bill.data.paid_at"color="gray" variant="solid" size="xs" @click="markAsPaid">
            <i class="i-heroicons-check"></i>
            <span>Mark as paid</span>
          </UButton>
        </template>
      </UDashboardNavbar>
      <div class="flex h-full" v-if="bill.data && bill.subscription">
        <UDashboardPanel :width="400">
          <UDashboardPanelContent v-if="bill.subscription && bill.subscription.student && bill.subscription.course">
            <BillInformations :bill="bill.data" :student="bill.subscription.student" :course="bill.subscription.course" :subscription="bill.subscription"></BillInformations>
          </UDashboardPanelContent>
        </UDashboardPanel>
        <UDashboardPanel grow>
          <div class="h-full">
            <div class="absolute inset-0 overflow-y-auto">
              <UDashboardSection
                :title="`${bill.subscription.student?.firstname} ${bill.subscription.student?.lastname}`"
                icon="i-heroicons-user"
                class="px-4 mt-6"
                :ui="{ wrapper: 'divide-none'}"
              >
              <template #links>
                <UButton v-if="!bill.data.ready_to_pay" color="primary" variant="soft" @click="markAsReadyToPay">Mark Bill as Ready to Pay</UButton>
                <UButton v-if="!bill.data.paid_at" color="red" variant="soft">Cancel Bill</UButton>
              </template>
                <template #description>
                  <div>
                    <p>Streetname 109</p>
                    <p>23456 Zipcode</p>
                    <p>Wilhelmshaven Germany</p>
                  </div>
                </template>
                <BillsBillingList :bill_id="id" />
              </UDashboardSection>
            </div>
            <UDashboardToolbar class="absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-800 pb-8 pt-4">
              <template #right>
                <div class="flex flex-col flex-1 items-end">
                <span class="text-sm text-gray-500">Total</span>
                <span class="text-xl font-bold">{{ formatCurrency(bill.data.total) }}</span>
              </div>
              </template>
            </UDashboardToolbar>
          </div>
        </UDashboardPanel>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import BillInformations from "~/components/bills/BillInformations.vue";
import type { Database, AppCourseSubscription } from "~/types/app.types";
import { formatCurrency } from "~/utils/formatters";

definePageMeta({
  layout: "orgs",
});

const { id } = useRoute().params;
const client = useSupabaseClient<Database>();
const toast = useToast();

const {
  data: bill,
  error,
  status,
  refresh,
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

  const subscription = await useCourseSubscription(data.course_subscription_id);

  return {
    data,
    subscription,
  };
});

async function markAsReadyToPay() {
  try {
    const { data, error } = await client
      .from("course_subscription_bills")
      .update({ ready_to_pay: true })
      .eq("id", id as string);

    if (error) {
      console.error(error);
      throw error;
    }
    toast.add({
      title: "Bill marked as ready to pay",
      description: "The bill has been marked as ready to pay",
      color: "green",
    });
    refresh();
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "An error occurred while marking the bill as ready to pay",
      color: "red",
    });
  }
}

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
