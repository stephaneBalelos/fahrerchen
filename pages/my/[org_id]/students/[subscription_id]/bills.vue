<template>
  <div class="flex flex-col flex-1 overflow-y-auto">
    <UDashboardToolbar>
      <UHorizontalNavigation :links="tabs" />
    </UDashboardToolbar>
    <UDashboardPanelContent>
      <StudentSubscriptionSettlement
        v-if="currentTab === 'current_settlement'"
        :subscription-id="subscription_id"
        :org-id="org_id"
        @refresh="refresh"
      />
      <UDashboardSection
        icon="i-heroicons-document-text"
        :title="t('bills')"
        :description="t('bills_description')"
        orientation="vertical"
      >
        <div v-if="bills && bills.length > 0" class="grid grid-cols-1 gap-2">
          <UDashboardCard
            v-for="bill in bills"
            :key="bill.id"
            :description="bill.id"
          >
            <template #title>
              <div class="flex gap-2">
                <p>
                  {{ t("bill", { date: formatDateTime(bill.created_at) }) }}
                </p>
                <UBadge v-if="bill.paid_at" size="xs" color="green">{{
                  t("paid_at", { date: formatDateTime(bill.paid_at) })
                }}</UBadge>
                <UBadge v-else-if="bill.canceled_at" size="xs" color="red">{{
                  t("cancelled_at", { date: formatDateTime(bill.canceled_at) })
                }}</UBadge>
                <UBadge v-else size="xs" color="orange">{{
                  t("not_paid")
                }}</UBadge>
              </div>
            </template>
            <template #links>
              <div class="flex items-center gap-4">
                <span v-if="bill.total_with_vat" class="text-lg font-bold">{{
                  formatCurrency(bill.total_with_vat)
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
        <div v-else>
          <UAlert
            color="primary"
            variant="outline"
            :title="t('no_bills')"
            :description="t('no_bills_description')"
          />
        </div>
      </UDashboardSection>
    </UDashboardPanelContent>
  </div>
</template>

<script setup lang="ts">
import StudentSubscriptionSettlement from "~/components/students/StudentSubscriptionSettlement.vue";
import { formatDateTime, formatCurrency } from "~/utils/formatters";

const route = useRoute();
const subscription_id = route.params.id as string;
const org_id = route.params.org_id as string;

const client = useSupabaseClient();

const currentTab = ref("current_settlement");

const { t } = useI18n({
  useScope: "local",
});

const tabs = computed(() => {
  return [
    {
      label: t("current_settlement"),
      icon: "i-heroicons-currency-euro",
      active: currentTab.value === "current_settlement",
      click: () => {
        currentTab.value = "current_settlement";
      },
    },
    {
      label: t("all_bills"),
      icon: "i-heroicons-document-text",
      active: currentTab.value === "bills",
      click: () => {
        currentTab.value = "bills";
      },
    },
  ];
});

const { data: bills, refresh } = useAsyncData(``, async () => {
  const { data, error } = await client
    .from("course_subscription_bills")
    .select(
      "id, created_at, total, total_with_vat, organization_id, paid_at, ready_to_pay, canceled_at"
    )
    .eq("course_subscription_id", subscription_id)
    .order("created_at", { ascending: false });

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
    "current_settlement": "Aktuelle Abrechnung",
    "all_bills": "Alle Rechnungen",
    "bills": "Rechnungen",
    "bills_description": "Hier findest du alle Rechnungen, die für diesen Schüler erstellt wurden.",
    "bill": "Rechnung vom {date}",
    "paid_at": "Bezahlt am {date}",
    "ready_to_pay": "Zahlungsbereit",
    "cancelled_at": "Storniert am {date}",
    "not_paid": "Nicht bezahlt",
    "no_bills": "Keine Rechnungen",
    "no_bills_description": "Es wurden noch keine Rechnungen für diesen Einschreibung erstellt."
  },
  "en": {
    "current_settlement": "Current Settlement",
    "all_bills": "All Bills",
    "bills": "Bills",
    "bills_description": "Here you can find all bills that have been created for this student.",
    "bill": "Bill from {date}",
    "paid_at": "Paid at {date}",
    "ready_to_pay": "Ready to pay",
    "cancelled_at": "Cancelled at {date}",
    "not_paid": "Not paid",
    "no_bills": "No bills",
    "no_bills_description": "No bills have been created for this subscription yet."
  }
}
</i18n>
