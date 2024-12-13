<template>
  <NuxtErrorBoundary>
    <div class="pt-4">
      <ul>
        <li v-for="item in history" :key="item.id" class="pb-2 text-gray-500">
            {{ t(`history_type_${item.activity}`, 
                {actor: `${item.actor}`, item: item.item_description }) 
            }} - {{ formatDate(item.inserted_at) }} 
        </li>
      </ul>
    </div>
    <template #error="{ error }">
      <UAlert
        icon="i-heroicons-command-line"
        color="red"
        variant="soft"
        title="Heads up!"
        description="You can add components to your app using the cli."
      />
    </template>
  </NuxtErrorBoundary>
</template>

<script setup lang="ts">
import { id } from "date-fns/locale";
import type { Database } from "~/types/app.types";
import { formatDate } from "~/utils/formatters";

type Props = {
  bill_id: string;
  bill_created_at: string;
};

const { t } = useI18n({ useScope: "local" });
const props = defineProps<Props>();
const client = useSupabaseClient<Database>();

const {
  data: history,
  error,
  status,
  refresh,
} = await useAsyncData(`bills_${props.bill_id}_history`, async () => {
  const { data, error } = await client
    .from("course_subscription_bills")
    .select("id, created_at, history:course_subscription_bill_history(*, actor:users(firstname, lastname))")
    .eq("id", props.bill_id).gt("history.inserted_at", props.bill_created_at).single();

  if (error) {
    console.error(error);
    throw error;
  }

  console.log(props.bill_id)

  console.log(data);

  return data;
}, {
    transform: (data) => {
        return data.history.map((item) => {
            return {
                id: item.id,
                activity: item.activity,
                actor: `${item.actor?.firstname} ${item.actor?.lastname}`,
                item_description: item.item_description,
                inserted_at: item.inserted_at,
            };
        });
    }
});

const items = ref([
  {
    id: 1,
    username: "John Doe",
    description: "Payment for course",
    inserted_at: "2021-10-10",
  },
  {
    id: 2,
    username: "Jane Doe",
    description: "Bill item added",
    inserted_at: "2021-10-11",
  },
]);
</script>

<style scoped></style>

<i18n lang="json">
{
    "de": {
        "history_type_ITEM_ADDED": "{actor} hat ein '{item}' zur Rechnung hinzugefügt",
        "history_type_ITEM_REMOVED": "{actor} hat ein '{item}' von der Rechnung entfernt",
        "history_type_ITEM_UPDATED": "{actor} hat ein '{item}' auf der Rechnung aktualisiert",
        "history_type_BILL_READY_TO_PAY": "{actor} hat die Rechnung für die Zahlung freigegeben",
        "history_type_BILL_PAID": "{actor} hat die Rechnung bezahlt"
    },
    "en": {
        "history_type_ITEM_ADDED": "{actor} added an '{item}' to the bill",
        "history_type_ITEM_REMOVED": "{actor} removed an '{item}' from the bill",
        "history_type_ITEM_UPDATED": "{actor} updated an '{item}' on the bill",
        "history_type_BILL_READY_TO_PAY": "{actor} marked the bill as ready to pay",
        "history_type_BILL_PAID": "{actor} paid the bill"
    }
}
</i18n>
