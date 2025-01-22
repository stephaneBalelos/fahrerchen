<template>
  <UContainer class="w-full">
    <UDashboardSection
      icon="i-heroicons-document-text"
      :title="t('bill_id', { id: bill?.id })"
      :description="t('bill_description')"
      class="px-4 mt-6"
    >
      <template #links>
        <UBadge v-if="bill?.paid_at" color="green" variant="solid">{{
          t("paid_at", { date: formatDateTime(bill.paid_at) })
        }}</UBadge>
        <UBadge v-else-if="bill?.canceled_at" color="red" variant="solid">{{
          t("canceled", { date: formatDate(bill.canceled_at) })
        }}</UBadge>
        <UBadge v-else color="orange" variant="solid">{{
          t("not_paid")
        }}</UBadge>
      </template>
      <div v-if="bill" class="border-none">
        <BillsBillingList :bill-id="bill_id" />
        <div class="flex flex-col items-end justify-end py-4">
          <span
            class="text-sm font-semibold text-gray-500 dark:text-gray-400"
            >{{ t("total") }}</span
          >
          <span v-if="bill?.total" class="text-lg font-bold">{{
            formatCurrency(bill.total)
          }}</span>
        </div>
        <div
          v-if="
            stripeStore.stripeAppSettings && !bill.paid_at && !bill.canceled_at
          "
          class="py-4"
        >
          <UButton
            v-if="bill?.ready_to_pay && !bill.paid_at"
            color="primary"
            :label="`${t('pay_now')}`"
            @click="openCheckoutModal"
          />
        </div>
      </div>
    </UDashboardSection>
  </UContainer>
</template>

<script setup lang="ts">
import BillCheckoutModal from "~/components/students/BillCheckoutModal.vue";
import type { Database } from "~/types/app.types";
import { formatDateTime, formatCurrency, formatDate } from "~/utils/formatters";

const route = useRoute();
const bill_id = route.params.id as string;
const modal = useModal();
const stripeStore = useStripeStore();

const client = useSupabaseClient<Database>();

const { t } = useI18n({
  useScope: "local",
});

const { data: bill, error } = useAsyncData(`bills/${bill_id}`, async () => {
  const { data, error } = await client
    .from("course_subscription_bills")
    .select("*")
    .eq("id", bill_id)
    .single();
  if (error) {
    throw error;
  }
  return data;
});

if (error.value) {
  console.error(error.value);
  throw createError({
    statusCode: 404,
    message: "Bill not found",
  });
}

async function openCheckoutModal() {
  modal.open(BillCheckoutModal, {
    billId: bill_id,
    onClose: () => {
      modal.close();
    },
  });
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "bill_id": "Rechnung #{id}",
    "bill_description": "Details zur Rechnung",
    "paid_at": "Bezahlt am {date}",
    "ready_to_pay": "Zahlungsbereit",
    "canceled": "Storniert am {date}",
    "not_paid": "Nicht bezahlt",
    "pay_now": "Jetzt bezahlen",
    "total": "Gesamt"
  },
  "en": {
    "bill_id": "Bill {id}",
    "bill_description": "Details of the bill",
    "paid_at": "Paid at {date}",
    "ready_to_pay": "Ready to pay",
    "canceled": "Canceled at {date}",
    "not_paid": "Not paid",
    "pay_now": "Pay now",
    "total": "Total"
  }
}
</i18n>
