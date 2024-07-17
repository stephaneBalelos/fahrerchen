<script setup lang="ts">
import { type Database } from '~/types/database.types';
import CreateCourseForm from '~/components/forms/CreateCourseForm.vue';
import type { AppCourse } from '~/types/app.types';

definePageMeta({
    layout: 'orgs',
})

const supabase = useSupabaseClient<Database>();
const orgState = useUserOrganizations()
const open = ref(false)
const toast = useToast()



const { data, error, status, refresh } = await useAsyncData('courses', async () => {
    const { data, error } = await supabase.from('courses').select('*').eq('organization_id', orgState.selected_organization_id.value)
    if (error) {
        throw error
    }
    console.log(data)
    return data
}, { watch: [orgState.selected_organization_id], immediate: true})

onMounted(async () => {
    console.log('mounted')
    await refresh()
})

const onCourseCreated = async (d: AppCourse) => {
    navigateTo('/my/courses/' + d.id)
}

</script>

<template>
    <UDashboardPanelContent>
        <UPageHeader class="courses-header" headline="Course" title="My Courses" description="All Courses" :links="[{ label: 'Create New Course', color: 'white', icon: 'i-heroicons-folder-plus', click: () => open = true }]" />
        <div v-if="data && data?.length > 0">
            <UDashboardCard v-for="d, index in data" :key="index" :title="d.name" class="course-card"
                :description="d.description ? d.description : 'No description'"
                :links="[{ label: 'Details', color: 'gray', trailingIcon: 'i-heroicons-arrow-right-20-solid', to: '/my/courses/' + d.id }]" />
        </div>
        <div v-else>
            // No data
            <UButton id="create-course-btn" @click="open = true">Create your first course</UButton>
        </div>
    </UDashboardPanelContent>

    <UDashboardSlideover v-model="open" title="Create News Course">
        <CreateCourseForm @course-created="onCourseCreated" />
        <template #footer>
            <UButton @click="open = false">Cancel</UButton>
        </template>
    </UDashboardSlideover>


</template>

<style scoped></style>