<template>
  <UDashboardSection
    icon="i-heroicons-document-text"
    :title="t('your_bills')"
    :description="t('your_bills_description')"
    orientation="vertical"
    class="px-4 mt-6"
  >
    <div v-if="bills" class="grid grid-cols-1 gap-2">
      <UDashboardCard
        v-if="bills.length > 0"
        v-for="bill in bills"
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
            <span class="text-lg font-bold" v-if="bill.total">{{
              formatCurrency(bill.total)
            }}</span>
            <UButton
              icon="i-heroicons-arrow-right"
              size="sm"
              color="gray"
              square
              :to="`/students/${bill.organization_id}/bills/${bill.id}`"
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

const props = defineProps<Props>();

const studentStore = useStudentStore();
const client = useSupabaseClient<Database>();

const { t } = useI18n({
  useScope: "local",
});

const {
  data: bills,
  error,
  status,
} = useAsyncData(``, async () => {
  if (!studentStore.subscription) return null;
  const { data, error } = await client
    .from("course_subscription_bills")
    .select("id, created_at, total, organization_id, paid_at, ready_to_pay")
    .eq("course_subscription_id", props.subscription_id);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "your_bills": "Deine Rechnungen",
    "your_bills_description": "Hier findest du alle Rechnungen, die du bisher erhalten hast.",
    "bill": "Rechnung vom {date}",
    "show": "Anzeigen",
    "paid_at": "Bezahlt am {date}",
    "ready_to_pay": "Zahlungsbereit",
    "not_paid": "Noch offen"
  },
  "en": {
    "your_bills": "Your bills",
    "your_bills_description": "Here you can find all the bills you have received so far.",
    "bill": "Bill from {date}",
    "show": "Show",
    "paid_at": "Paid at {date}",
    "ready_to_pay": "Ready to pay",
    "not_paid": "Not paid yet"
  }
}
</i18n>
