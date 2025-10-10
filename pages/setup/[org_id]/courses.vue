<template>
      <CoursesSetup
        v-if="userOrganizationsStore.selectedOrganization"
        :org-id="userOrganizationsStore.selectedOrganization?.id"
        @course-setup-completed="() => navigateTo(`/setup/${userOrganizationsStore.selectedOrganization?.id}/activities`)"
      />
</template>

<script setup lang="ts">
import CoursesSetup from "~/components/setup/CoursesSetup.vue";
const userOrganizationsStore = useUserOrganizationsStore();
// const coursesStore = useCoursesStore();
</script>

<style scoped></style>
