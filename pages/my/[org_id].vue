<template>
    <NuxtPage></NuxtPage>
</template>

<script setup lang="ts">
import organizations from '~/middleware/organizations';
definePageMeta({
    layout: 'orgs',
    middleware: [organizations],
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