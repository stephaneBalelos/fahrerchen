<template>
    <UDashboardPage>
      <UDashboardPanel grow>
  
        <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
          <UHorizontalNavigation :links="links" />
        </UDashboardToolbar>
  
        <NuxtPage />
      </UDashboardPanel>
    </UDashboardPage>
  </template>
  
  <script setup lang="ts">
      definePageMeta({
    layout: 'orgs'
  })
  
  const route = useRoute()
  
  
  const links = [[{
    label: 'General',
    icon: 'i-heroicons-user-circle',
    to: `/my/courses/${route.params.id}`,
    exact: true
  }, {
    label: 'Students',
    icon: 'i-heroicons-user-group',
    to: `/my/courses/${route.params.id}/students`
  }], [{
    label: 'Einstellungen',
    icon: 'i-heroicons-cog-6-tooth',
    to: `/my/courses/${route.params.id}/settings`,
  }]]
  
  </script>
  
  <style scoped>
  
  </style>