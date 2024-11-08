<template>
    <UMain class="grid place-items-center">
        <UContainer :ui="{ base: 'flex flex-col gap-8 justify-center items-center' }">
            <slot></slot>
            <LocaleSwitcher />
        </UContainer>
    </UMain>
</template>

<script setup lang="ts">
import LocaleSwitcher from '~/components/settings/LocaleSwitcher.vue';

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const config = useRuntimeConfig()
</script>

<style scoped>

</style>