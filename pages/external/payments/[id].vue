<template>
    <div>
        {{ route.params.id }}
    </div>
</template>

<script setup lang="ts">
    const runtimeConfig = useRuntimeConfig();
    const route = useRoute();

</script>

<style scoped>

</style>