<template>
  <CoursesSettingsAllowedSubscriptionListItem 
    :is-loading="status !== 'success'" :is-allowed="data ? true : false" :course="props.course" 
    :remove-course-from-allowed-courses="removeCourseFromAllowedCourses" 
    :add-course-to-allowed-courses="addCourseToAllowedCourses" />
</template>

<script setup lang="ts">
import type { AppCourse } from '~/types/app.types';

type Props = {
  course: AppCourse
  activityId: string;
};

const props = defineProps<Props>();
const courseActivitiesStore = useCourseActivitiesStore();


const { data, refresh, status } = useAsyncData(
  `course_activities_combination_${props.activityId}_${props.course.id}`,
  () =>
    courseActivitiesStore.getAllowedCourseForActivity(
      props.activityId,
      props.course.id
    ),
  {
    transform: (data) => data[0] || null,
     immediate: true, watch: [() => props.activityId, () => props.course.id] }
);

const addCourseToAllowedCourses = async () => {
  await courseActivitiesStore.addCourseToAllowedCourses(props.activityId, props.course.id);
  await refresh();
};

const removeCourseFromAllowedCourses = async () => {
  await courseActivitiesStore.removeCourseFromAllowedCourses(props.activityId, props.course.id);
  await refresh();
};
</script>

<style scoped></style>
