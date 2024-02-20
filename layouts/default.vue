<template>
    <UMain>
        <UHeader :links="links">
            <template #logo>
                <Logo class="w-auto h-6" />
            </template>

            <template #right>
                <UDocsSearchButton label="" />

                <UColorModeButton />

                <UButton to="https://github.com/nuxt/ui" target="_blank" icon="i-simple-icons-github" color="gray"
                    variant="ghost" />
            </template>

            <template #panel>
                Panel
            </template>
        </UHeader>
        <slot></slot>
    </UMain>
</template>

<script setup lang="ts">

const links = [{
  label: 'Docs',
  icon: 'i-heroicons-book-open',
  to: '/getting-started'
}, {
  label: 'Pro',
  icon: 'i-heroicons-square-3-stack-3d',
  to: '/pro'
}, {
  label: 'Releases',
  icon: 'i-heroicons-rocket-launch',
  to: '/releases'
}]
</script>

<style scoped></style>