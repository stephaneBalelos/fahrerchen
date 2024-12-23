<template>
    <NuxtPage></NuxtPage>
</template>

<script setup lang="ts">
import organizations from '~/middleware/organizations';
import staffMember from '~/middleware/staff-member';
import studentProfile from '~/middleware/student-profile';
definePageMeta({
    layout: 'orgs',
    middleware: [organizations, staffMember],
})

const userOrganizationsStore = useUserOrganizationsStore();
const userPermissionStore = useUserPermissionsStore();
const route = useRoute();

await useAsyncData('userOrganizations', async () => {
    await userOrganizationsStore.loadOrganizationsMemberships();
    await userOrganizationsStore.selectOrganization(route.params.org_id as string);
    return true;
});

await useAsyncData('permissions', async () => {
  if (!userOrganizationsStore.selectedOrganization) return false;
  await userPermissionStore.loadPermissions(userOrganizationsStore.selectedOrganization.role);
  return true;
});
</script>

<style scoped>

</style>