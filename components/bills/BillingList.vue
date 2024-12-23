<template>
  <div>
    <UAccordion
      v-if="bill_items"
      :items="bill_items"
      :ui="{ wrapper: 'flex flex-col w-full' }"
    >
      <template #default="{ item, index, open }">
        <UButton
          color="gray"
          variant="ghost"
          class="border-t border-gray-200 dark:border-gray-800 justify-between"
          :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
        >
          <div class="flex flex-col items-start">
            <span class="text-sm text-gray-500">Label</span>
            <span class="text-lg font-bold">{{ item.label }}</span>
          </div>

          <template #trailing>
            <div class="flex items-center gap-8">
              <div class="flex flex-col flex-1 items-end">
                <span class="text-sm text-gray-500">Amount</span>
                <span class="text-lg font-bold">{{ item.items?.length }}</span>
              </div>
              <div class="flex flex-col flex-1 items-end">
                <span class="text-sm text-gray-500">Price</span>
                <span class="text-lg font-bold" v-if="item.total">{{
                  formatCurrency(item.total)
                }}</span>
              </div>
            </div>
          </template>
        </UButton>
      </template>
      <template #item="{ item }">
        <div class="italic text-gray-900 dark:text-white p-4">
          <span class="font-semibold">Details</span>
          <ul>
            <li v-for="i in item.items" :key="i.id">
              {{ i.description }} - {{ formatCurrency(i.price) }} || attendance id: {{ i.course_activity_attendance_id }}
            </li>
          </ul>
        </div>
      </template>
    </UAccordion>
  </div>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import { formatCurrency } from "~/utils/formatters";

type Props = {
  bill_id: any;
};

const props = defineProps<Props>();
const client = useSupabaseClient<Database>();

const {
  data: bill_items,
  error,
  status,
  refresh,
} = await useAsyncData(
  `${props.bill_id}_billing_list`,
  async () => {
    const { data, error } = await client
      .from("course_subscription_bill_items_view")
      .select("*")
      .eq("bill_id", props.bill_id);

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
