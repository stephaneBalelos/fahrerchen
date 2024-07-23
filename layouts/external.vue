<template>
  <UDashboardLayout>
    <UDashboardPage>
      <UDashboardPanel grow>

        <slot></slot>
      </UDashboardPanel>
    </UDashboardPage>
  </UDashboardLayout>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
</script>

<style scoped>

</style>