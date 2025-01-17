<template>
  <div>
    <UAccordion
      v-if="bill_items"
      :items="bill_items"
      :ui="{ wrapper: 'flex flex-col w-full' }"
    >
      <template #default="{ item }">
        <UButton
          color="gray"
          variant="ghost"
          class="border-t border-gray-200 dark:border-gray-800 justify-between"
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
            <BillAttendanceDetailsItem v-for="i in item.items" :key="i.id" :attendance-id="i.course_activity_attendance_id" :activity-price="i.price" />
          </ul>
        </div>
      </template>
    </UAccordion>
  </div>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import { formatCurrency } from "~/utils/formatters";
import BillAttendanceDetailsItem from "./BillAttendanceDetailsItem.vue";

type Props = {
  billId: string;
};

const props = defineProps<Props>();
const client = useSupabaseClient<Database>();

const { t } = useI18n({ useScope: "local" });

const {
  data: bill_items,
} = await useAsyncData(
  `${props.billId}_billing_list`,
  async () => {
    const { data, error } = await client
      .from("course_subscription_bill_items_view")
      .select("*")
      .eq("bill_id", props.billId);

    if (error) {
      console.error(error);
      throw error;
    }
    return data;
  },
  {
    transform: (data) => {
      return data.map((item) => {
        return {
          label: item.activity_name ?? "",
          total: item.total,
          items: item.items,
        };
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
