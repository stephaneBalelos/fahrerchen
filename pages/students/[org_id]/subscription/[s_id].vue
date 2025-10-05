<template>
  <NuxtPage />
</template>

<script setup lang="ts">


const studentStore = useStudentStore();

if (!studentStore.selectedSubscription) {
    createError({ statusCode: 404, statusMessage: 'Subscription not found' });
}

</script>

<style scoped></style>

