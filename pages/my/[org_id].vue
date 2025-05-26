<template>
    <NuxtPage />
</template>

<script setup lang="ts">
import organizations from '~/middleware/organizations';
import staffMember from '~/middleware/staff-member';
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
  await userPermissionStore.loadPermissions(userOrganizationsStore.selectedOrganization.organization_role);
  return true;
});

onUnmounted(() => {
    userOrganizationsStore.clearSelectedOrganization();
});
</script>

<style scoped>

</style>