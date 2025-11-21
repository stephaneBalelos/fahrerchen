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
const router = useRouter()

await useAsyncData('userOrganizations', async () => {
    console.log("router.currentRoute.value.params.org_id", router.currentRoute.value.params.org_id);
    await userOrganizationsStore.loadOrganizationsMemberships();
    userOrganizationsStore.selectedOrganizationId = router.currentRoute.value.params.org_id as string;
    console.log("userOrganizationsStore.organizations", userOrganizationsStore.selectedOrganization?.id);
    return true
});

await useAsyncData('permissions', async () => {
  if (!userOrganizationsStore.selectedOrganization) return false;
  await userPermissionStore.loadPermissions(userOrganizationsStore.selectedOrganization.organization_role);
  return true;
});
</script>

<style scoped>

</style>