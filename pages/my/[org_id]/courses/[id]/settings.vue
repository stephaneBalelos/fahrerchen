<template>
  <UDashboardPanelContent
    class="p-0 pb-24 divide-y divide-gray-200 dark:divide-gray-800"
    v-if="userOrganizationsStore.selectedOrganization"
  >

  <EditCourseSection :orgid="userOrganizationsStore.selectedOrganization.organization_id" :courseid="props.courseid" />

  <CourseActivitiesList :orgid="userOrganizationsStore.selectedOrganization.organization_id" :courseid="props.courseid" />

  <CourseRequirementsList :orgid="userOrganizationsStore.selectedOrganization.organization_id" :courseid="props.courseid" />

  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import CourseActivitiesList from "~/components/courses/settings/CourseActivitiesList.vue";
import CourseRequirementsList from "~/components/courses/settings/CourseRequiredDocumentsList.vue";
import EditCourseSection from "~/components/courses/settings/EditCourseSection.vue";

type Props = {
  courseid: string;
};

const props = useAttrs() as Props;
const userOrganizationsStore = useUserOrganizationsStore();

</script>

<style scoped></style>
