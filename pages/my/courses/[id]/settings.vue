<template>
  <UDashboardPanelContent
    class="p-0 pb-24 divide-y divide-gray-200 dark:divide-gray-800"
  >

  <EditCourseSection :orgid="props.orgid" :courseid="props.courseid" />

  <CourseActivitiesList :orgid="props.orgid" :courseid="props.courseid" />

  <CourseRequirementsList :orgid="props.orgid" :courseid="props.courseid" />

  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import CourseActivitiesList from "~/components/courses/settings/CourseActivitiesList.vue";
import CourseRequirementsList from "~/components/courses/settings/CourseRequiredDocumentsList.vue";
import EditCourseSection from "~/components/courses/settings/EditCourseSection.vue";

type Props = {
  orgid: string;
  courseid: string;
};

const props = useAttrs() as Props;
</script>

<style scoped></style>
