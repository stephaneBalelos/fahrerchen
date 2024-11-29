<template>
  {{ organizationsStore.selectedOrganization?.id ?? "No organization selected" }}
  <NuxtPage></NuxtPage>
</template>

<script setup lang="ts">
import organizations from '~/middleware/organizations';
const organizationsStore = useUserOrganizationsStore();


definePageMeta({
  layout: "orgs",
  middleware: [organizations],
});
</script>

<style scoped></style>
