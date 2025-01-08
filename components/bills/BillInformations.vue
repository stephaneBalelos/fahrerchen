<template>
  <UDashboardSection
    v-if="courseSubscription"
    :title="t('bill_information')"
    orientation="vertical"
  >
    <template #links>
      <UBadge v-if="bill.paid_at" color="green" :label="t('paid')" />
      <UBadge v-else color="yellow" :label="t('not_paid')" />
    </template>
    <div class="flex flex-col gap-2">
      <div class="flex flex-col flex-1 items-start">
        <span class="text-sm text-gray-500">{{ t('course') }}</span>
        <span class="text-lg font-bold">{{ course.name }}</span>
      </div>
      <div class="flex flex-col flex-1 items-start">
        <span class="text-sm text-gray-500">{{ t('subscribed_on') }}</span>
        <span class="text-lg font-bold">{{
          formatDate(subscription.inserted_at)
        }}</span>
      </div>
    </div>
  </UDashboardSection>
  <UDivider :label="t('history')" />
  <div class="relative h-full">
    <BillHistory :bill-id="bill.id" :bill-created-at="bill.created_at" />
  </div>
</template>

<script setup lang="ts">
import type {
  AppCourse,
  AppCourseSubscription,
  AppCourseSubscriptionBill,
  AppStudent,
} from "~/types/app.types";
import { formatDate } from "~/utils/formatters";
import BillHistory from "./BillHistory.vue";

type Props = {
  bill: AppCourseSubscriptionBill;
  course: AppCourse;
  student: AppStudent;
  subscription: AppCourseSubscription;
};

const props = defineProps<Props>();

const { t } = useI18n({ useScope: "local" });

const courseSubscription = await useCourseSubscription(
  props.bill.course_subscription_id
);
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "bill_information": "Rechnungsinformationen",
    "bill_information_description": "Rechnungsinformationen",
    "course": "Kurs",
    "subscribed_on": "Einschreibung am",
    "history": "Verlauf",
    "paid": "Bezahlt",
    "not_paid": "Nicht bezahlt"
  },
  "en": {
    "bill_information": "Bill Information",
    "bill_information_description": "Bill information",
    "course": "Course",
    "subscribed_on": "Subscribed on",
    "history": "History",
    "paid": "Paid",
    "not_paid": "Not paid"
  }
}
</i18n>
