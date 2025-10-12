<template>
    <NuxtPage />
</template>

<script setup lang="ts">
import organizations from '~/middleware/organizations';
import studentProfile from '~/middleware/student-profile';
definePageMeta({
    layout: 'students',
    middleware: [organizations, studentProfile],
})

const userOrganizationsStore = useUserOrganizationsStore();
const userStore = useUserStore();
const userPermissionStore = useUserPermissionsStore();
const studentStore = useStudentStore();
const route = useRoute();

await useAsyncData('userOrganizations', async () => {
    await userOrganizationsStore.loadOrganizationsMemberships();
    console.log("userOrganizationsStore.organizations", userOrganizationsStore.selectedOrganization?.id);
    return true
});

await useAsyncData('permissions', async () => {
  if (!userOrganizationsStore.selectedOrganization) return false;
  await userPermissionStore.loadPermissions(userOrganizationsStore.selectedOrganization.organization_role);
  return true;
});

await useAsyncData('student', async () => {
    if(!userStore.user) return false;
    await studentStore.loadStudent(route.params.org_id as string, userStore.user.id);
    return true;
});

</script>

<style scoped>

</style>