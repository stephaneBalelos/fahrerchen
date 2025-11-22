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
const _organization = computed(
  () => userOrganizationsStore.selectedOrganization
);
</script>

<style scoped>

</style>