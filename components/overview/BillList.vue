<template>
  <UDashboardCard
    :title="t('open_bills')"
    :description="t('open_bills_description')"
    icon="i-heroicons-document-currency-euro"
  >
    <template #links>
      <UButton
        color="gray"
        variant="solid"
        :to="`/my/${userOrganizationsStore.selectedOrganization?.organization_id}/bills`"
      >
        {{ t("view_all") }}
      </UButton>
    </template>
    <div v-if="bills && bills.length > 0">
      <NuxtLink
        v-for="(bill, index) in bills"
        :key="index"
        class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
        :to="`/my/${userOrganizationsStore.selectedOrganization?.organization_id}/bills/${bill.id}`"
      >
        <div class="text-sm flex-1">
          <div>
            <p class="text-gray-900 dark:text-white font-medium">
              {{ bill.sub?.student?.firstname }}
              {{ bill.sub?.student?.lastname }} | {{ bill.sub?.course?.name }}

              <UBadge
                v-if="bill.ready_to_pay"
                color="primary"
                variant="soft"
                :label="t('ready_to_pay')"
              />
            </p>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              {{ t("created_at") }} {{ formatDate(bill.created_at) }}
            </p>
          </div>
        </div>
        <p class="text-gray-900 dark:text-white font-medium text-lg">
          {{ formatCurrency(bill.total) }}
          <!-- <UBadge v-if="bill.status == 'PLANNED'" color="primary" variant="soft">Planned</UBadge>
            <UBadge v-if="bill.status == 'CANCELED'" color="red" variant="soft">Canceled</UBadge>
            <UBadge v-if="bill.status == 'COMPLETED'" color="red" variant="soft">Completed</UBadge> -->
        </p>
      </NuxtLink>
    </div>
    <div v-else class="min-h-96 flex flex-col items-center justify-center">
      <UIcon name="i-heroicons-circle-stack" class="w-5 h-5" />
      <p class="text-gray-500 dark:text-gray-400">
        {{ t("no_bills") }}
      </p>
    </div>
  </UDashboardCard>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import { formatCurrency, formatDate } from "~/utils/formatters";

const { t } = useI18n({
  useScope: "local",
});

const client = useSupabaseClient<Database>();
const userOrganizationsStore = useUserOrganizationsStore();

const { data: bills } = useAsyncData(async () => {
  if (!userOrganizationsStore.selectedOrganization) {
    throw new Error("No active organization");
  }
  const { data, error } = await client
    .from("course_subscription_bills")
    .select(
      "*, sub:course_subscriptions(*, course:courses(*), student:students(firstname, lastname))"
    )
    .is("paid_at", null)
    .eq(
      "organization_id",
      userOrganizationsStore.selectedOrganization.organization_id
    )
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "open_bills": "Offene Rechnungen",
    "open_bills_description": "Rechnungen, die noch nicht bezahlt wurden",
    "no_bills": "Keine offenen Rechnungen",
    "created_at": "Erstellt am",
    "view_all": "Alle anzeigen",
    "ready_to_pay": "Zahlungsbereit"
  },
  "en": {
    "open_bills": "Open Bills",
    "open_bills_description": "Bills that have not been paid yet",
    "no_bills": "No open bills",
    "created_at": "Created at",
    "view_all": "View all",
    "ready_to_pay": "Ready to pay"
  }
}
</i18n>
