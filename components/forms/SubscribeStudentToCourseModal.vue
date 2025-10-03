<template>
    <UModal>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <p class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            {{ t('subscribe_student_to_course', { student: `${props.student.firstname} ${props.student.lastname}` }) }}
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ props.student.email }}
          </p>
        </template>

        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('select_course_for_subscription') }}
          </p>
          
            <div class="mt-4">
                <CourseSelect
                v-model="selectedCourseId"
                :orgid="props.student.organization_id"
                />
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end space-x-2">
                <UButton
                color="white"
                variant="ghost"
                :label="t('cancel')"
                @click="$emit('close')"
                />
                <UButton
                color="primary"
                :label="t('subscribe')"
                :disabled="!selectedCourseId"
                @click="$emit('subscribe', selectedCourseId)"
                />
            </div>
        </template>
      </UCard>
    </UModal>
</template>

<script setup lang="ts">
import type { AppStudent } from '~/types/app.types';
import CourseSelect from '~/components/forms/Inputs/CourseSelect.vue';


type Props = {
    student: AppStudent;
}
const props = defineProps<Props>();
const { t } = useI18n({ useScope: 'local' });
const $emit = defineEmits<{
    (e: 'close'): void;
    (e: 'subscribe', courseId?: string): void;
}>();


const selectedCourseId = ref<string>();
</script>

<style scoped>

</style>

<i18n lang="json">
{
  "en": {
    "subscribe_student_to_course": "Subscribe {student} to a course",
    "select_course_for_subscription": "Select a course to subscribe the student to.",
    "cancel": "Cancel",
    "subscribe": "Subscribe"
  },
  "de": {
    "subscribe_student_to_course": "{student} zu einem Kurs einschreiben",
    "select_course_for_subscription": "Wählen Sie einen Kurs aus, in den der Schüler eingeschrieben werden soll.",
    "cancel": "Abbrechen",
    "subscribe": "Einschreiben"
  }
}
</i18n>