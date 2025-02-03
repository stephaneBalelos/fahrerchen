<template>
  <UDashboardLayout>
    <UDashboardPage>
      <slot></slot>
    </UDashboardPage>
  </UDashboardLayout>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
</script>

<style scoped>

</style>