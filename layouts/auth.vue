<template>
    <UMain class="grid place-items-center">
        <UContainer :ui="{ base: 'flex justify-center items-center' }">
            <slot></slot>
        </UContainer>
    </UMain>
</template>

<script setup lang="ts">
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const config = useRuntimeConfig()
</script>

<style scoped>

</style>