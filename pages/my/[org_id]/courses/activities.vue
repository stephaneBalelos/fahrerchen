<template>
  <UDashboardPanelContent>
    <CoursesSettingsCourseActivitiesList
      v-if="userOrganizationsStore.selectedOrganization"
      :orgid="userOrganizationsStore.selectedOrganization.id"
    />
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
const userOrganizationsStore = useUserOrganizationsStore();
</script>

<style scoped></style>
