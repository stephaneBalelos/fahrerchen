<template>
    <div>
        <UHeader>
          <template #logo>
            <AppLogo />
          </template>
          <template #right>
            <UColorModeButton />
            <NavigationUserMenu />
          </template>
        </UHeader>
        <UMain class="">
          <slot />
        </UMain>
    </div>
</template>

<script setup lang="ts">
import AppLogo from '~/components/ui/AppLogo.vue';
</script>

<style scoped></style>