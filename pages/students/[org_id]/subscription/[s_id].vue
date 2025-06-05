<template>
  <NuxtPage />
</template>

<script setup lang="ts">

const route = useRoute();
const subscriptionStore = useSubscriptionStore();
const subscription_id = route.params.s_id as string;

await useAsyncData(async () => {
  return await subscriptionStore.loadSubscription(subscription_id);
})

onUnmounted(() => {
  subscriptionStore.reset();
});

</script>

<style scoped></style>

