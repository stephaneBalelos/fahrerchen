<template>
  <div>
    <UAccordion
      v-if="bill_items_grouped"
      :items="bill_items_grouped"
      :ui="{ wrapper: 'flex flex-col w-full' }"
    >
      <template #default="{ item }">
        <UButton
          color="gray"
          variant="ghost"
          class="border-t border-gray-200 dark:border-gray-800 justify-between px-0"
          :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
        >
          <div class="flex flex-col items-start">
            <span class="text-sm text-gray-500">{{ t('Label') }}</span>
            <span class="text-lg font-bold">{{ item.label }}</span>
          </div>

          <template #trailing>
            <div class="flex items-center gap-8">
              <div class="flex flex-col flex-1 items-end">
                <span class="text-sm text-gray-500">{{ t('Amount') }}</span>
                <span class="text-lg font-bold">{{ item.items?.length }}</span>
              </div>
              <div class="flex flex-col flex-1 items-end">
                <span class="text-sm text-gray-500">{{ t('Price') }}</span>
                <span v-if="item.total" class="text-lg font-bold">{{
                  formatCurrency(item.total)
                }}</span>
              </div>
            </div>
          </template>
        </UButton>
      </template>
      <template #item="{ item }">
        <div class="italic text-gray-900 dark:text-white p-4">
          <span class="font-semibold">{{ t('Details') }}</span>
          <ul>
            <BillItemDetails v-for="i in item.items" :key="i.id" :bill-item="i" />
          </ul>
        </div>
      </template>
    </UAccordion>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from "~/utils/formatters";
import BillItemDetails from "./BillItemDetails.vue";
import type { CourseSubscriptionBillItemView } from "~/types/app.types";

type Props = {
  billId: string;
};

const props = defineProps<Props>();
const client = useSupabaseClient();

const { t } = useI18n({ useScope: "local" });

const {
  data: bill_items_grouped,
} = await useAsyncData(
  `${props.billId}_billing_list`,
  async () => {
    // Bill items grouped by activity
    const { data, error } = await client
      .from("course_subscription_bill_items_view")
      .select("*")
      .eq("bill_id", props.billId).overrideTypes<CourseSubscriptionBillItemView[]>();

    if (error) {
      console.error(error);
      throw error;
    }
    return data;
  },
  {
    transform: (data) => {
      return data.map((activity) => {
        const group =  {
          label: activity.activity_name,
          total: activity.total,
          items: activity.items,
        };
        return group;
      });
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
