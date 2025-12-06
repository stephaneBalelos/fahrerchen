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
      v-if="activivesCourses && activivesCourses.length > 0"
      class="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-800"
    >
      <div v-for="course in activivesCourses" :key="props.activityId + course.id" class="flex items-center justify-between p-4">
        <p>{{ g(`course_types.${course.type}.name_full`) }}</p>
        <UToggle
          :model-value="course.has_combination"
          @change="handleChange(course.id, $event)"
        />
      </div>
    </div>
    <div v-else-if="activivesCourses && activivesCourses.length == 0">
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
  activityId: string;
};

const props = defineProps<Props>();
const courseActivitiesStore = useCourseActivitiesStore();

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const { data: activivesCourses, status, refresh } = await useAsyncData(
  `active_courses_with_activity_combinations_${props.activityId}`,
  async () =>
    await courseActivitiesStore.getActiveCoursesWithActivityCombinations(
      props.organizationId,
      props.activityId
    ), 
    {
      transform: (data) => {
        if (!data) return [];
        return data.map((course) => {
          return {
            has_combination: course.course_activities_combinations.some(cac => cac.course_id === course.id),
            ...course,
          }
        });
      }
    }
);

async function handleChange(courseId: string, value: boolean) {
  try {
    if (value) {
      await courseActivitiesStore.addCourseToAllowedCourses(
        props.activityId,
        courseId
      );
    } else {
      await courseActivitiesStore.removeCourseFromAllowedCourses(
        props.activityId,
        courseId
      );
    }
  } catch (error) {
    console.error("Error updating allowed courses:", error);
  } finally {
    refresh();
  }
} 
</script>

<style scoped></style>
