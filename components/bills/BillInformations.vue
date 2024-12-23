<template>
  <UDashboardSection
    title="Bill Information"
    description="Bill information"
    orientation="vertical"
    v-if="courseSubscription"
  >
  <template #links>
    <UBadge v-if="bill.paid_at" color="green" label="Paid" />
    <UBadge v-else color="yellow" label="Not paid" />
  </template>
    <div class="flex flex-col gap-2 ">
      <div class="flex flex-col flex-1 items-start">
        <span class="text-sm text-gray-500">Course</span>
        <span class="text-lg font-bold">{{ course.name }}</span>
      </div>
      <div class="flex flex-col flex-1 items-start">
        <span class="text-sm text-gray-500">Subscribed on</span>
        <span class="text-lg font-bold">{{ formatDate(subscription.inserted_at) }}</span>
      </div>
    </div>
  </UDashboardSection>
  <UDivider label="History" />
  <BillHistory :bill_id="bill.id" :bill_created_at="bill.created_at"></BillHistory>
</template>

<script setup lang="ts">
import type { AppCourse, AppCourseSubscription, AppCourseSubscriptionBill, AppStudent } from '~/types/app.types';
import { formatDate } from '~/utils/formatters';
import BillHistory from './BillHistory.vue';


type Props = {
    bill: AppCourseSubscriptionBill;
    course: AppCourse;
    student: AppStudent;
    subscription: AppCourseSubscription;
}

const props = defineProps<Props>();

const courseSubscription = await useCourseSubscription(props.bill.course_subscription_id);



</script>

<style scoped></style>
