<template>
  <UDashboardLayout>
    <UDashboardPage>
      <UDashboardPanel grow>
        <UDashboardNavbar
          title="Karjolen App"
          :badge="runtimeConfig.public.app_version"
        >
          <template #title>
            <NuxtLink to="/"> Karjolen App </NuxtLink>
          </template>
          <template #right>
            <NavigationUserMenu />
          </template>
        </UDashboardNavbar>

        <slot />
      </UDashboardPanel>
    </UDashboardPage>
  </UDashboardLayout>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
</script>

<style scoped></style>
