<template>
    <UMain>
        <UHeader>
            <template #logo>
                <Logo class="w-auto h-6" />
            </template>

            <template #right>
                <UDocsSearchButton label="" />

                <UColorModeButton />

                <UButton to="https://github.com/nuxt/ui" target="_blank" icon="i-simple-icons-github" color="gray"
                    variant="ghost" />
            </template>
        </UHeader>
        <UContainer :ui="{ base: 'flex justify-center items-center' }">
            <slot></slot>
        </UContainer>
    </UMain>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>