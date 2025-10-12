<template>
<div class="flex flex-col gap-2">
    <div>
        <p class="font-medium">{{ t('title') }}</p>
    </div>
    <div class="flex flex-col gap-2">
        <div v-for="(a) in activities" :key="a.id" class="flex items-center w-full justify-between gap-6">
            <div class="flex flex-col flex-1">
                <p class="font-medium">{{ a.name }}</p>
                <p class="text-sm text-gray-500">{{ a.description }}</p>
            </div>
            <div v-if="a.required" class="flex flex-col items-end">
                <p class="font-medium">{{ a.required }} </p>
                <p class="text-sm text-gray-500">{{ t('minimum_required') }}</p>
            </div>
            <div class="flex flex-col items-end">
                <p class="font-medium">{{ formatCurrency(a.price) }} </p>
                <p class="text-sm text-gray-500 ml-1">{{ t('price') }}</p>
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { formatCurrency } from '~/utils/formatters';


type Props = {
    courseId: string
}

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();

const client = useSupabaseClient();
const courseActivitiesStore = useCourseActivitiesStore();

const { data } = useAsyncData(`course-activities-${props.courseId}`, async () => {
    const { data, error } = await client
        .from('course_activities_combinations')
        .select('*')
        .eq('course_id', props.courseId)
    if (error) {
        console.error("Error loading course costs:", error)
        return []
    }
    return data || []
})

const activities = computed(() => {
    if(!data.value) {
        return []
    }
    const activities = []
    for(const d of data.value) {
        const activity = courseActivitiesStore.courseActivities.find((c) => c.id === d.activity_id)
        if(activity) {
            const a = {
                id: d.id,
                name: activity.name,
                description: activity.description,
                price: d.price ? d.price : activity.price,
                required: d.required ? d.required : activity.required
            }
            activities.push(a)
        }
    }
    return activities
})

</script>

<style scoped>

</style>

<i18n lang="json">
{
  "de": {
    "title": "Kursaktivitäten",
    "minimum_required": "Min. Teilnahme",
    "price": "Preis"
  },
  "en": {
    "title": "Course activities",
    "minimum_required": "Min. participation",
    "price": "Price"
  }
}</i18n>