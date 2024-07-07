<template>
  <UDashboardPanelContent
    class="p-0 pb-24 divide-y divide-gray-200 dark:divide-gray-800"
  >

  <CourseActivitiesList :orgid="props.orgid" :courseid="props.courseid" />

  <CourseRequirementsList :orgid="props.orgid" :courseid="props.courseid" />

  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import CourseActivitiesList from "~/components/settings/CourseActivitiesList.vue";
import CourseRequirementsList from "~/components/settings/CourseRequirementList.vue";

type Props = {
  orgid: string;
  courseid: string;
};

const props = useAttrs() as Props;
</script>

<style scoped></style>
