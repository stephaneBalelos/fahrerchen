<template>
  <UDashboardSection
    icon="i-heroicons-document-text"
    :title="t('settlements')"
    :description="t('settlements_description')"
    orientation="vertical"
    class="px-4 mt-6 mb-8"
  >
    <template #links>
      <div class="flex flex-col px-4">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ t("settlement_total") }}
        </div>
        <div class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {{ formatCurrency(settlement_total) }}
        </div>
      </div>
      <UButton v-if="permissionsStore.hasPermission('course_subscription_bills.create')" color="primary" variant="soft" @click="generateBill">
        <span>{{ t("create_bill") }}</span>
      </UButton>
    </template>
    <div
      v-if="bill_items && status === 'success'"
      class="grid grid-cols-1 gap-2"
    >
      <div v-if="bill_items.length > 0">
        <UDashboardCard v-for="bill_item in bill_items" :key="bill_item.id">
          <template #title>
            <div class="flex gap-2 items-center">
              <p class="font-semibold">{{ bill_item.description }}</p>
            </div>
          </template>
          <template #description>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{
                t("bill_created_at", {
                  date: formatDateTime(bill_item.inserted_at),
                })
              }}
            </p>
          </template>
          <template #links>
            <div class="flex items-center gap-4">
              <span class="text-lg font-bold">{{
                formatCurrency(bill_item.price)
              }}</span>
              <UButton
                icon="i-heroicons-trash"
                size="sm"
                color="gray"
                square
                @click="deleteItem(bill_item.id)"
              />
            </div>
          </template>
        </UDashboardCard>
      </div>
      <div v-else>
        <UAlert
          color="primary"
          variant="outline"
          :title="t('no_bills_items')"
          :description="t('no_bills_items_description')"
        />
      </div>
    </div>
    <div v-else-if="status === 'pending'">
      <div>
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-1/2" />
      </div>
    </div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import { formatDateTime, formatCurrency } from "~/utils/formatters";

type Props = {
  subscriptionId: string;
  orgId: string;
};

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();
const $emit = defineEmits(["refresh"]);
const client = useSupabaseClient<Database>();
const toast = useToast();
const isGeneratingBill = ref(false);

const permissionsStore = useUserPermissionsStore();

const {
  data: bill_items,
  status,
  refresh,
} = useAsyncData(async () => {
  const { data, error } = await client
    .from("course_subscription_bill_items")
    .select()
    .eq("course_subscription_id", props.subscriptionId)
    .is("bill_id", null);

  if (error) {
    throw error;
  }

  return data;
});

async function deleteItem(bill_id: string) {
  try {
    console.log(bill_id);
  } catch (error) {
    console.error(error);
  } finally {
    refresh();
  }
}

const settlement_total = computed(() => {
  if (bill_items.value) {
    return bill_items.value.reduce((acc, item) => acc + item.price, 0);
  }
  return 0;
});

async function generateBill() {
  try {
    isGeneratingBill.value = true;
    await client.rpc("generate_bill_for_subscription", {
      subscription_id: props.subscriptionId,
      organization_id: props.orgId,
    });
    toast.add({
      title: t("bill_generated"),
      description: t("bill_generated_description"),
      color: "green",
    });
    $emit("refresh");
  } catch (error) {
    console.error(error);
    toast.add({
      title: t("bill_not_generated"),
      description: t("bill_not_generated_description"),
      color: "red",
    });
  } finally {
    isGeneratingBill.value = false;
    refresh();
  }
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "settlements": "aktueller Abrechnungszeitraum",
    "settlements_description": "Hier siehst du alle Kosten, die noch nicht abgerechnet wurden.",
    "bill_created_at": "Erstellt am {date}",
    "settlement_total": "Abrechnungssumme",
    "create_bill": "Rechnung jetzt erstellen",
    "no_bills_items": "Keine Rechnungspositionen",
    "no_bills_items_description": "Es wurden noch keine Rechnungspositionen für diesen Abrechnungszeitraum erstellt."
  },
  "en": {
    "settlements": "Current settlement period",
    "settlements_description": "Here you can see all costs that have not yet been settled.",
    "bill_created_at": "Created at {date}",
    "settlement_total": "Settlement total",
    "create_bill": "Create bill now",
    "no_bills_items": "No bill items",
    "no_bills_items_description": "No bill items have been created for this settlement period yet."
  }
}
</i18n>
