<template>
    <UDashboardPanelContent>
        <UPageHeader headline="Course" title="Führerscheinklasse A" description="All Courses"
            :links="[{ label: 'Create New Lesson', color: 'white', icon: 'i-heroicons-folder-plus', click: () => open = true }]" />

        <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <UDashboardCard v-if="lessons.data.value"title="Lesson in this course" description="List of all lessons in this course"
                icon="i-heroicons-chart-bar-20-solid">
                <NuxtLink v-for="(lesson, index) in lessons.data.value" :key="index"
                    class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative">
                    <UAvatar :icon="'i-heroicons-arrow-up-right'" size="md" />

                    <div class="text-sm flex-1">
                        <div>
                            <p class="text-gray-900 dark:text-white font-medium">
                                {{ lesson.id }}
                                <UBadge color="gray" variant="solid">{{ lesson.type }}</UBadge>
                                <UBadge v-if="lesson.mandatory" color="amber" variant="soft">Mandatory</UBadge>
                            </p>
                            <p class="text-gray-500 dark:text-gray-400">
                                {{ lesson.description }}
                            </p>
                        </div>
                    </div>

                    <p class="text-gray-900 dark:text-white font-medium text-lg">
                        {{ lesson.price }}
                    </p>
                </NuxtLink>
            </UDashboardCard>
        </div>
    </UDashboardPanelContent>



    <UDashboardSlideover v-model="open" title="Create News Lesson">
        <FormsCreateLessonForm @submit="createLesson"></FormsCreateLessonForm>
        <template #footer>
            <UButton @click="open = false">Cancel</UButton>
            <UButton @click="createLesson">Create</UButton>
        </template>
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

const course = await useAsyncData(`course_${route.params.id}`, async () => {
    const { data, error } = await supabase.from('courses').select('*').eq('id', route.params.id).single()
    if (error) {
        throw error
    }
    console.log(data)
    return data
})

const lessons = await useAsyncData(`lessons_${route.params.id}`, async () => {
    const { data, error } = await supabase.from('lessons').select('*').eq('course_id', route.params.id)
    if (error) {
        throw error
    }
    console.log(data)
    return data
})

watch(() => route.params, async () => {
    await course.refresh()
    await lessons.refresh()
}, { deep: true })




onMounted(async () => {
    console.log('mounted')
    await course.refresh()
    await lessons.refresh()
})

const open = ref(false)

const createLesson = async (d: CreateLessonSchema) => {
    if (d && course.data.value) {
        const { data, error } = await supabase.from('lessons').insert({
            course_id: course.data.value.id,
            description: d.description,
            type: d.type as Database["public"]["Enums"]["lesson_type"],
            mandatory: d.mandatory,
            price: d.price
        })
        if (error) {
            console.error(error)
        } else {
            open.value = false
            await lessons.refresh()
        }
        
    }
}

</script>

<style scoped></style>