<template>
  <div v-if="bill_items_grouped" class="grid grid-cols-1 gap-3">
    <UCard 
      v-for="cost in bill_items_grouped.costs"
      :key="cost.id"
      :ui="{
        body: {
          padding:'py-2 px-2 sm:p-4',
        }
      }"
    >
      <div class="flex gap-2 items-center justify-between">
        <div class="flex flex-col">
          <p class="font-semibold">
            {{ cost.title }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ cost.description }}
          </p>
        </div>
        <div class="flex flex-col flex-1 items-end">
          <span class="text-sm text-gray-500">{{ t("Price") }}</span>
          <span class="text-lg font-bold">{{
            formatCurrency(cost.price)
          }}</span>
        </div>
      </div>
    </UCard>
    <BillingListGroup :bill-items="bill_items_grouped.activities"/>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from "~/utils/formatters";
import BillingListGroup from "~/components/bills/BillingListGroups.vue";
import type { AppCourseSubscriptionBillItem } from "~/types/app.types";

type Props = {
  billId: string;
};

const props = defineProps<Props>();
const client = useSupabaseClient();

const { t } = useI18n({ useScope: "local" });

const { data: bill_items_grouped } = await useAsyncData(
  `${props.billId}_billing_list`,
  async () => {
    // Bill items grouped by activity
    const { data, error } = await client
      .from("course_subscription_bill_items")
      .select("*")
      .eq("bill_id", props.billId)

    if (error) {
      console.error(error);
      throw error;
    }
    return data;
  },
  {
    transform: (data) => {
      const groups =  {
        costs: [] as AppCourseSubscriptionBillItem[],
        activities: [] as AppCourseSubscriptionBillItem[]
      }
      data.forEach((item) => {
        if(item.course_cost_id) {
          groups.costs.push(item);
        } else {
          groups.activities.push(item);
        }
      })
      return groups;
    },
  }
);
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "Label": "Bezeichnung",
    "Amount": "Menge",
    "Price": "Preis",
    "Details": "Einzelheiten"
  },
  "en": {
    "Label": "Label",
    "Amount": "Amount",
    "Price": "Price",
    "Details": "Details"
  }
}
</i18n>
