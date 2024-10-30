<template>
  <UDashboardNavbar title="External" :badge="runtimeConfig.public.app_version">
    <template #title> Payments </template>
  </UDashboardNavbar>
  <ULandingSection
    title="Hallo User"
    description="Sie haben eine neue Zahlung Anforderung erhalten"
    :links="[{ label: 'Continue', color: 'gray', trailingIcon: 'i-heroicons-arrow-right', size: 'lg' }]"
    align="left"
  >
    <img
      src="https://picsum.photos/360/360"
      class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
    />
  </ULandingSection>
</template>

<script setup lang="ts">
    const runtimeConfig = useRuntimeConfig();

    

</script>

<style scoped></style>
