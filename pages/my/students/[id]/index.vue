<template>

</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';

    definePageMeta({
  layout: "orgs",
});

const route = useRoute();
const userId = route.params.id;
const client = useSupabaseClient<Database>();


function deleteStudent() {
    console.log('delete student');

}

</script>

<style scoped>

</style>