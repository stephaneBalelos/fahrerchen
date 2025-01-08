<template>
  <NuxtErrorBoundary>
    <div class="pt-4 absolute w-full inset-0 overflow-y-auto">
      <ul>
        <li v-for="item in history" :key="item.id" class="pb-2 text-gray-500">
            {{ t(`history_type_${item.activity}`, 
                {actor: `${item.actor}`, item: item.item_description }) 
            }} - {{ formatDate(item.inserted_at) }} 
        </li>
        <li class="pb-2 text-gray-500">
            {{ t('bill_created') }} - {{ formatDate(props.billCreatedAt) }} 
        </li>
      </ul>
    </div>
    <template #error="">
      <UAlert
        icon="i-heroicons-command-line"
        color="red"
        variant="soft"
        :title="t('error')"
        :description="t('error_loading_data')"
      />
    </template>
  </NuxtErrorBoundary>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import { formatDate } from "~/utils/formatters";

type Props = {
  billId: string;
  billCreatedAt: string;
};

const { t } = useI18n({ useScope: "local" });
const props = defineProps<Props>();
const client = useSupabaseClient<Database>();

const {
  data: history,
} = await useAsyncData(`bills_${props.billId}_history`, async () => {
  const { data, error } = await client
    .from("course_subscription_bills")
    .select("id, created_at, history:course_subscription_bill_history(*, actor:users(firstname, lastname))")
    .eq("id", props.billId).gt("history.inserted_at", props.billCreatedAt).single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}, {
    transform: (data) => {
        return data.history.map((item) => {
            return {
                id: item.id,
                activity: item.activity,
                actor: item.actor ? `${item.actor?.firstname} ${item.actor?.lastname}` : t("system"),
                item_description: item.item_description,
                inserted_at: item.inserted_at,
            };
        }).sort((a, b) => new Date(b.inserted_at).getTime() - new Date(a.inserted_at).getTime());
    }
});
</script>

<style scoped></style>

<i18n lang="json">
{
    "de": {
        "history_type_ITEM_ADDED": "{actor} hat ein '{item}' zur Rechnung hinzugefügt",
        "history_type_ITEM_REMOVED": "{actor} hat ein '{item}' von der Rechnung entfernt",
        "history_type_ITEM_UPDATED": "{actor} hat ein '{item}' auf der Rechnung aktualisiert",
        "history_type_BILL_READY_TO_PAY": "{actor} hat die Rechnung für die Zahlung freigegeben",
        "history_type_BILL_PAID": "{actor} hat die Rechnung bezahlt",
        "bill_created": "Rechnung erstellt",
        "system": "System",
        "error": "Fehler",
        "error_loading_data": "Beim Laden der Daten ist ein Fehler aufgetreten"
    },
    "en": {
        "history_type_ITEM_ADDED": "{actor} added an '{item}' to the bill",
        "history_type_ITEM_REMOVED": "{actor} removed an '{item}' from the bill",
        "history_type_ITEM_UPDATED": "{actor} updated an '{item}' on the bill",
        "history_type_BILL_READY_TO_PAY": "{actor} marked the bill as ready to pay",
        "history_type_BILL_PAID": "{actor} paid the bill",
        "bill_created": "Bill created",
        "system": "System",
        "error": "Error",
        "error_loading_data": "An error occurred while loading the data"
    }
}
</i18n>
