<template>
  <div class="flex flex-col gap-2">
    <div>
      <p class="font-medium">{{ t("title") }}</p>
    </div>
    <div class="flex flex-col gap-2">
      <div
        v-for="(c, index) in courseCosts"
        :key="`${props.courseId}-${c.id}-${index}`"
        class="flex items-center w-full justify-between gap-6"
      >
        <div class="flex flex-col flex-1">
          <p class="font-medium">{{ c.name }}</p>
          <p class="text-sm text-gray-500">{{ c.description }}</p>
        </div>
        <p class="font-medium">{{ c.price === 0 ? t('free') : formatCurrency(c.price) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from "~/utils/formatters";

type Props = {
  courseId: string;
};

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();

const client = useSupabaseClient();
const courseCostsStore = useCourseCostsStore();

const { data } = useAsyncData(`course-costs-${props.courseId}`, async () => {
  const { data, error } = await client
    .from("course_costs_combinations")
    .select("*")
    .eq("course_id", props.courseId);
  if (error) {
    console.error("Error loading course costs:", error);
    return [];
  }
  return data || [];
});

const courseCosts = computed(() => {
  if (!data.value) {
    return [];
  }
  const costs = [];
  for (const d of data.value) {
    const cost = courseCostsStore.courseCosts.find((c) => c.id === d.cost_id);
    if (cost) {
      const c = {
        id: d.id,
        name: cost.name,
        description: cost.description,
        price: d.price !== null ? d.price : cost.price,
      };
      costs.push(c);
    }
  }
  return costs;
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "en": {
    "title": "Course Costs",
    "free": "Free"
  },
  "de": {
    "title": "Kurskosten",
    "free": "Kostenlos"
  }
}
</i18n>
