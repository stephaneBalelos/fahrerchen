<template>
      <CoursesSetup
        v-if="userOrganizationsStore.selectedOrganization"
        :org-id="userOrganizationsStore.selectedOrganization?.id"
      />
</template>

<script setup lang="ts">
import CoursesSetup from "~/components/setup/CoursesSetup.vue";
const userOrganizationsStore = useUserOrganizationsStore();
// const coursesStore = useCoursesStore();
</script>

<style scoped></style>
