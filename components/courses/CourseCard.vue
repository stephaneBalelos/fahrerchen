<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center w-full">
        <div class="flex flex-col flex-1 items-start">
          <p class="font-medium">
            {{ g(`course_types.${props.course.type}.name_full`) }}
          </p>
          <!-- <p class="text-xs text-gray-500 truncate w-full">{{ g(`course_types.${d.type}.description`) }}</p> -->
        </div>
        <!-- <UButton
          color="white"
          size="xs"
          icon="i-heroicons-pencil"
          @click="() => {}"
          >{{ t("open_course") }}</UButton
        > -->
        <div class="flex items-center gap-2">
          <UBadge
            v-if="props.course.is_active"
            color="green"
            variant="soft"
            :label="t('active')"
          />
          <UBadge v-if="props.course.is_active" color="white">
            {{
              t("active_subscription_count", {
                count: subscriptionStore.subscriptions.filter(
                  (s) =>
                    s.course_id === props.course.id && s.archived_at === null
                ).length,
              })
            }}
          </UBadge>
          <UBadge v-else color="white">
            {{
              t("total_subscription_count", {
                count: subscriptionStore.subscriptions.filter(
                  (s) => s.course_id === props.course.id
                ).length,
              })
            }}
          </UBadge>
        </div>
      </div>
    </template>
    <div class="flex flex-col gap-8">
      <CourseCostsOverview :course-id="props.course.id" />
      <CourseActivitiesOverview :course-id="props.course.id" />
    </div>
    <template #footer>
      <div class="flex justify-end items-center gap-4">
        <div class="flex flex-col items-end">
          <p class="text-sm text-gray-500">
            {{ t("total_costs") }}
          </p>
          <p
            v-if="totalPriceData !== null && status === 'success'"
            class="font-medium"
          >
            {{ formatCurrency(totalPriceData) }} <span class="text-xs text-gray-500 ms-2">({{ t("without_vat") }})</span>
          </p>
          <USkeleton v-else-if="status === 'pending'" />
          <p v-else-if="error" class="font-medium">
            {{ error.message }}
          </p>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { AppCourse } from "~/types/app.types";
import { formatCurrency } from "~/utils/formatters";
import CourseActivitiesOverview from "~/components/courses/CourseActivitiesOverview.vue";
import CourseCostsOverview from "~/components/courses/CourseCostsOverview.vue";

type Props = {
  course: AppCourse;
};

const { t } = useI18n({
  useScope: "local",
});
const { t: g } = useI18n({
  useScope: "global",
});

const props = defineProps<Props>();
const subscriptionStore = useSubscriptionStore();
const client = useSupabaseClient();

const $fetchTotalPrice = async (courseId: string) => {
  const { data, error } = await client
    .from("courses")
    .select(
      "id, course_activities_combinations(price, required, course_activities(price, required)), course_costs_combinations (price, course_costs(price))"
    )
    .eq("id", courseId)
    .single();
  if (error) {
    console.error("Error fetching total price for course:", error);
    return 0;
  }
  if (!data) {
    return 0;
  }
  let total = 0;
  if (data.course_activities_combinations) {
    for (const a of data.course_activities_combinations) {
      total +=
        (a.price !== null ? a.price : a.course_activities.price) *
        (a.required !== null ? a.required : a.course_activities.required);
    }
  }
  if (data.course_costs_combinations) {
    for (const c of data.course_costs_combinations) {
      total += c.price !== null ? c.price : c.course_costs.price;
    }
  }
  return total;
};

const {
  data: totalPriceData,
  status,
  error,
} = await useAsyncData(`total-price-${props.course.id}`, async () => {
  return await $fetchTotalPrice(props.course.id);
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "open_course": "Kurs bearbeiten",
    "active": "Aktiv",
    "active_subscription_count": "{count} aktive Anmeldung(en)",
    "total_subscription_count": "{count} Anmeldung(en)",
    "total_costs": "Kurs gesamt ab",
    "without_vat": "zzgl. MwSt"
  },
  "en": {
    "open_course": "Edit course",
    "active": "Active",
    "active_subscription_count": "{count} active subscription(s)",
    "total_subscription_count": "{count} subscription(s)",
    "total_costs": "Course total from",
    "without_vat": "excl. VAT"
  }
}
</i18n>
