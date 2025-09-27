<template>
  <CoursesSettingsAllowedSubscriptionListItem 
    :is-loading="status !== 'success'" :is-allowed="data ? true : false" :course="props.course" 
    :remove-course-from-allowed-courses="detachCostFromCourse" 
    :add-course-to-allowed-courses="attachCostToCourse" />
</template>

<script setup lang="ts">
import type { AppCourse } from '~/types/app.types';

type Props = {
  course: AppCourse
  costId: string;
};

const props = defineProps<Props>();
const courseCostsStore = useCourseCostsStore();

const { data, refresh, status } = useAsyncData(
  `course_cost_combination_${props.costId}_${props.course.id}`,
  () =>
    courseCostsStore.getAllowedCourseForCost(
      props.costId,
      props.course.id
    ),
  {
    transform: (data) => data[0] || null,
     immediate: true, watch: [() => props.costId, () => props.course.id] }
);

const attachCostToCourse = async () => {
  await courseCostsStore.addCostToCourse(props.costId, props.course.id);
  await refresh();
};

const detachCostFromCourse = async () => {
  await courseCostsStore.removeCostFromCourse(props.costId, props.course.id);
  await refresh();
};
</script>

<style scoped></style>
