<script setup lang="ts">
import { type Database } from '~/types/database.types';
import CreateCourseForm from '~/components/forms/CreateCourseForm.vue';

definePageMeta({
    layout: 'orgs',
})

const supabase = useSupabaseClient<Database>();
const orgState = useGlobalOrgState()
const open = ref(false)
const toast = useToast()


console.log(orgState.org.value)

const { data, pending, status, refresh } = await useAsyncData('courses', async () => {
    const { data, error } = await supabase.from('courses').select('*').eq('organisation_id', orgState.org.value)
    if (error) {
        throw error
    }
    console.log(data)
    return data
}, { watch: [orgState.org], immediate: true})

onMounted(async () => {
    console.log('mounted')
    await refresh()
})

const createCourse = async (d: any) => {
    console.log(d)
    if (orgState.org.value && d.description) {
        const { data, error } = await supabase.from('courses').insert({ description: d.description, organisation_id: orgState.org.value}).select('*')
        if (error) {
            toast.add({ title: 'Error', description: error.message, color: 'red', icon: 'i-heroicons-exclamation', timeout: 5000})
        } else {
            toast.add({ title: 'Super!', description: 'New Course Created', color: 'green', icon: 'i-heroicons-exclamation', timeout: 3000})
            open.value = false
            navigateTo('/my/courses/' + data[0].id)

        }
    }
}

</script>

<template>
    <UDashboardPanelContent>
        <UPageHeader headline="Course" title="My Courses" description="All Courses" :links="[{ label: 'Create New Course', color: 'white', icon: 'i-heroicons-folder-plus', click: () => open = true }]" />
        <div v-if="data && data?.length > 0">
            <UDashboardCard v-for="d, index in data" :key="index" :title="d.id"
                :description="d.description ? d.description : 'No description'"
                :links="[{ label: 'Learn more', color: 'gray', trailingIcon: 'i-heroicons-arrow-right-20-solid', to: '/my/courses/' + d.id }]" />
        </div>
        <div v-else>
            // No data
            <UButton @click="open = true">Create your first course</UButton>
        </div>
    </UDashboardPanelContent>

    <UDashboardSlideover v-model="open" title="Create News Course">
        <CreateCourseForm @submit="createCourse" />
        <template #footer>
            <UButton @click="open = false">Cancel</UButton>
            <UButton @click="createCourse">Create</UButton>
        </template>
    </UDashboardSlideover>


</template>

<style scoped></style>