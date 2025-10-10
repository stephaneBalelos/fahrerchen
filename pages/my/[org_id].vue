<template>
    <NuxtPage />
</template>

<script setup lang="ts">
import organizations from '~/middleware/organizations';
import staffMember from '~/middleware/staff-member';
definePageMeta({
    layout: 'orgs',
    middleware: [organizations, staffMember],
})

</script>

<style scoped>

</style>