<template>
  <UDashboardModal
    :title="t('archive_subscription_label')"
    :description="t('archive_subscription_description')"
    icon="i-heroicons-exclamation-circle"
    :ui="{
      icon: { base: 'text-red-500 dark:text-red-400' } as any,
      footer: { base: 'ml-16' } as any
    }"
  >
    <div v-if="loading" class="flex flex-col gap-2">
      <USkeleton class="h-6 w-full" />
      <USkeleton class="h-6 w-full" />
      <USkeleton class="h-6 w-full" />
    </div>
    <div v-else class="flex flex-col gap-2">
      <UAlert
        v-if="!canArchiveSubscription"
        :title="t('archive_subscription_warning')"
        color="red"
        variant="soft"
      >
        <template #description>
            <ul class="list-disc pl-5">
              <li v-if="subscriptionActiveSchedules.length > 0">
                {{
                  t("archive_warning.active_schedules_count", {
                    count: subscriptionActiveSchedules.length,
                  })
                }}
              </li>
              <li v-if="subscriptionActiveBillItems.length > 0">
                {{
                  t("archive_warning.active_bill_items_count", {
                    count: subscriptionActiveBillItems.length,
                  })
                }}
              </li>
              <li v-if="subscriptionUnpaidBills.length > 0">
                {{
                  t("archive_warning.unpaid_bills_count", {
                    count: subscriptionUnpaidBills.length,
                  })
                }}
              </li>
            </ul>
        </template>
      </UAlert>
    </div>
    <template #footer>
      <div class="flex justify-end w-full">
          <UButton
            v-if="canArchiveSubscription"
            color="red"
            :label="t('archive_subscription')"
            :loading="loading"
            @click="confirmArchive"
          />
          <UButton
            color="white"
            :label="t('cancel')"
            @click="() => modal.close()"
          />
      </div>
    </template>
  </UDashboardModal>
</template>

<script setup lang="ts">
type Props = {
  subscriptionId: string;
};

const { t } = useI18n({
  useScope: "local",
});
// const { t: g } = useI18n({
//   useScope: "global",
// })
const loading = ref(true);
const isArchiving = ref(false);
const modal = useModal();
const props = defineProps<Props>();
const client = useSupabaseClient();
const toast = useToast();
const $emits = defineEmits<{
  (e: "archived", subscriptionId: string): void;
}>();

const subscriptionActiveSchedules = ref<
  {
    id: string;
    status: string;
  }[]
>([]);
const subscriptionActiveBillItems = ref<{ id: string }[]>([]);
const subscriptionUnpaidBills = ref<{ id: string }[]>([]);

const canArchiveSubscription = computed(() => {
  return (
    subscriptionActiveSchedules.value.length === 0 &&
    subscriptionActiveBillItems.value.length === 0 &&
    subscriptionUnpaidBills.value.length === 0
  );
});

async function loadActiveSchedulesForSubscription() {
  const { data, error } = await client
    .from("course_activity_schedules")
    .select("id, status")
    .contains("attendees", [props.subscriptionId])
    .eq("status", "PLANNED");

  if (error) {
    throw new Error(`Failed to load active schedules: ${error.message}`);
  }
  return data || [];
}

async function loadActiveBillItemsForSubscription() {
  const { data, error } = await client
    .from("course_subscription_bill_items")
    .select("id")
    .eq("course_subscription_id", props.subscriptionId)
    .is("bill_id", null);

  if (error) {
    throw new Error(`Failed to load active bill items: ${error.message}`);
  }
  return data || [];
}

async function loadUnpaidBillsForSubscription() {
  const { data, error } = await client
    .from("course_subscription_bills")
    .select("id")
    .eq("course_subscription_id", props.subscriptionId)
    .is("paid_at", null);

  if (error) {
    throw new Error(`Failed to load unpaid bills: ${error.message}`);
  }
  return data || [];
}

onMounted(async () => {
  try {
    loading.value = true;
    subscriptionActiveSchedules.value =
      await loadActiveSchedulesForSubscription();
    subscriptionActiveBillItems.value =
      await loadActiveBillItemsForSubscription();
    subscriptionUnpaidBills.value = await loadUnpaidBillsForSubscription();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

async function confirmArchive() {
  try {
    isArchiving.value = true;
    const { error } = await client
      .from("course_subscriptions")
      .update({
        archived_at: new Date().toISOString(),
      })
      .eq("id", props.subscriptionId);
    if (error) {
      console.error(error);
      throw error;
    } else {
      modal.close();
      $emits("archived", props.subscriptionId);
    }
  } catch (error) {
    console.error(error);
    toast.add({
      title: t("error"),
      description: t("an_error_occurred"),
      color: "red",
    });
  } finally {
    isArchiving.value = false;
  }
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "archive_subscription_label": "Einschreibung archivieren",
    "archive_subscription_description": "Möchten Sie dieses Einschreibung wirklich archivieren? Alle aktiven Termine, Rechnungen und Abonnements werden archiviert und können nicht mehr bearbeitet werden.",
    "archive_subscription": "Einschreibung archivieren",
    "cancel": "Abbrechen",
    "subscription_archived": "Einschreibung archiviert",
    "subscription_archived_description": "Das Einschreibung wurde erfolgreich archiviert.",
    "error": "Fehler",
    "an_error_occurred": "Ein Fehler ist aufgetreten.",
    "archive_subscription_warning": "Die Einschreibung kann aus folgenden Gründen nicht archiviert werden:",
    "archive_warning": {
      "active_schedules_count": "Es gibt {count} aktive Termine für diese Einschreibung.",
      "active_bill_items_count": "Es gibt {count} aktive Rechnungspositionen für diese Einschreibung.",
      "unpaid_bills_count": "Es gibt {count} unbezahlte Rechnungen für diese Einschreibung."
    }
  },
  "en": {
    "archive_subscription_label": "Archive Subscription",
    "archive_subscription_description": "Do you really want to archive this subscription? All active schedules, bills, and subscriptions will be archived and cannot be edited anymore.",
    "archive_subscription": "Archive Subscription",
    "cancel": "Cancel",
    "subscription_archived": "Subscription Archived",
    "subscription_archived_description": "The subscription has been successfully archived.",
    "error": "Error",
    "an_error_occurred": "An error occurred.",
    "archive_subscription_warning": "The subscription cannot be archived for the following reasons:",
    "archive_warning": {
      "active_schedules_count": "There are {count} active schedules for this subscription.",
      "active_bill_items_count": "There are {count} active bill items for this subscription.",
      "unpaid_bills_count": "There are {count} unpaid bills for this subscription."
    }
  }
}
</i18n>
