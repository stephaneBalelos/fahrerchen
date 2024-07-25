<template>
  <UDashboardCard
    :title="'Rechnung'"
    :description="bill?.id"
    class="h-full"
  >
  <template #links>
      <UBadge v-if="bill?.paid_at" color="primary" variant="solid">Bezahlt am {{ new Date(bill.paid_at).toLocaleDateString('de') }}</UBadge>
      <UBadge v-else color="red" variant="solid">Unbezahlt</UBadge>
  </template>
  <div
          v-for="item in bill?.items"
          class="flex items-center justify-between pt-4 first:pt-0 gap-2 h-full"
        >
          <div class="flex flex-col gap-1 grow">
            <p class="font-semibold">{{ item.description }}</p>
            <div class="flex justify-start gap-1">
                {{ item.amount }} *
              <UBadge color="primary" variant="subtle" size="xs"
                >{{ item.price }} &euro;</UBadge
              >
            </div>
          </div>
          <div class="font-semibold text-xl" >
            {{ item.total }}
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between align-items-end">
            <p class="font-semibold">Total</p>
            <p class="font-semibold text-2xl">{{ bill?.total }}</p>
          </div>
        </template>
  </UDashboardCard>
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';

type Props = {
  bill_id: any;
};

const props = defineProps<Props>();
const client = useSupabaseClient<Database>();


const { data:bill, error, status, refresh } = await useAsyncData(
  `${props.bill_id}_billing_list`,
  async () => {
    const { data, error } = await client
      .from('course_subscription_bills')
      .select('*, course_subscription_bill_items(*)')
      .eq('id', props.bill_id).single();

      if (error) {
        console.error(error);
        throw error;
      }

      console.log(data);

    return data;
  }, {
    transform: (data) => {
      const items = data.course_subscription_bill_items.map((item) => {
        return {
          ...item,
          total: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.total ?? 0),
        }
      });
      return {
        ...data,
        total: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(data.total ?? 0),
        items: items,
      };
    }
  }
);


</script>

<style scoped></style>
