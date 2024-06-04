<template>
    <UDashboardPanelContent>
        <UPageHeader headline="Fahrschüler:innen" title="Meine Fahrschüler:innen" description="Alle meine Fahrschüler:innen"
            :links="[{ label: 'Neue Fahrschüler:in', color: 'white', icon: 'i-heroicons-folder-plus', click: () => open = !open }]" />

            <UsersTables :data="students ? students : []"></UsersTables>
    </UDashboardPanelContent>

    <UDashboardSlideover v-model="open" title="Create News Course">
        <CreateUserForm @submit="createUser" />
        <template #footer>
            <UButton @click="open = false">Cancel</UButton>
        </template>
    </UDashboardSlideover>
</template>

<script setup lang="ts">
import UsersTables from '~/components/tables/UsersTables.vue';
import type { Database } from '~/types/database.types';
import CreateUserForm from '~/components/forms/CreateUserForm.vue';


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

const open = ref(false)

const createUser = async (d: any) => {
    console.log(d)
}

</script>

<style scoped></style>