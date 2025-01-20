<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UNotifications id="notifications-container" />
  <USlideovers />
  <UModals />
</template>

<script setup lang="ts">

const nuxtApp = useNuxtApp();
const config = useRuntimeConfig().public;

nuxtApp.provide('publicStorageUrl', (bucket:string, path:string) => {
  return `${config.supabase_storage_url}/object/public/${bucket}/${path}`
})

</script>
