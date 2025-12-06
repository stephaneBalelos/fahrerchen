<template>
  <UCard
    :ui="{
      base: 'overflow-hidden',
      body: {
        padding: 'sm:p-0 py-0 px-0',
      },
    }"
  >
    <div
      v-if="activeCourses && activeCourses.length > 0"
      class="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-800"
    >
      <div v-for="course in activeCourses" :key="props.costId + course.id" class="flex items-center justify-between p-4">
        <p>{{ g(`course_types.${course.type}.name_full`) }}</p>
        <UToggle
          :model-value="course.has_combination"
          @change="handleChange(course.id, $event)"
        />
      </div>
    </div>
    <div v-else-if="activeCourses && activeCourses.length == 0">
      <UAlert
        :title="t('no_courses_assigned_to_activity')"
        :description="t('no_courses_assigned_to_activity_description')"
        variant="soft"
        color="amber"
      />
    </div>
    <div v-else-if="status == 'pending'" class="space-y-4">
      <USkeleton class="h-6 w-3/4" />
      <USkeleton class="h-6 w-full" />
      <USkeleton class="h-6 w-full" />
      <USkeleton class="h-6 w-full" />
    </div>
    <div v-else>
      <UAlert
        :title="t('error_loading_courses')"
        :description="t('error_loading_courses_description')"
        variant="soft"
        color="red"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
type Props = {
  organizationId: string;
  costId: string;
};

const props = defineProps<Props>();
const courseCostStore = useCourseCostsStore();
const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const { data: activeCourses, status, refresh } = await useAsyncData(
  `active_courses_with_cost_combinations_${props.costId}`,
  async () =>
    await courseCostStore.getActiveCoursesWithCostCombinations(
      props.organizationId,
      props.costId
    ), 
    {
      transform: (data) => {
        if (!data) return [];
        return data.map((course) => {
          return {
            has_combination: course.course_costs_combinations.some(cac => cac.course_id === course.id),
            ...course,
          }
        });
      }
    }
);

async function handleChange(courseId: string, value: boolean) {
  try {
    if (value) {
      await courseCostStore.addCostToCourse(
        props.costId,
        courseId
      );
    } else {
      await courseCostStore.removeCostFromCourse(
        props.costId,
        courseId
      );
    }
  } catch (error) {
    console.error("Error updating allowed courses:", error);
  } finally {
    refresh();
    courseCostStore.loadCourseCosts();
  }
} 
</script>

<style scoped></style>
