<template>
    <div>
        <NuxtLink to="/my">redirect..</NuxtLink>
    </div>
</template>

<script setup lang="ts">

definePageMeta({
    layout: 'auth',
    middleware: [
        function (to, from) {
            return navigateTo("/my")
        }
    ]
})

</script>

<style scoped>

</style>