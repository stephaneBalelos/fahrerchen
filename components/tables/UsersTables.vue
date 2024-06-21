<template>
    <UTable :rows="props.data" :columns="columns" />
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';

type UsersData = {
    data: Database['public']['Views']['user_roles_view']['Row'][]
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
    }]
</script>

<style scoped></style>