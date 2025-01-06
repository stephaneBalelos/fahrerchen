<template>
    <NuxtPage />
</template>

<script setup lang="ts">
import userProfile from '~/middleware/user-profile';

    definePageMeta({
        layout: 'default',
        middleware: [userProfile],
    })
</script>

<style scoped>

</style>