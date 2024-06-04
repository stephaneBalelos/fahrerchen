<template>
    <UTable :rows="props.data" :columns="columns" />
</template>

<script setup lang="ts">
import type { Database } from '~/types/database.types';

type UsersData = {
    data: Database['public']['Tables']['users']['Row'][]
}

const props = defineProps<UsersData>()
const columns = [{
        key: 'id',
        label: 'ID'
    }, {
        key: 'name',
        label: 'Name'
    }, {
        key: 'title',
        label: 'Title'
    }, {
        key: 'email',
        label: 'Email'
    }, {
        key: 'role',
        label: 'Role'
}]
</script>

<style scoped></style>