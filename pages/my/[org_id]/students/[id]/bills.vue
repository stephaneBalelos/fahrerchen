<template>
  <UDashboardSection
    icon="i-heroicons-document-text"
    :title="t('bills')"
    :description="t('bills_description')"
    orientation="vertical"
    class="px-4 mt-6"
  >
    <div v-if="bills" class="grid grid-cols-1 gap-2">
      <UDashboardCard
        v-for="bill in bills"
        :key="bill.id"
        :description="bill.id"
      >
        <template #title>
          <div class="flex gap-2">
            <p>{{ t("bill", { date: formatDateTime(bill.created_at) }) }}</p>
            <UBadge v-if="bill.paid_at" size="xs" color="green">{{
              t("paid_at", { date: formatDateTime(bill.paid_at) })
            }}</UBadge>
            <UBadge v-else-if="bill.ready_to_pay" size="xs" color="primary">{{
              t("ready_to_pay")
            }}</UBadge>
            <UBadge v-else size="xs" color="orange">{{ t("not_paid") }}</UBadge>
          </div>
        </template>
        <template #links>
          <div class="flex items-center gap-4">
            <span v-if="bill.total" class="text-lg font-bold">{{
              formatCurrency(bill.total)
            }}</span>
            <UButton
              icon="i-heroicons-arrow-right"
              size="sm"
              color="gray"
              square
              :to="`/my/${bill.organization_id}/bills/${bill.id}`"
            />
          </div>
        </template>
      </UDashboardCard>
    </div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';
import { formatDateTime, formatCurrency } from '~/utils/formatters';

type Props = {
  subscription_id: string;
};

const { subscription_id } = useAttrs() as Props;

const client = useSupabaseClient<Database>();

const { t } = useI18n({
  useScope: "local",
});

const {
  data: bills,
} = useAsyncData(``, async () => {
  const { data, error } = await client
    .from("course_subscription_bills")
    .select("id, created_at, total, organization_id, paid_at, ready_to_pay")
    .eq("course_subscription_id", subscription_id);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
});
</script>

<style scoped>

</style>

<i18n lang="json">
{
    "de": {
        "bills": "Rechnungen",
        "bills_description": "Hier findest du alle Rechnungen, die für diesen Schüler erstellt wurden.",
        "bill": "Rechnung vom {date}",
        "paid_at": "Bezahlt am {date}",
        "ready_to_pay": "Zahlungsbereit",
        "not_paid": "Nicht bezahlt"
    }
}
</i18n>