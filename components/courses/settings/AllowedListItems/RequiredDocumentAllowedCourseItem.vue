<template>
  <AllowedCourseListItemTemplate
    :is-loading="status !== 'success'" :is-allowed="data ? true : false" :course="props.course" 
    :remove-course-from-allowed-courses="detachRequiredDocumentFromCourse" 
    :add-course-to-allowed-courses="attachRequiredDocumentToCourse" />
</template>

<script setup lang="ts">
import type { AppCourse } from '~/types/app.types';
import AllowedCourseListItemTemplate from './AllowedCourseListItemTemplate.vue';

type Props = {
  course: AppCourse
  requiredDocumentId: string;
};

const props = defineProps<Props>();
const courseRequiredDocumentsStore = useCourseRequiredDocumentsStore();

const { data, refresh, status } = useAsyncData(
  `course_required_document_combination_${props.requiredDocumentId}_${props.course.id}`,
  () =>
    courseRequiredDocumentsStore.getAllowedCourseForRequiredDocument(
      props.requiredDocumentId,
      props.course.id
    ),
  {
    transform: (data) => data[0] || null,
     immediate: true, watch: [() => props.requiredDocumentId, () => props.course.id] }
);

const attachRequiredDocumentToCourse = async () => {
  await courseRequiredDocumentsStore.addRequiredDocumentToCourse(props.requiredDocumentId, props.course.id);
  await refresh();
};

const detachRequiredDocumentFromCourse = async () => {
  await courseRequiredDocumentsStore.removeRequiredDocumentFromCourse(props.requiredDocumentId, props.course.id);
  await refresh();
};
</script>

<style scoped></style>
