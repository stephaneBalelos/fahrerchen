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

const user = useSupabaseUser();
const router = useRouter();

if (user.value) {
    // Redirect to dashboard if user is logged in
    router.push('/')
}
</script>

<style scoped>

</style>