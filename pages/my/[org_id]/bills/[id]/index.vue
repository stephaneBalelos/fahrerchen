<template>
  <UDashboardPage>
    <UDashboardPanel v-if="bill" grow>
      <UDashboardNavbar>
        <template #left>
          <p class="font-semibold">
            {{ t("bill") }}
            <UButton
              icon="i-heroicons-clipboard"
              trailing
              size="xs"
              color="primary"
              :label="`#${bill.data.id}`"
              square
              variant="link"
              @click="copy(`${bill.data.id}`)"
            />
            <UBadge v-if="copied" color="primary" variant="soft">{{
              t("copied")
            }}</UBadge>
          </p>
        </template>
        <template #right>
          <UButton
            v-if="bill.subscription"
            :label="t('open_student_profile')"
            size="sm"
            color="gray"
            square
            @click="openStudentProfile"
          />
          <UButton
            v-if="bill.subscription"
            :label="t('manage_subscription')"
            size="sm"
            color="gray"
            square
            :to="`/my/${bill.subscription.organization_id}/students/${bill.subscription.student_id}`"
          />
        </template>
      </UDashboardNavbar>
      <div v-if="bill.data && bill.subscription" class="flex h-full">
        <UDashboardPanel :width="400" :resizable="{ min: 280, max: 400 }">
          <UDashboardPanelContent
            v-if="
              bill.subscription &&
              bill.subscription.student &&
              bill.subscription.course
            "
          >
            <BillInformations
              :bill="bill.data"
              :student="bill.subscription.student"
              :course="bill.subscription.course"
              :subscription="bill.subscription"
            />
          </UDashboardPanelContent>
        </UDashboardPanel>
        <UDashboardPanel grow>
          <div class="h-full">
            <div class="absolute inset-0 overflow-y-auto">
              <UDashboardSection
                :title="`${bill.subscription.student?.firstname} ${bill.subscription.student?.lastname}`"
                icon="i-heroicons-user"
                class="px-4 mt-6 pb-24"
                :ui="{ wrapper: 'divide-none' }"
              >
                <template #links>
                  <UButton
                    v-if="!bill.data.paid_at && bill.data.ready_to_pay"
                    color="green"
                    variant="solid"
                    size="xs"
                    @click="markAsPaid"
                  >
                    <span>{{ t("mark_as_paid") }}</span>
                  </UButton>
                  <UButton
                    v-if="!bill.data.ready_to_pay"
                    color="primary"
                    variant="soft"
                    @click="markAsReadyToPay"
                    >{{ t("mark_as_ready_to_pay") }}</UButton
                  >
                  <UButton
                    v-if="!bill.data.paid_at"
                    color="red"
                    variant="soft"
                    >{{ t("cancel_bill") }}</UButton
                  >
                </template>
                <template #description>
                  <div>
                    <p>{{ bill.subscription.student?.address_street }}</p>
                    <p>{{ bill.subscription.student?.address_zip }}</p>
                    <p>
                      {{ bill.subscription.student?.address_city }}
                      {{ bill.subscription.student?.address_country }}
                    </p>
                  </div>
                </template>
                <BillsBillingList :bill-id="bill.data.id" />
              </UDashboardSection>
            </div>
            <UDashboardToolbar
              class="absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-800 pb-8 pt-4 bg-white dark:bg-gray-900"
            >
              <template #right>
                <div class="flex flex-col flex-1 items-end">
                  <span class="text-sm text-gray-500">{{ t("total") }}</span>
                  <span class="text-xl font-bold">{{
                    formatCurrency(bill.data.total)
                  }}</span>
                </div>
              </template>
            </UDashboardToolbar>
          </div>
        </UDashboardPanel>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import BillInformations from "~/components/bills/BillInformations.vue";
import StudentCourseProfileSlideover from "~/components/courses/StudentCourseProfileSlideover.vue";
import type { Database } from "~/types/app.types";
import { formatCurrency } from "~/utils/formatters";

definePageMeta({
  layout: "orgs",
});

const { id } = useRoute().params;
const client = useSupabaseClient<Database>();
const toast = useToast();
const { t } = useI18n({ useScope: "local" });
const slideover = useSlideover();

const { data: bill, refresh } = useAsyncData(`bills_${id}`, async () => {
  const { data, error } = await client
    .from("course_subscription_bills")
    .select("*")
    .eq("id", id as string)
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  const subscription = await useCourseSubscription(data.course_subscription_id);

  return {
    data,
    subscription,
  };
});

const { copy, copied } = useClipboard();

function openStudentProfile() {
  if (
    bill.value &&
    bill.value.subscription &&
    bill.value.subscription.student
  ) {
    slideover.open(StudentCourseProfileSlideover, {
      subscriptionId: bill.value.subscription.id,
      student: bill.value.subscription.student,
    });
  }
}

async function markAsReadyToPay() {
  try {
    const { error } = await client
      .from("course_subscription_bills")
      .update({ ready_to_pay: true })
      .eq("id", id as string);

    if (error) {
      console.error(error);
      throw error;
    }
    toast.add({
      title: "Bill marked as ready to pay",
      description: "The bill has been marked as ready to pay",
      color: "green",
    });
    refresh();
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "An error occurred while marking the bill as ready to pay",
      color: "red",
    });
  }
}

async function markAsPaid() {
  try {
    const { error } = await client
      .from("course_subscription_bills")
      .update({ paid_at: new Date().toISOString() })
      .eq("id", id as string);

    if (error) {
      console.error(error);
      throw error;
    }
    toast.add({
      title: "Bill marked as paid",
      description: "The bill has been marked as paid",
      color: "green",
    });
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "An error occurred while marking the bill as paid",
      color: "red",
    });
  }
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "open_student_profile": "Schülerprofil öffnen",
    "manage_subscription": "Abonnement verwalten",
    "bill": "Rechnung",
    "bill_description": "Hier findest du alle Informationen zu dieser Rechnung.",
    "mark_as_paid": "Als bezahlt markieren",
    "mark_as_ready_to_pay": "Als zahlungsbereit markieren",
    "cancel_bill": "Rechnung stornieren",
    "total": "Gesamtsumme",
    "copied": "Kopiert!"
  },
  "en": {
    "open_student_profile": "Open student profile",
    "manage_subscription": "Manage subscription",
    "bill": "Bill",
    "bill_description": "Here you can find all information about this bill.",
    "mark_as_paid": "Mark as paid",
    "mark_as_ready_to_pay": "Mark as ready to pay",
    "cancel_bill": "Cancel bill",
    "total": "Total",
    "copied": "Copied!"
  }
}
</i18n>
