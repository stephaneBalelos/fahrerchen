<template>
    <UDashboardPanelContent>
        <UPageHeader headline="Fahrschüler:innen" title="Meine Fahrschüler:innen" description="Alle meine Fahrschüler:innen"
            :links="[{ label: 'Neue Fahrschüler:in', color: 'white', icon: 'i-heroicons-folder-plus', click: () => console.log('add') }]" />

            <UsersTables :data="students ? students : []"></UsersTables>
    </UDashboardPanelContent>
</template>

<script setup lang="ts">
import UsersTables from '~/components/tables/UsersTables.vue';
import type { Database } from '~/types/database.types';


definePageMeta({
    layout: 'orgs',
})

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

const client = useSupabaseClient<Database>()
const { data: students } = await useAsyncData('students', async () => {
    const { data, error } = await client.from('users').select('*')
    if (error) {
        throw error
    }
    return data
})

const people = [{
    id: 1,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
}, {
    id: 2,
    name: 'Courtney Henry',
    title: 'Designer',
    email: 'courtney.henry@example.com',
    role: 'Admin'
}, {
    id: 3,
    name: 'Tom Cook',
    title: 'Director of Product',
    email: 'tom.cook@example.com',
    role: 'Member'
}, {
    id: 4,
    name: 'Whitney Francis',
    title: 'Copywriter',
    email: 'whitney.francis@example.com',
    role: 'Admin'
}, {
    id: 5,
    name: 'Leonard Krasner',
    title: 'Senior Designer',
    email: 'leonard.krasner@example.com',
    role: 'Owner'
}, {
    id: 6,
    name: 'Floyd Miles',
    title: 'Principal Designer',
    email: 'floyd.miles@example.com',
    role: 'Member'
}]

</script>

<style scoped></style>