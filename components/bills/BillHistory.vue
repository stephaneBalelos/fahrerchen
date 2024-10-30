<template>
    <div class="pt-4">
        <ul>
            <li v-for="i in items" :key="i.id" class="pb-2 text-gray-500">
                {{i.username }} {{ i.description }} - {{ formatDate(i.inserted_at) }} 
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { id } from 'date-fns/locale';
import { formatDate } from '~/utils/formatters';



const items = ref([
    {
        id: 1,
        username: 'John Doe',
        description: 'Payment for course',
        inserted_at: '2021-10-10'
    },
    {
        id: 2,
        username: 'Jane Doe',
        description: 'Bill item added',
        inserted_at: '2021-10-11'
    }
])
</script>

<style scoped>

</style>