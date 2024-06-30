<template>
    <UDashboardPanelContent>
        <UPageHeader headline="Course" :title="course?.name" :description="course?.description"
            :links="[{ label: 'Create New Lesson', color: 'white', icon: 'i-heroicons-folder-plus', click: () => open = true }]" />

        <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <UDashboardCard title="Lesson in this course" description="List of all lessons in this course"
                icon="i-heroicons-chart-bar-20-solid">

            </UDashboardCard>
        </div>
    </UDashboardPanelContent>



    <UDashboardSlideover v-model="open" title="Create News Lesson">

    </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { CreateLessonSchema } from '~/components/forms/CreateLessonForm.vue';
import type { Database } from '~/types/database.types';

definePageMeta({
    layout: 'orgs',
})
const route = useRoute()
const orgState = useGlobalOrgState()
const supabase = useSupabaseClient<Database>();

const {data: course, error, refresh } = await useAsyncData(`course_${route.params.id}`, async () => {
    const { data, error } = await supabase.from('courses').select('*').eq('id', route.params.id).single()
    if (error) {
        throw error
    }
    console.log(data)
    return data
})


watch(() => route.params, async () => {
    await refresh()
}, { deep: true })




// onMounted(async () => {
//     console.log('mounted')
//     await refresh()
// })

const open = ref(false)


</script>

<style scoped></style>